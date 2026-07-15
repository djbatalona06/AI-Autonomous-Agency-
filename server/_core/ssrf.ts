import dns from "node:dns/promises";
import net from "node:net";

/**
 * SSRF (Server-Side Request Forgery) guard for outbound fetches driven by
 * user-supplied URLs (the web crawler).
 *
 * Threat model: a user submits a URL that the *server* then fetches. Without
 * guards they can make the server reach addresses the user never could —
 * cloud metadata endpoints (169.254.169.254 → IAM credentials), loopback
 * admin panels, and other hosts on the private network. See
 * docs/security/penetration-test-plan.md (#7).
 *
 * Defenses, layered:
 *   1. Allow only http/https — no file:, gopher:, ftp:, data:, etc.
 *   2. Reject embedded credentials (user:pass@host).
 *   3. Resolve the hostname and reject if ANY resolved IP is private,
 *      loopback, link-local, CGNAT, multicast or otherwise non-public. This
 *      also blocks DNS-rebinding-by-name (e.g. a domain that resolves to
 *      127.0.0.1).
 *   4. `safeFetch` re-validates the target on every redirect hop (redirects
 *      are a classic SSRF bypass), caps redirects, enforces a timeout, and
 *      caps the response body size.
 *
 * Residual risk: a TOCTOU DNS-rebinding race (resolve returns a public IP,
 * then the name re-resolves to a private IP for the actual connection) is not
 * fully closed here because Node's fetch re-resolves internally. For full
 * closure pin the connection to the validated IP via a custom agent/lookup.
 * For this app the redirect-hop re-validation + range blocking covers the
 * practical attack surface; the deeper fix is tracked as a hardening item.
 */

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

/** Max bytes we will read from a scraped response (defense against huge bodies). */
export const MAX_RESPONSE_BYTES = 5 * 1024 * 1024; // 5 MiB
const MAX_REDIRECTS = 3;
const DEFAULT_TIMEOUT_MS = 12_000;

export class SsrfError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SsrfError";
  }
}

function ipv4ToInt(ip: string): number {
  return ip.split(".").reduce((acc, oct) => (acc << 8) + Number(oct), 0) >>> 0;
}

function inRange(ip: number, cidrBase: string, bits: number): boolean {
  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
  return (ip & mask) === (ipv4ToInt(cidrBase) & mask);
}

/** True if an IPv4 address is NOT a globally-routable public address. */
function isPrivateIPv4(ip: string): boolean {
  const n = ipv4ToInt(ip);
  return (
    inRange(n, "0.0.0.0", 8) || // "this" network / unspecified
    inRange(n, "10.0.0.0", 8) || // private
    inRange(n, "100.64.0.0", 10) || // CGNAT
    inRange(n, "127.0.0.0", 8) || // loopback
    inRange(n, "169.254.0.0", 16) || // link-local (incl. 169.254.169.254 metadata)
    inRange(n, "172.16.0.0", 12) || // private
    inRange(n, "192.0.0.0", 24) || // IETF protocol assignments
    inRange(n, "192.0.2.0", 24) || // TEST-NET-1
    inRange(n, "192.168.0.0", 16) || // private
    inRange(n, "198.18.0.0", 15) || // benchmarking
    inRange(n, "198.51.100.0", 24) || // TEST-NET-2
    inRange(n, "203.0.113.0", 24) || // TEST-NET-3
    inRange(n, "224.0.0.0", 4) || // multicast
    inRange(n, "240.0.0.0", 4) // reserved / broadcast
  );
}

