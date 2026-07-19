---
id: ECM-B05
title: "AI Win-Back / Reactivation Sequence"
vertical: E-commerce
related_card: ECM-05
new_candidate: false
date_added: 2026-07-19
tags: [n8n-brainstorm, vertical/ecm]
---

# AI Win-Back / Reactivation Sequence

[[E-commerce Index]] · vertical `ECM` · reinforces `ECM-05`

**Source:** Win-back / reactivation pattern (Shopify + LLM node)

**Summary:** Finds lapsed customers and sends AI-personalized win-back offers.

## Node design

1. Schedule Trigger
2. Shopify — customers past reorder window
3. OpenAI — personalize offer from purchase history
4. Klaviyo/Gmail — send
5. Google Sheets — log response

