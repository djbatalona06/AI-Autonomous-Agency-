---
id: WHL-B01
title: "Skip-Trace + Lead-Scoring Intake"
vertical: Wholesaling / REI
related_card: WHL-03
new_candidate: false
date_added: 2026-07-19
tags: [n8n-brainstorm, vertical/whl]
---

# Skip-Trace + Lead-Scoring Intake

[[Wholesaling / REI Index]] · vertical `WHL` · reinforces `WHL-03`

**Source:** Real estate lead generation with BatchData skip tracing & CRM integration — https://n8n.io/workflows/3666-real-estate-lead-generation-with-batchdata-skip-tracing-and-crm-integration/

**Summary:** Close-to-ready-made reference build; could shortcut WHL-03's dev time.

## Node design

1. Schedule + Manual dual Trigger
2. HTTP Request — BatchData property search
3. Code — filter absentee/5yrs+/tax-delinquent, score 0-100
4. HTTP Request — skip trace (phone/email/mailing)
5. Parallel output — Excel + HubSpot/CRM + email summary

