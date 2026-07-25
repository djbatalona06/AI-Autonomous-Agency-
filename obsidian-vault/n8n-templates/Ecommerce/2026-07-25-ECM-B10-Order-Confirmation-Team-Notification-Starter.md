---
id: ECM-B10
title: "Order Confirmation + Team Notification Starter"
vertical: Ecommerce
new_candidate: true
date_added: 2026-07-25
tags: [n8n-brainstorm, vertical/ecm, new-candidate]
---

# Order Confirmation + Team Notification Starter

[[Ecommerce Index]] · vertical `ECM`

**Source:** [Automate e-commerce order processing with email notifications & webhooks](https://n8n.io/workflows/7518-automate-e-commerce-order-processing-with-email-notifications-and-webhooks/)

**Summary:** No card yet — proposed slot TBD (depends which of ECM-06/07/08/09 land
first). Beginner-friendly, 5-minute-setup entry point below every other ECM card — its
"new store owner, built-in nodes only" framing is a near-perfect Rung 1 Template Install
($750, 14-day warranty), and a natural cross-sell into ECM-01 once the store has volume.

## Node design

1. Webhook — new-order event (Shopify/WooCommerce/BigCommerce/Etsy)
2. Set — store config (name, contact, branding)
3. IF — required fields present
4. Gmail — branded customer confirmation
5. Gmail — internal team/fulfillment alert
6. Respond to Webhook — ack back to the platform
