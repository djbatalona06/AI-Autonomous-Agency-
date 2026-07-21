---
id: WHL-B06
title: "Inbound Lead Auto-Router by Intent (Rent/Sell/Buy) + AI Personalization"
vertical: Wholesaling / REI
new_candidate: true
date_added: 2026-07-21
tags: [n8n-brainstorm, vertical/whl, new-candidate]
---

# Inbound Lead Auto-Router by Intent (Rent/Sell/Buy) + AI Personalization

[[Wholesaling / REI Index]] · vertical `WHL`

**Source:** Real estate property follow-up automation pattern (n8n practitioner community, July 2026)

**Summary:** No card yet — proposed WHL-07. Front-door intent router ahead of the WHL-01 flagship nurture sequence.

## Node design

1. Webhook — site form/Facebook Lead Ads
2. AI Agent — classify intent (rent/sell/buy/investor)
3. Switch — route by intent
4. OpenAI — personalize opener from property/source
5. CRM — create-or-update
6. Google Calendar — book showing if applicable
7. Slack — notify the right agent
