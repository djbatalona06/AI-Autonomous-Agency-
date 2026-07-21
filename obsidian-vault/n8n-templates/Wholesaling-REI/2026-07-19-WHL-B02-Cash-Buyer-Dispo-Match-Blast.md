---
id: WHL-B02
title: "Cash-Buyer Dispo Match + Blast"
vertical: Wholesaling / REI
related_card: WHL-02
new_candidate: false
date_added: 2026-07-19
tags: [n8n-brainstorm, vertical/whl]
---

# Cash-Buyer Dispo Match + Blast

[[Wholesaling / REI Index]] · vertical `WHL` · reinforces `WHL-02`

**Source:** Dispo-matching pattern (wholesaling automation guides)

**Summary:** Matches a new deal against the buyer database instead of blasting the whole list.

## Node design

1. Webhook — new deal submitted
2. Airtable/CRM — query cash-buyer DB
3. Code — match buy-box criteria
4. Twilio SMS + SendGrid — blast matched buyers only
5. CRM — log

