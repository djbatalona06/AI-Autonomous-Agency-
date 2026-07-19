# n8n Template Brainstorm Pipeline

This folder is the landing zone for the recurring **n8n.io workflow scrape** that feeds
brainstorming for the Yawn Agency catalog (`src/data/verticals.ts`). It covers the five
buyer verticals the app already sells against:

| Code | Vertical | File |
|------|----------|------|
| SAL | Sales | [`sales.md`](./sales.md) |
| ECM | E-commerce | [`ecommerce.md`](./ecommerce.md) |
| WHL | Wholesaling / REI | [`wholesaling-rei.md`](./wholesaling-rei.md) |
| PRD | Productivity | [`productivity.md`](./productivity.md) |
| SMB | Small Business | [`small-business.md`](./small-business.md) |

## How this gets populated

1. **Scrape** — an agent hits [n8n.io/workflows](https://n8n.io/workflows/) (categories,
   trending, and recently-added rails) plus secondary sources (creator marketplaces,
   `awesome-n8n-templates` on GitHub, etc.) looking for new or rising templates that map to
   the five verticals above.
2. **Design** — for each vertical, the agent writes up concrete node-by-node designs
   (trigger → nodes → output) inspired by what it found, each tagged with which existing
   `TemplateCard` in `src/data/verticals.ts` it reinforces, or flagged as a **new candidate
   card** if nothing in the catalog covers it yet.
3. **File it three places:**
   - **This repo** — appended to the per-vertical `.md` file below (git history = changelog).
   - **`src/data/n8nBrainstorm.ts`** — the same entries as typed data, so the app itself can
     read the backlog (a "Brainstorm" list next to the live catalog) without anyone
     hand-transcribing anything.
   - **Google Drive** — mirrored into **"Yawn Agency — n8n Templates"**
     (`https://drive.google.com/drive/folders/1rM6sVJuudG6csbqcGj3eCjUkw7-TU7Hr`), which has
     a subfolder per vertical plus an `_Inbox` for the raw daily drop before triage.

## The recurring job

`.github/workflows/n8n-brainstorm-scrape.yml` runs this daily at 12:00 AM (America/Los_Angeles)
via the Claude Code GitHub Action, in two stages:

1. **`scrape-and-brainstorm`** — does steps 1–2 above and opens/updates a draft PR with the
   day's additions to the five `.md` files and `n8nBrainstorm.ts`.
2. **`obsidian-vault-sync`** — a second agent that takes whatever the first stage added and
   re-files it into `obsidian-vault/n8n-templates/` in Obsidian-ready form (YAML frontmatter,
   tags, wikilinks) so the folder can be opened directly as an Obsidian vault (or symlinked
   into an existing one) after a `git pull`.

**Setup required before this fires:** add an `ANTHROPIC_API_KEY` repository secret
(Settings → Secrets and variables → Actions) with an Anthropic API key that has budget for
daily runs. Until that secret exists, the workflow will run but the Claude step will fail —
GitHub will email whoever's watching the repo's Actions tab.

Google Drive uploads are seeded manually / from an interactive session for now — headless
GitHub Actions runs don't carry this account's Google Drive connector auth, so the daily
GitHub Action keeps the repo and Obsidian vault current automatically, while Drive gets
topped up whenever a live session runs (or you ask for a manual sync).
