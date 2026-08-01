import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { ENV } from "./env";

export interface ScrapeResult {
  title: string;
  text: string;
}

/** Raised when a scrape target is rejected by the SSRF guard. */
export class SsrfBlockedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SsrfBlockedError";
  }
}

/**
 * Fetch and extract readable text from a URL. Uses Firecrawl when a key is set,
 * otherwise native fetch + a lightweight HTML→text pass (no heavy deps).
 *
 * The target URL is validated by an SSRF guard first so neither path can be
 * pointed at internal infrastructure or cloud metadata endpoints.
 */
export async function scrapeUrl(url: string): Promise<ScrapeResult> {
  await assertPublicUrl(url);
  if (ENV.firecrawlApiKey) {
    try {
      return await scrapeWithFirecrawl(url);
    } catch (error) {
      console.warn("[Scrape] Firecrawl failed, falling back to fetch:", error);
    }
  }
  return scrapeWithFetch(url);
}

async function scrapeWithFirecrawl(url: string): Promise<ScrapeResult> {
  const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ENV.firecrawlApiKey}`,
    },
    body: JSON.stringify({ url, formats: ["markdown"] }),
  });
  if (!res.ok) throw new Error(`Firecrawl ${res.status}`);
  const data = (await res.json()) as {
    data?: { markdown?: string; metadata?: { title?: string } };
  };
  return {
    title: data.data?.metadata?.title ?? url,
    text: data.data?.markdown ?? "",
  };
}

/** Redirect hops to follow before giving up. */
const MAX_REDIRECTS = 5;
/** Hard cap on how much of a response body we read into memory. */
const MAX_BODY_BYTES = 1_000_000;

async function scrapeWithFetch(url: string): Promise<ScrapeResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    // Follow redirects manually: `assertPublicUrl` only vetted the URL the user
    // supplied, and a public URL is free to 302 at an internal host or the
    // cloud-metadata endpoint. Every hop is re-validated before we follow it.
    let current = url;
    for (let hop = 0; ; hop++) {
      const res = await fetch(current, {
        signal: controller.signal,
        redirect: "manual",
        headers: { "user-agent": "Mozilla/5.0 (compatible; YawnBot/1.0)" },
      });

      const location = res.status >= 300 && res.status < 400 ? res.headers.get("location") : null;
      if (!location) {
        const html = await readCapped(res);
        return { title: extractTitle(html) ?? url, text: htmlToText(html) };
      }

      if (hop >= MAX_REDIRECTS) {
        throw new SsrfBlockedError("Too many redirects.");
      }
      // `Location` may be relative — resolve it against the URL we just fetched.
      const next = new URL(location, current).toString();
      await assertPublicUrl(next);
      current = next;
    }
  } finally {
    clearTimeout(timeout);
  }
}

/** Reads at most MAX_BODY_BYTES of the response body as UTF-8 text. */
async function readCapped(res: Response): Promise<string> {
  if (!res.body) return "";
  const decoder = new TextDecoder("utf-8");
  const reader = res.body.getReader();
  let read = 0;
  let out = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      const remaining = MAX_BODY_BYTES - read;
      if (value.byteLength >= remaining) {
        out += decoder.decode(value.subarray(0, remaining));
        break;
      }
      read += value.byteLength;
      out += decoder.decode(value, { stream: true });
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  return out;
}

function extractTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? decodeEntities(m[1].trim()) : null;
}

function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  ).slice(0, 8000);
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

/**
 * SSRF guard. Rejects anything that isn't a plain http(s) URL, and blocks
 * hostnames that resolve to loopback, private, link-local (incl. the
 * 169.254.169.254 cloud-metadata address), or otherwise non-public ranges.
 * DNS is resolved so a public hostname pointing at an internal IP is also
 * caught. Throws {@link SsrfBlockedError} on rejection.
 */
export async function assertPublicUrl(rawUrl: string): Promise<void> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new SsrfBlockedError("Invalid URL.");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new SsrfBlockedError(`Unsupported URL scheme: ${parsed.protocol}`);
  }

  const host = parsed.hostname.replace(/^\[|\]$/g, ""); // strip IPv6 brackets
  if (!host || host.toLowerCase() === "localhost" || host.toLowerCase().endsWith(".localhost")) {
    throw new SsrfBlockedError("Refusing to fetch a loopback host.");
  }

  // Resolve the hostname (or accept a literal IP) and check every address.
  let addresses: string[];
  if (isIP(host)) {
    addresses = [host];
  } else {
    try {
      const records = await lookup(host, { all: true });
      addresses = records.map((r) => r.address);
    } catch {
      throw new SsrfBlockedError("Could not resolve host.");
    }
  }
  if (addresses.length === 0) {
    throw new SsrfBlockedError("Host did not resolve to any address.");
  }
  for (const addr of addresses) {
    if (!isPublicAddress(addr)) {
      throw new SsrfBlockedError("URL resolves to a non-public address.");
    }
  }
}

/** True only for addresses outside loopback/private/link-local/reserved ranges. */
function isPublicAddress(addr: string): boolean {
  const kind = isIP(addr);
  if (kind === 4) return isPublicIPv4(addr);
  if (kind === 6) return isPublicIPv6(addr);
  return false;
}

function isPublicIPv4(addr: string): boolean {
  const parts = addr.split(".").map((n) => Number(n));
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return false;
  }
  const [a, b] = parts;
  if (a === 0) return false; // "this" network
  if (a === 10) return false; // 10.0.0.0/8 private
  if (a === 127) return false; // loopback
  if (a === 169 && b === 254) return false; // link-local (incl. 169.254.169.254 metadata)
  if (a === 172 && b >= 16 && b <= 31) return false; // 172.16.0.0/12 private
  if (a === 192 && b === 168) return false; // 192.168.0.0/16 private
  if (a === 100 && b >= 64 && b <= 127) return false; // 100.64.0.0/10 CGNAT
  if (a >= 224) return false; // multicast + reserved
  return true;
}

function isPublicIPv6(addr: string): boolean {
  const ip = addr.toLowerCase().split("%")[0]; // drop zone id
  if (ip === "::1" || ip === "::") return false; // loopback / unspecified
  if (ip.startsWith("fe80")) return false; // link-local
  if (ip.startsWith("fc") || ip.startsWith("fd")) return false; // unique-local fc00::/7
  if (ip.startsWith("ff")) return false; // multicast
  // IPv4-mapped (::ffff:a.b.c.d) — validate the embedded IPv4.
  const mapped = ip.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isPublicIPv4(mapped[1]);
  return true;
}
