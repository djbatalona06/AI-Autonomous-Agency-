import { ENV } from "./env";

export interface ScrapeResult {
  title: string;
  text: string;
}

/**
 * Fetch and extract readable text from a URL. Uses Firecrawl when a key is set,
 * otherwise native fetch + a lightweight HTML→text pass (no heavy deps).
 */
export async function scrapeUrl(url: string): Promise<ScrapeResult> {
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
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "user-agent": "Mozilla/5.0 (compatible; YawnBot/1.0)" },
    });
    const html = await res.text();
    return { title: extractTitle(html) ?? url, text: htmlToText(html) };
  } finally {
    clearTimeout(timeout);
  }
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
