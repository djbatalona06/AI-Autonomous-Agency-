# n8n Workflow Scout — daily brainstorming feed

Automated daily research for Yawn's pipeline. Every night at **00:07 UTC** a
GitHub Action (`.github/workflows/n8n-workflow-scout.yml`) scrapes
[n8n.io/workflows](https://n8n.io/workflows/) (trending + featured + recently
added templates, plus category pages), asks Claude to translate what's
popular into concrete node designs for Yawn's five verticals, and:

1. Writes a dated brief to this folder — `YYYY-MM-DD.md` — ready to drop
   straight into a client proposal, a template build, or the `templates.md`
   library (`/root/.claude/skills/n8n-automation-business/references/templates.md`).
2. Inserts the same designs as rows in the app's own database
   (`public.n8n_workflow_ideas` — see
   `supabase/migrations/20260716000000_n8n_workflow_ideas.sql`), so they're
   queryable from the Yawn app itself, not just the filesystem.

`latest.md` always points at the newest brief (copied, not symlinked, so it
renders on GitHub).

## The five verticals

Matches DJ's go-to-market segments (see `templates.md` target clients):

| Vertical | Slug | Who it's for |
|---|---|---|
| Sales | `sales` | CRM/pipeline automation, lead scoring, outreach |
| Ecommerce | `ecommerce` | Shopify/WooCommerce stores, cart recovery, ops |
| Wholesaling / REI | `wholesaling_rei` | Wholesalers, real estate investors, acquisition teams (theWRENCH, Vertex Supply, wholesale network) |
| Productivity | `productivity` | Solopreneurs, agency owners, internal ops |
| Small Business | `small_business` | General SMB back-office (invoicing, onboarding, reporting) |

## Brief format

Each dated brief lists **at least 5 node designs per vertical** (25+ total),
each with:

- **Node chain** — trigger → nodes → action, n8n-import-ready
- **Complexity tier** — simple / medium / complex, per the sizing rubric in
  the `n8n-automation-business` skill (`business-model.md`)
- **Template fit** — which of the 6 existing templates it extends, or `new`
- **Source** — the n8n.io template/article that inspired it

Complexity tiers map directly to pricing:

| Tier | Price | Hours |
|---|---|---|
| Simple | $1,500–$2,000 | 5–10 hrs |
| Medium | $2,000–$3,500 | 10–20 hrs |
| Complex | $3,500–$5,000 | 20–30 hrs |

## Running it manually

```bash
ANTHROPIC_API_KEY=... FIRECRAWL_API_KEY=... SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
  node scripts/n8n-workflow-scout.mjs
```

`FIRECRAWL_API_KEY` is strongly recommended — n8n.io sits behind Cloudflare
bot protection and a plain `fetch` frequently gets a 403. Without it the
script falls back to native fetch and may return a thinner brief.

## Automation notes

- The GitHub Action opens a **draft PR** with the new brief + DB insert
  script output rather than pushing straight to `main` — review and merge
  when it looks good.
- Needs repo secrets: `ANTHROPIC_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  (bypasses RLS for the insert — the anon key cannot write to
  `n8n_workflow_ideas`), and optionally `FIRECRAWL_API_KEY`.
  `SUPABASE_URL` is already public (see `.env.example`) and hardcoded as a
  workflow env var.
- A session-level `CronCreate` schedule was considered instead, but this
  session's container is ephemeral and reclaimed on inactivity — a
  cron fires only while the session that created it is alive, so it cannot
  give you an actual daily job. GitHub Actions is the durable equivalent.
