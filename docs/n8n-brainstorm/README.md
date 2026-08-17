# n8n Template Brainstorm Pipeline

> **Status (2026-08-17): daily automation blocked, 28 days running.** Both scheduled
> Actions (`n8n-brainstorm-scrape.yml` @ 07:00 UTC, `n8n-workflow-scout.yml` @ 00:07 UTC)
> have failed every run since 2026-07-20 — confirmed again this run via `actions_list` /
> `get_job_logs`. Root cause unchanged: `ANTHROPIC_API_KEY` is configured correctly but the
> Anthropic account behind it is out of credits (`"Your credit balance is too low..."`).
> **Fix: add credits at console.anthropic.com — no code change in this repo resumes it.**
> A live Claude session also confirmed this run that `n8n.io` itself is unreachable from a
> sandboxed session environment (separate from the Cloudflare-bot-protection issue below),
> which is why manual catch-up runs have been getting thinner over the past couple weeks.
> Seven draft PRs are stacked up awaiting review (oldest 18+ days: **#49, #50, #52, #55,
> #56, #57, #58** — all green, no code fixes needed) — recommend merging oldest → newest so
> the `N8N_BRAINSTORM` id sequence and this pipeline's `.md` files stop drifting further
> from what's sitting in open branches. **This run intentionally did not add an eighth.**

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
     **Note:** a second, separate folder — **"Yawn Agency — n8n Template Library"**
     (`1Ly4NAQtZPYQjqppCvEbi2bK5wyEXWCkz`, referenced by `n8n-workflows/README.md`) — mirrors
     the sibling `n8n-workflow-scout.yml` pipeline's output instead. Both are live and
     current as of this run; consolidating to one is a standing decision for DJ (flagged
     repeatedly since #56/#57), not something automated here.

## The recurring job

`.github/workflows/n8n-brainstorm-scrape.yml` runs this daily at 12:00 AM (America/Los_Angeles)
via the Claude Code GitHub Action, in two stages:

1. **`scrape-and-brainstorm`** — does steps 1–2 above and opens/updates a draft PR with the
   day's additions to the five `.md` files and `n8nBrainstorm.ts`.
2. **`obsidian-vault-sync`** — a second agent that takes whatever the first stage added and
   re-files it into `obsidian-vault/n8n-templates/` in Obsidian-ready form (YAML frontmatter,
   tags, wikilinks) so the folder can be opened directly as an Obsidian vault (or symlinked
   into an existing one) after a `git pull`.

**Current blocker:** the `ANTHROPIC_API_KEY` secret already exists and is wired correctly —
the workflow runs, but the Claude step fails because that account's credit balance is too
low (see the status banner above). Adding credits at console.anthropic.com is the only fix;
re-adding or re-checking the secret itself won't help.

**Template preview photos:** `scripts/n8n-workflow-scout.mjs` and this workflow's prompt now
both capture each idea's `preview_image_url` / `source.previewImageUrl` (the template's
og:image from its n8n.io page) when a source is a real n8n.io/workflows/ page and
`FIRECRAWL_API_KEY` is set — the Obsidian notes embed it under the source line, and the
`.md` briefs embed it under the heading. No `FIRECRAWL_API_KEY` is currently configured for
either scheduled Action, so photos will start appearing automatically once one is added
(same billing-account fix as above covers this too — Firecrawl has its own free tier if a
separate key is preferred).

Google Drive uploads are seeded manually / from an interactive session for now — headless
GitHub Actions runs don't carry this account's Google Drive connector auth, so the daily
GitHub Action keeps the repo and Obsidian vault current automatically, while Drive gets
topped up whenever a live session runs (or you ask for a manual sync).
