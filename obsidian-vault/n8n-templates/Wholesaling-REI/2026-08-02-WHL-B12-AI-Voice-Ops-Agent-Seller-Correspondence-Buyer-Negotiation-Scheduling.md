---
id: WHL-B12
title: "AI Voice Ops Agent — Seller Correspondence + Buyer Negotiation Scheduling"
vertical: Wholesaling-REI
new_candidate: true
date_added: 2026-08-02
tags: [n8n-brainstorm, vertical/whl]
---

# AI Voice Ops Agent — Seller Correspondence + Buyer Negotiation Scheduling

[[Wholesaling REI Index]] · vertical `WHL`

**Source:** [AI real estate agent: end-to-end ops automation (web, data, voice)](https://n8n.io/workflows/4368-ai-real-estate-agent-end-to-end-ops-automation-web-data-voice/)

**Summary:** `WHL-01`/`WHL-B01` is instant multi-channel follow-up; the pending `WHL-B11`
(draft PR #50) is inbound property-match + scheduling. This is the first card handling live
negotiation talking points and dual seller+buyer correspondence via voice, not just text
follow-up or property matching. Complex tier ($3,500–$5,000).

## Node design

1. Webhook — inbound seller/buyer call or message
2. AI Agent — classify intent (seller inquiry / buyer negotiation / scheduling)
3. Switch — seller branch (draft correspondence, log to CRM) / buyer branch (counter-offer
   talking points, propose times)
4. Google Calendar — book confirmed slot
5. CRM — log outcome
6. Slack — deal-desk notify on any offer/counter
