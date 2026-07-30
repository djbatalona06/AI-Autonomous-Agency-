---
id: ECM-B08
title: "Auto-Segment Customers by Purchase Behavior"
vertical: Ecommerce
new_candidate: true
date_added: 2026-07-23
tags: [n8n-brainstorm, vertical/ecm, new-candidate]
---

# Auto-Segment Customers by Purchase Behavior

[[Ecommerce Index]] · vertical `ECM`

**Source:** [Segment retail customers by purchase behavior with CRM and Google Sheets](https://n8n.io/workflows/12870-segment-retail-customers-by-purchase-behavior-with-crm-and-google-sheets/)

**Summary:** No card yet — proposed ECM-08. Ongoing lifecycle segmentation feeding targeted
campaigns — pairs naturally with ECM-B05's win-back sequence (segment first, then trigger
the right sequence per tier).

## Node design

1. Webhook — new order/customer-update event (Shopify/WooCommerce/CRM)
2. Code — normalize order count, lifetime spend, last-order date, category
3. Switch — classify new / repeat / VIP / inactive
4. CRM/email platform — sync segment tag
5. Google Sheets — log the segmentation event
