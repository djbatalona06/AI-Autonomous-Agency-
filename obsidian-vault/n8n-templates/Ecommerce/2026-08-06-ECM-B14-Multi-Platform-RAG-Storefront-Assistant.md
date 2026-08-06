---
id: ECM-B14
title: "Multi-Platform RAG Storefront Assistant (Shopify + WooCommerce)"
vertical: Ecommerce
related_card: ECM-B06
new_candidate: true
date_added: 2026-08-06
tags: [n8n-brainstorm, vertical/ecm]
---

# Multi-Platform RAG Storefront Assistant (Shopify + WooCommerce)

[[Ecommerce Index]] · vertical `ECM` · reinforces `ECM-B06`

**Source:** [E-commerce assistant for Shopify & WooCommerce with GPT-4o, Gemini & RAG](https://n8n.io/workflows/6100-e-commerce-assistant-for-shopify-and-woocommerce-with-gpt-4o-gemini-and-rag/)

**Summary:** `ECM-B06` is Shopify + Supabase order-memory only; this adds a RAG layer over
catalog/policy docs (not just order history) and native WooCommerce support — a fit for
merchants running both platforms. Medium tier ($2,000–$3,500).

## Node design

1. Chat Widget/Webhook Trigger — either platform
2. Switch — route by store platform (Shopify vs. WooCommerce)
3. Vector Store retrieval — product catalog + policy docs (RAG)
4. Shopify/WooCommerce node — live order-status lookup
5. AI Agent (GPT-4o/Gemini) — answer grounded in catalog docs + live order data
6. IF — needs human (refund/complaint) → Slack/Zendesk escalate
