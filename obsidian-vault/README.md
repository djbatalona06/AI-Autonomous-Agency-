---
tags: [index, second-brain]
---

# DJ's Second Brain — Obsidian Vault

This is DJ Batalona's personal "Second Brain" vault, built to give a locally-run Hermes Agent
(or Claude Code, pointed at this folder) persistent context about DJ, his ventures, and the
people/companies around them — instead of re-explaining everything at the start of every session.

Open this `obsidian-vault/` folder directly in the Obsidian app as a vault (Obsidian will
generate its own `.obsidian/` config folder on first open — nothing to set up by hand).

## Folder map

| Folder | What goes here |
| --- | --- |
| [[Projects/]] | Active ventures and side projects — one note per project |
| [[People/]] | People DJ works or builds with |
| [[Companies/]] | Target investors, dispensaries, clients — external orgs, not DJ's own projects |
| [[Knowledge/]] | Reusable reference material (tech stack, recurring patterns) |
| [[Decisions/]] | Decision log — one note per non-trivial call, so the agent stops re-litigating settled questions |
| [[Meetings/]] | Meeting notes |
| [[Daily/]] | Daily notes, one per day (`YYYY-MM-DD.md`) |
| `n8n-templates/` | **Pre-existing** — do not restructure. Auto-synced daily by `.github/workflows/n8n-brainstorm-scrape.yml` from `docs/n8n-brainstorm/`. Mirror of the Yawn agency's n8n template research, filed by vertical. |

## Root identity files

- `User.md` — who DJ is (Hermes/Claude read this first)
- `Soul.md` — tone and values the agent should operate with
- `Agent.md` — the agent's mission and technical boundaries
- `plan.md` — the full Hermes Agent + Obsidian sync implementation plan

## Provenance note

The starter notes in `Projects/`, `People/`, `Companies/`, and `Knowledge/` were compiled by
scanning DJ's own repos (`untapped-market`, `AI-Autonomous-Agency-`, `hermes-agent`,
`create-your-own-website-cis155`, `jenny-s-study-guide`) on 2026-08-02. Facts pulled directly
from code/docs are stated plainly; anything inferred rather than stated outright is marked
**"inferred — verify"** so DJ can correct it instead of the agent quietly treating a guess as
settled fact.
