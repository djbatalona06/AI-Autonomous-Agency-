# n8n Template Library — Yawn Agency

> **Status (2026-08-17):** the daily scrape (`.github/workflows/n8n-workflow-scout.yml`,
> 00:07 UTC) has failed every run since 2026-07-20 (28 days) — Anthropic account credit
> balance too low, confirmed again this run. Fix: add credits at console.anthropic.com.
> Manual catch-up briefs live in `docs/n8n-brainstorming/latest.md`; a backlog of draft PRs
> (`#49`–`#58`) is awaiting review — see the banner in `docs/n8n-brainstorm/README.md` for
> the full list and merge order. **Template preview photos** are now captured automatically
> (`preview_image_url`) once `FIRECRAWL_API_KEY` is set — see that file for details.

Working set of n8n node designs for Yawn's 5 buyer verticals, sourced from a daily scrape of [n8n.io/workflows](https://n8n.io/workflows/) plus agency-original builds where the public gallery has no direct hit (Wholesaling/REI in particular).

## Structure

```
n8n-workflows/
  README.md                        ← this file
  sales/README.md                  ← SAL-01..05 node designs
  ecommerce/README.md              ← ECM-01..05
  productivity/README.md           ← PRD-01..05
  small-business/README.md         ← SMB-01..05
  wholesaling-rei/README.md        ← WHL-01..05 (flagship vertical)
  _inbox/{YYYY-MM-DD}-scrape-log.md ← raw daily scrape findings before triage
```

Each vertical file has **5 node designs minimum** — trigger, node-by-node table, and a lightweight n8n-import-ready JSON node list. Card IDs (`SAL-01`, `ECM-03`, etc.) match `src/data/verticals.ts` 1:1, so this folder drops straight into the app: promoting a card from `spec`/`slot` to `built` is a one-line status edit in that file once the workflow is actually deployed in n8n.

These are **design specs**, not validated n8n exports. Before deploying to a client, run them through the agency's build SOP (`n8n-automation-business` skill → `references/delivery-sop.md` Step 3): Claude Code + n8n MCP, `get_suggested_nodes` → `search_nodes` → `get_node_types` → `validate_node_config` → `validate_workflow`, built in dev before production.

## Mirrors

- **Google Drive:** [Yawn Agency — n8n Template Library](https://drive.google.com/drive/folders/1Ly4NAQtZPYQjqppCvEbi2bK5wyEXWCkz) — same structure, for quick browsing/sharing outside GitHub. GitHub is the source of truth; Drive is the mirror.
- **Obsidian:** this folder is plain Markdown, no proprietary format. Clone the repo (or a local sync of the Drive mirror) and point an Obsidian vault at `n8n-workflows/` to browse and cross-link these notes directly — no extra setup needed.

## Daily scrape routine

This now runs as a durable **GitHub Action** (`.github/workflows/n8n-workflow-scout.yml`,
`scripts/n8n-workflow-scout.mjs`), fires 00:07 UTC daily, and:

1. Scrapes n8n.io/workflows (homepage rails + `sales`/`marketing` category pages)
2. Asks Claude to translate findings into >=5 node designs per vertical, with a
   best-effort preview-image lookup per idea when `FIRECRAWL_API_KEY` is set
3. Writes `docs/n8n-brainstorming/<date>.md` + `latest.md`, inserts rows into
   `public.n8n_workflow_ideas`, and opens a **draft PR** rather than pushing to `main`
   — review and merge when it looks good

A sibling Action, `.github/workflows/n8n-brainstorm-scrape.yml` (07:00 UTC), runs the
parallel `docs/n8n-brainstorm/` + `src/data/n8nBrainstorm.ts` + Obsidian-vault pipeline —
see `docs/n8n-brainstorm/README.md` for that one's details, including the current status
banner.

**Prior scheduling note (superseded):** this folder used to describe a session-scoped
`CronCreate` routine as the daily driver. That was always meant as a stopgap — the GitHub
Action above is the durable version and is what actually fires now (when the billing
blocker above isn't in the way).
