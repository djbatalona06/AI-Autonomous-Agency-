---
id: WHL-B15
title: "Conversational AI Property Search Agent (Buyer-Facing)"
vertical: Wholesaling-REI
related_card: WHL-02
new_candidate: false
date_added: 2026-08-07
tags: [n8n-brainstorm, vertical/whl]
---

# Conversational AI Property Search Agent (Buyer-Facing)

[[Wholesaling-REI Index]] · vertical `WHL`

**Source:** [Find your home with Real Estate Agent and Bright Data](https://n8n.io/workflows/4872-find-your-home-with-real-estate-agent-and-bright-data/)

**Summary:** Buyer-facing counterpart to `WHL-02`'s dispo matching — lets cash buyers
self-serve a natural-language property search instead of a manual blast list, feeding
matches straight into the existing dispo CRM step.

## Node design

1. Chat Widget/WhatsApp Trigger — buyer inquiry
2. AI Agent — parse criteria (budget, area, beds/baths, investor vs. owner-occupant)
3. HTTP Request — Bright Data/MLS listing search
4. Code — match against cash-buyer buy-box on file
5. AI Agent — conversational results + follow-up questions
6. CRM — log buyer + matched listings
