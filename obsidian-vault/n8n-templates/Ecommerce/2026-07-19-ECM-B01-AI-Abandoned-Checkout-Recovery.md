---
id: ECM-B01
title: "AI Abandoned Checkout Recovery"
vertical: E-commerce
related_card: ECM-01
new_candidate: false
date_added: 2026-07-19
tags: [n8n-brainstorm, vertical/ecm]
---

# AI Abandoned Checkout Recovery

[[E-commerce Index]] · vertical `ECM` · reinforces `ECM-01`

**Source:** CartRescue: AI Abandoned-Checkout Recovery

**Summary:** Chases every abandoned cart on a 3-touch cadence and stops the moment they buy.

## Node design

1. Shopify Webhook — checkout/create
2. Wait 1h
3. HTTP Request — Shopify Orders API (converted?)
4. IF — purchased?
5. Gmail/Klaviyo — 3-touch sequence (1h/24h/72h, discount on touch 3)
6. Google Sheets — log

