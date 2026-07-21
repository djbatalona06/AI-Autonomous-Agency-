#!/usr/bin/env node
/**
 * n8n-workflow-scout.mjs — daily brainstorming feed for Yawn's automation pipeline.
 *
 * Scrapes n8n.io/workflows (trending/featured/recently-added + category pages),
 * asks Claude to translate what's popular into >=5 n8n node-chain designs per
 * business vertical (sales, ecommerce, wholesaling_rei, productivity,
 * small_business), then:
 *
 *   1. Writes docs/n8n-brainstorming/<run-date>.md and updates latest.md
 *   2. Inserts the same rows into public.n8n_workflow_ideas via the Supabase
 *      REST API (service_role key — bypasses RLS; see the migration for why)
 *
 * Pure Node ESM, only dependency is a fetch-capable Node (18+) and the
 * @anthropic-ai/sdk types are avoided — plain fetch against the Messages API,
 * matching this repo's existing "no heavy deps for scripts" convention.
 *
 * Env:
 *   ANTHROPIC_API_KEY        - required, drives the categorization + design pass
 *   FIRECRAWL_API_KEY        - optional but recommended (n8n.io has Cloudflare
 *                              bot protection; plain fetch often gets a 403)
 *   SUPABASE_URL              - required for the DB insert step (skipped if unset)
 *   SUPABASE_SERVICE_ROLE_KEY - required for the DB insert step (skipped if unset)
 *   RUN_DATE                  - overrides today's date (YYYY-MM-DD), for testing
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const briefDir = path.join(repoRoot, "docs", "n8n-brainstorming");

const VERTICALS = [
  { slug: "sales", label: "Sales" },
  { slug: "ecommerce", label: "Ecommerce" },
  { slug: "wholesaling_rei", label: "Wholesaling / REI" },
  { slug: "productivity", label: "Productivity" },
  { slug: "small_business", label: "Small Business" },
];

const SOURCES = [
  "https://n8n.io/workflows/",
  "https://n8n.io/workflows/categories/sales/",
  "https://n8n.io/workflows/categories/marketing/",
];

async function scrapeSource(url) {
  const firecrawlKey = process.env.FIRECRAWL_API_KEY;
  if (firecrawlKey) {
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${firecrawlKey}`,
        },
        body: JSON.stringify({ url, formats: ["markdown"] }),
      });
      if (!res.ok) throw new Error(`Firecrawl ${res.status}`);
      const data = await res.json();
      return data.data?.markdown ?? "";
    } catch (error) {
      console.warn(`[Scout] Firecrawl failed for ${url}, falling back to fetch:`, error.message);
    }
  }
  const res = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0 (compatible; YawnScoutBot/1.0)" },
  });
  if (!res.ok) {
    console.warn(`[Scout] fetch ${url} returned ${res.status} (n8n.io often blocks non-browser fetches — set FIRECRAWL_API_KEY)`);
    return "";
  }
  return res.text();
}

async function askClaude(scrapedText) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is required");

  const prompt = `You are researching n8n.io's workflow template library for an n8n automation agency (Yawn) that sells template installs ($750-$1,500), custom builds ($1,500-$5,000), and ops retainers.

Below is scraped content from n8n.io/workflows (trending, featured, recently-added, and category pages). Based on it, propose AT LEAST 5 concrete n8n workflow node-chain designs for EACH of these 5 business verticals: sales, ecommerce, wholesaling_rei (real estate wholesaling/investing), productivity, small_business.

For each design give: a short title, an n8n node chain (Trigger -> Node -> Node -> ... using real n8n node names), a complexity tier (simple/medium/complex, per: simple=5-10hrs/$1500-2000, medium=10-20hrs/$2000-3500, complex=20-30hrs/$3500-5000), which existing template it extends if any (or "new"), and the source snippet/URL that inspired it if identifiable.

Respond with ONLY valid JSON, no markdown fences, in this shape:
{"ideas": [{"vertical": "sales", "title": "...", "node_chain": "A -> B -> C", "complexity": "medium", "template_fit": "new", "source_url": "...", "source_title": "...", "notes": "..."}]}

Scraped content:
${scrapedText.slice(0, 40000)}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.LLM_MODEL || "claude-sonnet-4-6",
      max_tokens: 8000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const raw = data.content?.[0]?.text ?? "{}";
  const stripped = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  return JSON.parse(stripped);
}

function renderMarkdown(runDate, ideasByVertical) {
  let md = `# n8n Workflow Scout — ${runDate}\n\n`;
  md += `Automated daily brief. See \`README.md\` for how this is generated.\n\n---\n\n`;
  for (const v of VERTICALS) {
    md += `## ${v.label}\n\n`;
    const ideas = ideasByVertical[v.slug] ?? [];
    ideas.forEach((idea, i) => {
      md += `### ${i + 1}. ${idea.title} — *${idea.complexity}*\n`;
      md += `\`${idea.node_chain}\`\n`;
      if (idea.template_fit) md += `- **Template fit:** ${idea.template_fit}\n`;
      if (idea.source_title || idea.source_url) {
        md += `- **Source:** ${idea.source_title ?? ""} ${idea.source_url ? `<${idea.source_url}>` : ""}\n`;
      }
      if (idea.notes) md += `- ${idea.notes}\n`;
      md += `\n`;
    });
    md += `---\n\n`;
  }
  return md;
}

async function insertIntoSupabase(runDate, ideasByVertical) {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.log("[Scout] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — skipping DB insert.");
    return;
  }
  const rows = Object.entries(ideasByVertical).flatMap(([vertical, ideas]) =>
    ideas.map((idea) => ({
      run_date: runDate,
      vertical,
      title: idea.title,
      node_chain: idea.node_chain,
      nodes: idea.nodes ?? [],
      complexity: idea.complexity,
      template_fit: idea.template_fit ?? null,
      source_url: idea.source_url ?? null,
      source_title: idea.source_title ?? null,
      notes: idea.notes ?? null,
    })),
  );
  if (rows.length === 0) return;

  const res = await fetch(`${url}/rest/v1/n8n_workflow_ideas`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      apikey: serviceKey,
      authorization: `Bearer ${serviceKey}`,
      prefer: "return=minimal",
    },
    body: JSON.stringify(rows),
  });
  if (!res.ok) throw new Error(`Supabase insert failed: ${res.status} ${await res.text()}`);
  console.log(`[Scout] Inserted ${rows.length} rows into public.n8n_workflow_ideas.`);
}

async function main() {
  const runDate = process.env.RUN_DATE || new Date().toISOString().slice(0, 10);

  const scraped = (await Promise.all(SOURCES.map(scrapeSource))).join("\n\n---\n\n");
  const { ideas } = await askClaude(scraped);

  const ideasByVertical = Object.fromEntries(VERTICALS.map((v) => [v.slug, []]));
  for (const idea of ideas ?? []) {
    if (ideasByVertical[idea.vertical]) ideasByVertical[idea.vertical].push(idea);
  }
  for (const v of VERTICALS) {
    if ((ideasByVertical[v.slug] ?? []).length < 5) {
      console.warn(`[Scout] Only ${ideasByVertical[v.slug].length} ideas for ${v.slug} (wanted >=5).`);
    }
  }

  fs.mkdirSync(briefDir, { recursive: true });
  const md = renderMarkdown(runDate, ideasByVertical);
  fs.writeFileSync(path.join(briefDir, `${runDate}.md`), md);
  fs.writeFileSync(path.join(briefDir, "latest.md"), md);
  console.log(`[Scout] Wrote docs/n8n-brainstorming/${runDate}.md`);

  await insertIntoSupabase(runDate, ideasByVertical);
}

main().catch((error) => {
  console.error("[Scout] Failed:", error);
  process.exitCode = 1;
});
