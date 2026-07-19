---
id: SAL-B04
title: "Meeting-Booked → CRM + AI Call-Prep"
vertical: Sales
related_card: SAL-03
new_candidate: false
date_added: 2026-07-19
tags: [n8n-brainstorm, vertical/sal]
---

# Meeting-Booked → CRM + AI Call-Prep

[[Sales Index]] · vertical `SAL` · reinforces `SAL-03`

**Source:** Calendly-to-CRM + AI attendee research pattern

**Summary:** The instant a call is booked, the rep gets a one-page AI prep brief.

## Node design

1. Calendly/Google Calendar Trigger
2. HTTP Request — Clearbit/LinkedIn enrich attendee
3. OpenAI — summarize + talking points
4. CRM — update deal stage
5. Slack DM + Email — prep brief to rep

