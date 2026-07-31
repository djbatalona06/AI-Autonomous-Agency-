---
id: SAL-B11
title: "Inbound Multi-Channel AI Sales Agent with RAG + Booking"
vertical: Sales
new_candidate: true
date_added: 2026-07-31
tags: [n8n-brainstorm, vertical/sal, new-candidate]
---

# Inbound Multi-Channel AI Sales Agent with RAG + Booking

[[Sales Index]] · vertical `SAL`

**Source:** [Multi-platform AI sales agent with RAG, CRM logging & appointment booking](https://n8n.io/workflows/4508-multi-platform-ai-sales-agent-with-rag-crm-logging-and-appointment-booking/)

**Summary:** No card yet — proposed slot TBD. Every existing `SAL-0X`/`SAL-BXX` card assumes
an outbound motion (enrich a lead, sequence outreach, alert on pipeline rot). This is the
first *inbound*, always-on sales agent: it answers prospects across Website Chat, WhatsApp,
Instagram, and Facebook in one workflow, grounds its answers in a real knowledge base
instead of freelancing, and books its own meetings. Natural feeder into `SAL-03` (the
booked-meeting → CRM + AI call-prep card) once a lead converts.

## Node design

1. Multi-channel Trigger — Webhook (Website Chat / WhatsApp / Instagram DM / Facebook Messenger)
2. Switch — normalize per-channel payload to one canonical message schema
3. Vector Store lookup (Pinecone/Supabase Vector) — retrieve relevant product/pricing docs
4. AI Agent (RAG-grounded) — answer from retrieved context, detect booking intent
5. CRM (HubSpot/Pipedrive/Airtable) — upsert contact + log conversation turn
6. IF — booking intent detected
7. Google Calendar / Cal.com — check availability + create booking
8. Respond on originating channel — confirmation message + calendar link
