---
id: SAL-B01
title: "AI Lead Enrichment & CRM Router"
vertical: Sales
related_card: SAL-01
new_candidate: false
date_added: 2026-07-19
tags: [n8n-brainstorm, vertical/sal]
---

# AI Lead Enrichment & CRM Router

[[Sales Index]] · vertical `SAL` · reinforces `SAL-01`

**Source:** Lead Enrichment Pipeline (n8n.io category: Sales)

**Summary:** Every inbound lead enriched, scored, and routed to a rep with zero manual entry.

## Node design

1. Webhook / Typeform Trigger
2. HTTP Request — Clearbit/Apollo enrichment
3. Code — lead score 0-100
4. Switch — route by score/company size
5. HubSpot/Pipedrive — create-or-update contact
6. Slack — notify owning rep

