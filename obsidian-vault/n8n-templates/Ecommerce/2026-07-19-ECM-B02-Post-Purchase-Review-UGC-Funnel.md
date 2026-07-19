---
id: ECM-B02
title: "Post-Purchase Review & UGC Funnel"
vertical: E-commerce
related_card: ECM-02
new_candidate: false
date_added: 2026-07-19
tags: [n8n-brainstorm, vertical/ecm]
---

# Post-Purchase Review & UGC Funnel

[[E-commerce Index]] · vertical `ECM` · reinforces `ECM-02`

**Source:** Review Request After Service pattern

**Summary:** Times a review ask to happy buyers, routes unhappy ones to support first.

## Node design

1. Shopify Order Trigger — fulfilled
2. Wait 7 days
3. Gmail — review + photo ask
4. IF — in-app rating < 4 → route to support instead of public review
5. Google Sheets — log

