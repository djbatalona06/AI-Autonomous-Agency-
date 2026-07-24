---
id: SAL-B09
title: "Google-Maps Local-Business Enrichment → Territory Prospecting List"
vertical: Sales
new_candidate: true
date_added: 2026-07-24
tags: [n8n-brainstorm, vertical/sal, new-candidate]
---

# Google-Maps Local-Business Enrichment → Territory Prospecting List

[[Sales Index]] · vertical `SAL`

**Source:** [Enrich Google Maps business and lead data with CoreClaw and Google Sheets](https://n8n.io/workflows/17362-enrich-google-maps-business-and-lead-data-with-coreclaw-and-google-sheets/)

**Summary:** No card yet — proposed SAL-09. Builds outbound prospecting lists from scratch
by geography/keyword, rather than enriching inbound leads — a fit for SDR teams and
agencies doing territory-based cold outreach.

## Node design

1. Schedule Trigger — every 30 min
2. Google Sheets — read unprocessed rows from a "Query" tab (keyword + base location)
3. HTTP Request — start CoreClaw Google Maps scrape+enrich job
4. Wait/poll until the run succeeds
5. HTTP Request — fetch completed results
6. Split Out — per business
7. Google Sheets — append business-details tab + enriched-contact tab
