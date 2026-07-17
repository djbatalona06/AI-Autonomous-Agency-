# n8n Workflow Scout

A recurring brainstorming feed for Yawn. Once a day, an agent scrapes
[n8n.io/workflows](https://n8n.io/workflows/) and the wider n8n template ecosystem
(community blogs, GitHub template packs, creator recaps) for new and trending
workflow patterns, then filters what it finds through Yawn's five buyer verticals:

- **SAL** — Sales
- **ECM** — E-commerce
- **WHL** — Wholesaling / REI
- **PRD** — Productivity
- **SMB** — Small Business

(These match `src/data/verticals.ts` exactly — the five verticals already live
on the pricing/catalog pages.)

## What lands here

Each run drops a dated report — `YYYY-MM-DD.md` — with **at least 5 node-design
ideas per vertical**. Every idea includes:

- A one-line pitch
- A trigger → node chain (5+ nodes), written the way `references/templates.md`
  in the `n8n-automation-business` skill documents existing templates
- Source links the idea was pulled from
- A suggested rung (Template Install / Custom Automation) and price band,
  sized against `references/business-model.md`

Ideas here are **candidates, not commitments** — nothing in this folder is
wired into the live pricing catalog. To promote an idea:

1. Review it against `references/templates.md` and `references/pilot-plan.md`
   in the `n8n-automation-business` skill — does it fit a warm-network client,
   or fill a gap in an existing vertical?
2. Build and validate it with Claude Code + the n8n MCP (SOP Step 3 in
   `references/delivery-sop.md`).
3. Add it to `src/data/verticals.ts` as a new `TemplateCard` (status `"spec"`),
   and/or add it to the private template repo per `references/templates.md`.

## Machine-readable staging table

`src/data/brainstormIdeas.ts` mirrors this folder in code — one entry per idea,
same shape as `VERTICALS` in `verticals.ts` but kept in a separate, unwired
array (`BRAINSTORM_IDEAS`) so nothing here ever reaches a customer by accident.
It's the "database" half of this system — safe to query, diff, or import into
a future internal review page without touching the live catalog.

## Schedule

Intended to run daily at ~12:00 AM local time. See the note at the bottom of
the latest dated report for how this particular run was scheduled and its
known limitations.
