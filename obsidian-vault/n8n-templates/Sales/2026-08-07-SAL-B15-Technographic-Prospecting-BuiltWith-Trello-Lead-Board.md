---
id: SAL-B15
title: "Technographic Prospecting: BuiltWith Tech-Stack Signals → Trello Lead Board"
vertical: Sales
new_candidate: true
date_added: 2026-08-07
tags: [n8n-brainstorm, vertical/sal]
---

# Technographic Prospecting: BuiltWith Tech-Stack Signals → Trello Lead Board

[[Sales Index]] · vertical `SAL`

**Source:** [Automate Sales Pipeline: BuiltWith Technology Data to Trello Lead Cards with Google Sheets](https://n8n.io/workflows/4786-automate-sales-pipeline-builtwith-technology-data-to-trello-lead-cards-with-google-sheets/)

**Summary:** No card yet — proposed `SAL-10`. Finds buyers by what software they already
run (still on a rival CRM, no automation stack) — a colder-outbound signal none of
`SAL-B01..B10` cover, a fit for SDR-team retainers.

## Node design

1. Schedule Trigger
2. Google Sheets — target domain list
3. HTTP Request — BuiltWith tech-stack lookup per domain
4. Code — flag domains missing/using a competing tool (buying signal)
5. Trello — create lead card with detected stack
6. Google Sheets — mark processed
