---
id: WHL-B11
title: "Inbound Buyer Chatbot — AI Property Match + Auto-Scheduling"
vertical: Wholesaling-REI
new_candidate: true
date_added: 2026-07-31
tags: [n8n-brainstorm, vertical/whl, new-candidate]
---

# Inbound Buyer Chatbot — AI Property Match + Auto-Scheduling

[[Wholesaling REI Index]] · vertical `WHL`

**Source:** [Real estate chatbot with AI property matching and automated calendar scheduling](https://n8n.io/workflows/7250-real-estate-chatbot-with-ai-property-matching-and-automated-calendar-scheduling/)

**Summary:** No card yet — proposed slot TBD. Every existing `WHL-0X`/`WHL-BXX` card is
seller-side and outbound (skip-trace intake, dispo blasts, off-market lead gen, lead
scoring). This is the first *inbound buyer-facing* pattern — a chatbot that matches
inventory to a buyer's stated criteria and books its own showing — opening a second
buyer-side product line alongside the existing seller/wholesaler pipeline.

## Node design

1. Chat/Webhook Trigger — inbound buyer inquiry (site chat widget)
2. AI Agent — parse buyer criteria (budget, beds/baths, location, investment vs. owner-occupant)
3. HTTP Request — query MLS/property database or internal deal inventory
4. Code — match-score available properties against parsed criteria
5. AI Agent — compose match summary + listing links
6. Google Calendar — check showing availability
7. Calendar booking node — auto-schedule showing on accepted slot
8. CRM — log buyer profile, matched properties, and booking
