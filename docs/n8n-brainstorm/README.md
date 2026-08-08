# n8n Template Brainstorm Pipeline

> ⚠️ **Automation status (last confirmed 2026-08-08): both scheduled scrapers are down.**
> `n8n-brainstorm-scrape.yml` and `n8n-workflow-scout.yml` have failed on **every run since
> 2026-07-20** (20 consecutive days). Root cause, confirmed from job logs on multiple runs:
> the Anthropic account behind the `ANTHROPIC_API_KEY` repo secret has **insufficient
> credit balance** — `"Your credit balance is too low to access the Anthropic API"`. The
> secret itself is present and correctly wired; this is a billing issue, not a config bug
> (PRs #42/#48/#49 fixed unrelated permissions/OIDC issues that were not the actual
> blocker). **The only fix is adding credits at console.anthropic.com** — no further code
> change in this repo will resume the schedule.
>
> Content hasn't stopped, though: interactive sessions have been running this pipeline by
> hand daily since, each opening a draft PR (`n8n brainstorm — YYYY-MM-DD`). As of
> 2026-08-08 there are **6 open draft PRs awaiting manual review/merge** (#49, #50, #52,
> #55, #56, #57), all `mergeable_state: clean`, oldest from 2026-07-31 — recommend merging
> in date order so `N8N_BRAINSTORM` and the `B`-number sequence stop drifting from what's
> sitting in open branches.
>
> Also unresolved: **two separate Google Drive folders** exist for this same mirror —
> "Yawn Agency — n8n Templates" (`1rM6sVJuudG6csbqcGj3eCjUkw7-TU7Hr`, linked below) and
> "Yawn Agency — n8n Template Library" (`1Ly4NAQtZPYQjqppCvEbi2bK5wyEXWCkz`, linked from
> `n8n-workflows/README.md`) — pick one and the other should be archived/merged in.

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

**Setup required before this fires:** the `ANTHROPIC_API_KEY` repository secret
(Settings → Secrets and variables → Actions) needs an Anthropic API key with **available
credit balance**. The secret already exists in this repo but the account behind it is out
of credit — see the automation-status banner at the top of this file for specifics.

Google Drive uploads are seeded manually / from an interactive session for now — headless
GitHub Actions runs don't carry this account's Google Drive connector auth, so the daily
GitHub Action keeps the repo and Obsidian vault current automatically, while Drive gets
topped up whenever a live session runs (or you ask for a manual sync).
