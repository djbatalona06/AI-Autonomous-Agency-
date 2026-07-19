---
id: WHL-B05
title: "Open-House / Inbound-Call → 7-Day AI Follow-Up"
vertical: Wholesaling / REI
new_candidate: true
date_added: 2026-07-19
tags: [n8n-brainstorm, vertical/whl, new-candidate]
---

# Open-House / Inbound-Call → 7-Day AI Follow-Up

[[Wholesaling / REI Index]] · vertical `WHL`

**Source:** Open House CRM Sync + 7-Day Auto Follow-Up

**Summary:** No card yet — proposed WHL-06. Same shape as the WHL-01 flagship, for inbound acquisitions leads instead of outbound seller leads.

## Node design

1. Webhook — sign-in sheet/call intake
2. Code — lead scoring
3. CRM sync — HubSpot/FUB/Monday.com
4. OpenAI-personalized SMS + email cadence (Twilio + SendGrid) over 7 days
5. CRM — flip to Hot on any reply

