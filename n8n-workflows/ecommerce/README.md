---
title: Ecommerce — n8n Node Designs
tags: [n8n, vertical/ecommerce, automation-agency]
aliases: [Ecommerce Workflows]
parent: "[[../_index|n8n Workflow Brainstorm]]"
updated: 2026-07-18
---

# Ecommerce

5 node designs seeded from n8n.io/workflows and n8n's own "6 e-commerce workflows" blog series, aligned with `templates/template-5-abandoned-cart` in the private repo. Target client: Shopify/WooCommerce store owners doing $5K+/mo.

## 1. Abandoned Cart Recovery (3-touch)
- **Trigger:** Shopify Webhook (`checkout/create`)
- **Node chain:** Webhook Trigger → Wait (1 hr) → HTTP Request (Shopify Orders API, check conversion) → IF not converted → Gmail/Brevo Email 1 (cart contents) → Wait 24h → Email 2 → Wait 48h → Email 3 (discount code) → Google Sheets log (recovery rate)
- **Fit:** Rung 1 template install, $1,000–$1,500. Already Template 5 — reuse directly.
- **Inspired by:** [5 n8n Shopify Automation Workflows](https://us.bkwebdesigns.com/n8n-shopify-automation-workflows/)

## 2. Order Fulfillment Automation
- **Trigger:** Shopify Trigger (new order)
- **Node chain:** Shopify Trigger → Shopify node (List Fulfillment Orders → get fulfillment order ID) → Shopify node (mark fulfillment order as fulfilled) → IF error/partial → Slack alert → Sheets log
- **Fit:** Rung 1 template install, $750–$1,000. Simple, near turnkey.
- **Inspired by:** [Automatic Shopify order fulfillment process](https://n8n.io/workflows/3296-automatic-shopify-order-fulfillment-process/)

## 3. Post-Purchase Nurture Sequence
- **Trigger:** Shopify Trigger (order created)
- **Node chain:** Shopify Trigger → Gmail (branded order confirmation) → Wait 3 days → Gmail (usage-tips email) → Wait 4 days → Gmail (review request, links to Judge.me/Loox/native reviews) → Sheets log
- **Fit:** Rung 1 template install, $1,000–$1,250.
- **Inspired by:** [5 n8n Shopify Automation Workflows](https://us.bkwebdesigns.com/n8n-shopify-automation-workflows/)

## 4. Oversell Sentinel (Inventory Drift Alarm)
- **Trigger:** Schedule Trigger (hourly)
- **Node chain:** Schedule Trigger → HTTP Request (Shopify Admin API, stock per SKU) → Compare vs. threshold/other channels → IF low/oversold → Slack + Email alert → Sheets log
- **Fit:** Rung 2 Simple, $1,500–$2,000. Multi-channel inventory checks add complexity.
- **Inspired by:** [Oversell Sentinel: Multichannel Inventory Drift Alarm](https://www.n8ntemplatestore.com/templates/category/ecommerce) (n8ntemplatestore.com)

## 5. OrderShield — High-Risk & Fake Order Triage
- **Trigger:** Shopify/WooCommerce Webhook (new order)
- **Node chain:** Webhook Trigger → HTTP Request (fraud/risk score API) → IF high risk → Hold order + Slack alert to owner for manual review → Else → auto-continue to fulfillment path
- **Fit:** Rung 2 Simple, $1,500–$2,000. High client value (prevents chargebacks) — good upsell after Template 5.
- **Inspired by:** [OrderShield: High-Risk & Fake Order Triage](https://www.n8ntemplatestore.com/templates/category/ecommerce) (n8ntemplatestore.com)

## Pipeline Log
<!-- Daily cron appends new candidates below this line. Do not remove. -->
