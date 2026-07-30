---
id: PRD-B07
title: "Notion Workspace Dedup & Audit-Log Bot"
vertical: Productivity
new_candidate: true
date_added: 2026-07-22
tags: [n8n-brainstorm, vertical/prd, new-candidate]
---

# Notion Workspace Dedup & Audit-Log Bot

[[Productivity Index]] · vertical `PRD`

**Source:** [Deduplicate and archive Notion database rows daily with an audit log](https://n8n.io/workflows/16801-deduplicate-and-archive-notion-database-rows-daily-with-an-audit-log/)

**Summary:** No card yet — proposed PRD-06/07. Simple, cheap ops-hygiene build — good
Ops Retainer filler (fits inside the 3 hr/mo cap once built) for any client already running
Notion as a knowledge base.

## Node design

1. Schedule Trigger (nightly)
2. Notion — query database
3. Code — hash/compare rows to find duplicates
4. Switch — duplicate found?
5. Notion — archive/tag the duplicate row
6. Google Sheets — append audit log entry
7. Slack — nightly digest of what got cleaned
