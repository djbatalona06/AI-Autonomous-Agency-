---
id: ECM-B11
title: "Multi-Channel + Ad Retargeting Abandoned Cart Recovery"
vertical: Ecommerce
related_card: ECM-01
new_candidate: false
date_added: 2026-07-31
tags: [n8n-brainstorm, vertical/ecm]
---

# Multi-Channel + Ad Retargeting Abandoned Cart Recovery

[[Ecommerce Index]] · vertical `ECM`

**Source:** [Recover Shopify abandoned carts with email, SMS, WhatsApp & Facebook retargeting](https://n8n.io/workflows/11805-recover-shopify-abandoned-carts-with-email-sms-whatsapp-and-facebook-retargeting/)

**Summary:** Reinforces `ECM-01` (AI Abandoned Checkout Recovery) with a channel none of the
existing ECM cards touch — syncing abandoners into a paid-media retargeting audience, not
just messaging them directly. Good upsell add-on for any `ECM-01` client already running
Facebook/Meta ads.

## Node design

1. Shopify Webhook — checkout abandoned
2. Wait node — staged delay per touch (1hr / 24hr / 72hr)
3. IF — purchased since abandonment? (stop sequence if true)
4. Switch — touch number (1 / 2 / 3)
5. Touch 1 — Email (Gmail/Klaviyo) reminder
6. Touch 2 — Twilio SMS + WhatsApp Business message
7. Touch 3 — HTTP Request (Meta Custom Audiences API) — add abandoner to Facebook retargeting audience
8. Google Sheets — log recovery status + attributed revenue
