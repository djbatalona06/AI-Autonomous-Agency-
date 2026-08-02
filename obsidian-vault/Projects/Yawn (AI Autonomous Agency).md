---
tags: [project, venture, agency, n8n]
---

# Yawn (AI Autonomous Agency)

**Repo:** `djbatalona06/AI-Autonomous-Agency-`
**What it is:** n8n-based automation agency platform. Tagline: **"Automate the Boring. Wake Up
Your Business."** Koala mascot, "kinetic brutalism" design (hard edges, `#B666D2` lilac,
Inter + Fraunces).

## Product

Both a marketing/demo site for the agency and a working full-stack app: AI image generation, web
crawling/competitive intelligence, site-wide AI chat agent, per-user project history, AI-SEO
tooling. Client: React 19 + Vite 6 + Tailwind 4 + wouter + framer-motion. Server: Express 4 +
tRPC 11 + zod. DB: Supabase/Postgres via Drizzle, with a zero-config local JSON fallback. AI
providers (Anthropic/OpenAI/Firecrawl) are pluggable with deterministic mock fallbacks so the app
works offline. Deployable as one Node process or via Vercel serverless.

## Target clients & verticals

SMBs/solopreneurs needing back-office automation, across 5 catalog verticals: **Sales,
E-commerce, Wholesaling/REI (flagship), Productivity, Small Business.**

## The n8n template pipeline (this vault's other half)

`.github/workflows/n8n-brainstorm-scrape.yml` scrapes n8n.io/workflows **daily at 12:00 AM
America/Los_Angeles**, triages new template ideas against the 5 verticals, and files them into
three synced places:
- `docs/n8n-brainstorm/` — one file per vertical
- `src/data/n8nBrainstorm.ts` — app-consumable data
- `obsidian-vault/n8n-templates/` — **this vault's sibling folder**, one note per idea, tagged
  `n8n-brainstorm` + `vertical/<code>` (+ `new-candidate` for ideas not yet in
  `src/data/verticals.ts`)

**Do not restructure or duplicate `obsidian-vault/n8n-templates/`** — it's machine-managed. This
`Projects/` note just points to it; the actual backlog lives there.

## Business model

No explicit public pricing found in the scanned files, but the repo references a formal
pricing-tier/delivery-SOP system (the `n8n-automation-business` Claude skill mentions a "Phase 0
pilot," named example clients "theWRENCH" and "Vertex Supply," warranties, and change-order
rules) — treat that skill as the source of truth for pricing/contract questions on this venture,
not this note.

## Role Claude/Hermes should play here

Full-stack dev + client-automation builder + template curator. Keep the n8n backlog useful,
don't second-guess the automated sync pipeline, and route pricing/contract questions to the
`n8n-automation-business` skill.
