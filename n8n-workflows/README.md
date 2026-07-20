# n8n Template Library — Yawn Agency

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

A recurring agent scrapes n8n.io/workflows daily, checks Trending/Featured/Recently-Added plus a category crawl (`sales`, `marketing`, `other`, `document-ops`), matches findings against the 5 verticals, and:

1. Drops raw findings + inspiration links into `_inbox/{date}-scrape-log.md`
2. Hands off to a second agent that triages the findings, writes/updates node-design specs in the relevant vertical file, commits to GitHub, and mirrors the update to the Drive folder above
3. Never inflates a vertical past what's genuinely new — see the coverage-gap notes in each day's inbox log

**Scheduling limitation:** this was set up via the in-session `CronCreate` tool, which is session-scoped and auto-expires after 7 days — it does not survive past this Claude session ending. For the routine to run indefinitely, set up a recurring **Trigger** in Claude Code on the web (Settings → Triggers) with the daily prompt below, or ask a future session to recreate the cron job.

**Daily prompt used by the routine:**
```
Scrape https://n8n.io/workflows/ (homepage rails + category pages for sales,
marketing, other, document-ops) for new or trending workflow templates.
Match findings against Yawn's 5 verticals (Sales, E-commerce,
Wholesaling/REI, Productivity, Small Business) using
src/data/verticals.ts as the catalog reference. Log raw findings to
n8n-workflows/_inbox/{today}-scrape-log.md with links and node lists.
Then spawn a second agent to triage: update the relevant
n8n-workflows/{vertical}/README.md node designs only if something is
genuinely new (not already covered), commit + push to the
claude/funny-wright-dp4g0f branch (or its successor once merged), and
mirror the updated files into the "Yawn Agency — n8n Template Library"
Google Drive folder (id 1Ly4NAQtZPYQjqppCvEbi2bK5wyEXWCkz). Do not
duplicate existing catalog IDs. Report a short summary of what changed.
```
