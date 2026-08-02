---
id: ECM-B12
title: "AI Product-to-Blog SEO Content Generator"
vertical: Ecommerce
new_candidate: true
date_added: 2026-08-02
tags: [n8n-brainstorm, vertical/ecm]
---

# AI Product-to-Blog SEO Content Generator

[[Ecommerce Index]] · vertical `ECM`

**Source:** [Auto-generate problem-focused blog posts for Shopify products with AI](https://n8n.io/workflows/5107-auto-generate-problem-focused-blog-posts-for-shopify-products-with-ai/)

**Summary:** First content-marketing/SEO card in `ECM` — every existing card automates a
transactional lifecycle step (cart, reviews, stock, pricing, support, brand-protection),
not a top-of-funnel traffic play. Simple tier ($1,500–$2,000) — good upsell once
`ECM-01`/`ECM-05` are already live.

## Node design

1. Schedule Trigger — weekly
2. Shopify — Get Many products
3. Filter — no blog post yet / needs refresh
4. AI Agent — problem-focused SEO blog draft per product
5. Shopify/CMS — create draft blog post
6. Slack — review ping
