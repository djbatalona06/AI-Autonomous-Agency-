---
title: n8n Workflow Brainstorm — Index
tags: [n8n, automation-agency, moc, daily-scrape]
aliases: [n8n Workflows MOC, Automation Agency Templates]
created: 2026-07-18
updated: 2026-07-18
source: https://n8n.io/workflows/
---

# n8n Workflow Brainstorm — Index

Daily-refreshed map of the automation agency's template pipeline, sourced from [n8n.io/workflows](https://n8n.io/workflows/). Each vertical below has 5+ node-design candidates ready to prototype, quote, or slot into the [[templates|template library]].

## The 5 verticals

- [[sales/README|Sales]] — lead capture, enrichment, outreach, follow-up
- [[ecommerce/README|Ecommerce]] — Shopify/WooCommerce order lifecycle, cart recovery, fraud triage
- [[wholesaling-rei/README|Wholesaling / REI]] — property lead gen, skip tracing, AI qualification (⭐ highest margin — see Template 6)
- [[productivity/README|Productivity]] — inbox triage, task planning, meeting-to-action pipelines
- [[small-business/README|Small Business]] — invoicing, onboarding, feedback, appointments, support routing

## How this folder works

1. **Daily 12:00 AM scrape** pulls new/trending workflows from n8n.io/workflows (site-wide + per-category) and appends fresh candidates to each vertical file below the `## Pipeline Log` heading — nothing gets overwritten, only appended, so history is preserved.
2. Each design entry includes: trigger → node chain, target integrations, a business-fit note (which pricing rung it fits per `n8n-automation-business` skill), and the source template it was inspired by.
3. Promote a design from "candidate" to `/templates/{slug}/` in the private template repo once it's been built and validated per the delivery SOP (Claude Code + n8n MCP validation).
4. A parallel copy of every entry lives in **Google Drive → n8n Templates** for non-technical review, and in **GitHub → `n8n-workflows/`** for version history (this repo doubles as the Obsidian vault section — clone/symlink it into your vault, or open the folder directly as a vault).

## Status

| Vertical | Designs seeded (on `main`) | Designs seeded (incl. open draft PRs) | Last scrape |
|---|---|---|---|
| Sales | 10 | 14 | 2026-08-06 |
| Ecommerce | 10 | 14 | 2026-08-06 |
| Wholesaling / REI | 10 | 14 | 2026-08-06 |
| Productivity | 10 | 14 | 2026-08-06 |
| Small Business | 10 | 14 | 2026-08-06 |

**Automation health — P0, unresolved 17+ days:** both scheduled GitHub Actions
(`n8n-workflow-scout.yml` at 00:07 UTC and `n8n-brainstorm-scrape.yml` at 07:00 UTC) have
failed on every scheduled run since 2026-07-20 — reconfirmed against 12 consecutive daily
run records on 2026-08-06. Root cause unchanged: the Anthropic account backing
`ANTHROPIC_API_KEY` has an insufficient credit balance. No in-repo code change can fix
this — three PRs (#42, #48, #49) have proposed code-level fixes and none of them address
it. **Needs DJ to add credits at console.anthropic.com.** See
`_inbox/2026-08-06-scrape-log.md` for full evidence.

Five draft PRs are open awaiting manual review (all green/passing): #49 (07-30), #50
(07-31, B11), #52 (08-02, B12), #55 (08-04, B13), and today's (08-06, B14). Nothing in any
of them needs a code fix — they're simply unreviewed, per standing instruction to review
before merge.
