---
id: WHL-B13
title: "Property Condition Photo Intelligence"
vertical: Wholesaling / REI
related_card: WHL-B04
new_candidate: true
date_added: 2026-08-04
tags: [n8n-brainstorm, vertical/whl]
---

# Property Condition Photo Intelligence

[[Wholesaling REI Index]] · vertical `WHL`

**Source:** [Enrich property inventory survey with image recognition and AI agent](https://n8n.io/workflows/2330-enrich-property-inventory-survey-with-image-recognition-and-ai-agent/)

**Summary:** First `WHL` card scoring the property itself from photos, rather than routing
leads by contact behavior — feeds a repair-risk signal straight into the deal analyzer
(`WHL-B04`) that analysts currently estimate manually. Complex tier ($3,500–$5,000).

## Node design

1. Webhook/Form — property photos + address (acquisitions team or seller)
2. AI Agent (vision model) — condition flags: roof, foundation, water damage, clutter
3. HTTP Request — BatchData comps/ARV lookup (same source as WHL-01/WHL-B01)
4. AI Agent — synthesize condition + comps into repair-cost-adjusted MAO estimate
5. Google Sheets/CRM — write property record with condition score + adjusted MAO
6. Slack — flag high-repair-risk properties for acquisitions review
