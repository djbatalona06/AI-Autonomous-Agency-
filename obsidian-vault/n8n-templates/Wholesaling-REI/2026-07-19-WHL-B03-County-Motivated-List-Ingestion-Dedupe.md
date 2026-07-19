---
id: WHL-B03
title: "County / Motivated-List Ingestion + Dedupe"
vertical: Wholesaling / REI
related_card: WHL-04
new_candidate: false
date_added: 2026-07-19
tags: [n8n-brainstorm, vertical/whl]
---

# County / Motivated-List Ingestion + Dedupe

[[Wholesaling / REI Index]] · vertical `WHL` · reinforces `WHL-04`

**Source:** PropStream/county-export ingestion pattern

**Summary:** Weekly lists pulled, normalized, deduped, and enriched — only genuinely-new records drop in.

## Node design

1. Schedule Trigger (weekly)
2. HTTP Request/CSV import — county list or PropStream export
3. Code — normalize + dedupe vs. CRM
4. BatchData — enrich
5. CRM — insert new records only

