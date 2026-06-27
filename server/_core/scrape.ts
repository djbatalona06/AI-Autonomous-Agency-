import { ENV } from "./env";
import { assertSafeUrl, safeFetch } from "./ssrf";

export interface ScrapeResult {
  title: string;
  text: string;
}

/**
 * Fetch and extract readable text from a URL. Uses Firecrawl when a key is set,
 * otherwise native fetch + a lightweight HTML→text pass (no heavy deps).
 *
 * SECURITY: the URL is user-supplied, so we validate it against the SSRF guard
 * BEFORE any outbound request — including the Firecrawl path, so we never ask a
 * third party (or a self-hosted Firecrawl) to fetch an internal address on our
 * behalf. The fallback path uses `safeFetch`, which re-validates every redirect
 * hop and caps the response size.
 */
export async function scrapeUrl(url: string): Promise<ScrapeResult> {
  await assertSafeUrl(url);

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

async function scrapeWithFetch(url: string): Promise<ScrapeResult> {
  // safeFetch re-validates the URL and every redirect hop against the SSRF
  // guard, enforces a timeout, and caps the response body size.
  const { text: html } = await safeFetch(url, {
    headers: { "user-agent": "Mozilla/5.0 (compatible; YawnBot/1.0)" },
  });
  return { title: extractTitle(html) ?? url, text: htmlToText(html) };
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
