---
id: WHL-B04
title: "Deal Analyzer Intake → ARV/MAO Brief"
vertical: Wholesaling / REI
related_card: WHL-05
new_candidate: false
date_added: 2026-07-19
tags: [n8n-brainstorm, vertical/whl]
---

# Deal Analyzer Intake → ARV/MAO Brief

[[Wholesaling / REI Index]] · vertical `WHL` · reinforces `WHL-05`

**Source:** Zillow Investment Scanner + AI Scoring pattern, adapted for ARV/MAO

**Summary:** Submit an address, get a consistent deal brief with ARV/MAO/rehab computed.

## Node design

1. Webhook — address submitted
2. HTTP Request — comps via Apify/Zillow scrape
3. Code — ARV, MAO, rehab formula
4. PDF generation
5. CRM log + Slack/email brief

