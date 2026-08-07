---
id: ECM-B15
title: "AI Product Listing Generator from Photos (Gemini + Airtable)"
vertical: Ecommerce
new_candidate: true
date_added: 2026-08-07
tags: [n8n-brainstorm, vertical/ecm]
---

# AI Product Listing Generator from Photos (Gemini + Airtable)

[[Ecommerce Index]] · vertical `ECM`

**Source:** [Generate Shopify product listings from images with Gemini AI and Airtable](https://n8n.io/workflows/10008-generate-shopify-product-listings-from-images-with-gemini-ai-and-airtable/)

**Summary:** No card yet — proposed `ECM-10`. First listing-creation (content) card in the
vertical — every existing ECM card manages an order/customer lifecycle event; this cuts
new-SKU setup time instead.

## Node design

1. Google Drive/Airtable Trigger — new product photo uploaded
2. Gemini (vision) — identify product, draft title/description/tags
3. Airtable — stage listing for review
4. IF — approved
5. Shopify — create product + variants
6. Slack — notify merchandiser