/** True if an IPv6 address is NOT a globally-routable public address. */
function isPrivateIPv6(ip: string): boolean {
  const addr = ip.toLowerCase().split("%")[0]; // strip zone id

  // IPv4-mapped (::ffff:a.b.c.d) — but the URL/IP parser may normalise this to
  // hex form (::ffff:7f00:1), so handle both and validate the embedded v4.
  const mapped = addr.match(/^::ffff:(.+)$/);
  if (mapped) {
    const rest = mapped[1];
    if (/^\d+\.\d+\.\d+\.\d+$/.test(rest)) return isPrivateIPv4(rest);
    const parts = rest.split(":");
    if (parts.length === 2) {
      const hi = parseInt(parts[0], 16);
      const lo = parseInt(parts[1], 16);
      if (Number.isFinite(hi) && Number.isFinite(lo)) {
        const v4 = `${(hi >> 8) & 0xff}.${hi & 0xff}.${(lo >> 8) & 0xff}.${lo & 0xff}`;
        return isPrivateIPv4(v4);
      }
    }
    return true; // unrecognised mapped form → treat as unsafe
  }

  if (addr === "::1" || addr === "::") return true; // loopback / unspecified
  if (addr.startsWith("fe80")) return true; // link-local
  if (addr.startsWith("fc") || addr.startsWith("fd")) return true; // unique-local fc00::/7
  if (addr.startsWith("ff")) return true; // multicast
  if (addr.startsWith("fec0")) return true; // deprecated site-local
  return false;
}

function isPrivateIp(ip: string): boolean {
  const family = net.isIP(ip);
  if (family === 4) return isPrivateIPv4(ip);
  if (family === 6) return isPrivateIPv6(ip);
  return true; // not a valid IP literal → treat as unsafe
}

/**
 * Validate a single URL: scheme, credentials, and that every resolved IP is
 * public. Throws SsrfError on any violation. Returns the parsed URL.
 */
export async function assertSafeUrl(rawUrl: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new SsrfError("Invalid URL.");
  }

  if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
    throw new SsrfError("Only http and https URLs are allowed.");
  }
  if (url.username || url.password) {
    throw new SsrfError("URLs with embedded credentials are not allowed.");
  }

  const hostname = url.hostname.replace(/^\[|\]$/g, ""); // unwrap [::1]

  // If the host is already an IP literal, check it directly.
  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) {
      throw new SsrfError("Requests to non-public IP addresses are blocked.");
    }
    return url;
  }

  // Otherwise resolve the name and ensure ALL answers are public (blocks a
  // hostname that resolves to a private/loopback address).
  let records: { address: string }[];
  try {
    records = await dns.lookup(hostname, { all: true });
  } catch {
    throw new SsrfError("Could not resolve host.");
  }
  if (records.length === 0) throw new SsrfError("Could not resolve host.");
  for (const { address } of records) {
    if (isPrivateIp(address)) {
      throw new SsrfError("Host resolves to a non-public address.");
    }
  }
  return url;
}

/**
 * Fetch a user-supplied URL safely: validates the URL (and every redirect hop)
 * against the SSRF guard, caps redirects + total time, and caps the body size.
 * Returns the final response and the decoded text body.
 */
export async function safeFetch(
  rawUrl: string,
  opts: { headers?: Record<string, string>; timeoutMs?: number } = {},
): Promise<{ url: string; status: number; text: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  try {
    let current = rawUrl;
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      const validated = await assertSafeUrl(current);
      const res = await fetch(validated, {
        signal: controller.signal,
        redirect: "manual", // we follow manually so each hop is re-validated
        headers: opts.headers,
      });

      if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
        if (hop === MAX_REDIRECTS) throw new SsrfError("Too many redirects.");
        current = new URL(res.headers.get("location")!, validated).toString();
        continue;
      }

      return { url: validated.toString(), status: res.status, text: await readCapped(res) };
    }
    throw new SsrfError("Too many redirects.");
  } finally {
    clearTimeout(timeout);
  }
}

/** Read a response body but stop once MAX_RESPONSE_BYTES is exceeded. */
async function readCapped(res: Response): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      total += value.byteLength;
      if (total > MAX_RESPONSE_BYTES) {
        await reader.cancel();
        break;
      }
      chunks.push(value);
    }
  }
  return Buffer.concat(chunks.map((c) => Buffer.from(c))).toString("utf8");
}
