---
id: WHL-B10
title: "Property Lead Scoring Engine (BatchData)"
vertical: Wholesaling/REI
related_card: WHL-03
new_candidate: false
date_added: 2026-07-25
tags: [n8n-brainstorm, vertical/whl]
---

# Property Lead Scoring Engine (BatchData)

[[Wholesaling REI Index]] · vertical `WHL`

**Source:** [Automated real estate property lead scoring with BatchData](https://n8n.io/workflows/3664-automated-real-estate-property-lead-scoring-with-batchdata/)

**Summary:** Reinforces `WHL-03`. Companion to `WHL-B01`'s skip-trace intake pipeline —
this is purely the scoring-algorithm half, spelling out exact weighting factors (property
value, square footage, age, investment/non-owner-occupied status, lot size) ready to drop
into `WHL-03`'s build. Also targets a wider buyer list beyond wholesalers — mortgage
lenders, home-service contractors, insurance agents qualifying by property characteristics.

## Node design

1. CRM Webhook — new lead + address
2. HTTP Request — BatchData property lookup
3. Code — weighted 0-100 score (value, sqft, age, investment status, lot size)
4. Switch — classify high-value / qualified / potential / unqualified
5. CRM — update enriched property data + score
6. IF — high-value → immediate task creation → Slack notify
