---
id: ECM-B07
title: "AI Seasonal Product Photo/Video Restyler"
vertical: Ecommerce
new_candidate: true
date_added: 2026-07-22
tags: [n8n-brainstorm, vertical/ecm, new-candidate]
---

# AI Seasonal Product Photo/Video Restyler

[[Ecommerce Index]] · vertical `ECM`

**Source:** [Restyle seasonal Shopify product images with dreem.ai and Slack](https://n8n.io/workflows/17273-restyle-seasonal-shopify-product-images-with-dreemai-and-slack/) (n8n.io recently-added, 2026-07-22 listing)

**Summary:** No card yet — proposed ECM-06/07. Near-zero marginal cost for Yawn since the
agency already has Higgsfield access — batch-restyles a Shopify catalog for a season/promo
without a photo shoot. Distinct from B01–B06 (none touch product imagery).

## Node design

1. Schedule Trigger (seasonal catalog refresh window)
2. Shopify — Get Many products (filtered by collection/tag)
3. If — needs seasonal refresh (tag check)
4. Loop Over Items (Split in Batches)
5. Higgsfield / Dreem.ai — generate restyled or on-model product photo
6. Shopify — update product media
7. Slack — batch review digest before publish
