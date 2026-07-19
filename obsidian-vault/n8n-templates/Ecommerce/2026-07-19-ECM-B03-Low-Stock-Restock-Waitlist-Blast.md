---
id: ECM-B03
title: "Low-Stock + Restock Waitlist Blast"
vertical: E-commerce
related_card: ECM-04
new_candidate: false
date_added: 2026-07-19
tags: [n8n-brainstorm, vertical/ecm]
---

# Low-Stock + Restock Waitlist Blast

[[E-commerce Index]] · vertical `ECM` · reinforces `ECM-04`

**Source:** Restock Alert: Back-in-Stock Waitlist Notifier

**Summary:** Real-time low-stock alerts plus an automatic waitlist blast on restock.

## Node design

1. Schedule Trigger
2. Shopify/WooCommerce — inventory levels
3. IF — below threshold
4. Telegram/Slack — alert owner
5. Airtable — waitlist lookup
6. Klaviyo/Gmail — back-in-stock blast

