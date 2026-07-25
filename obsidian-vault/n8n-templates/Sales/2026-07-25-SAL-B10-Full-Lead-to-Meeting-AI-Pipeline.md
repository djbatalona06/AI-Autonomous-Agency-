---
id: SAL-B10
title: "Full Lead-to-Meeting AI Pipeline"
vertical: Sales
related_card: SAL-01
new_candidate: false
date_added: 2026-07-25
tags: [n8n-brainstorm, vertical/sal]
---

# Full Lead-to-Meeting AI Pipeline

[[Sales Index]] · vertical `SAL`

**Source:** [Run a full lead-to-meeting pipeline with Google Sheets, Gmail, Gemini and OpenAI](https://n8n.io/workflows/17383-run-a-full-lead-to-meeting-pipeline-with-google-sheets-gmail-gemini-and-openai/)

**Summary:** Reinforces `SAL-01`/`SAL-02`/`SAL-03` — the most complete reference build seen
yet for the full capture → outreach → meeting-prep chain in one workflow. The reply-intent
classifier (book/object/decline) and no-show re-engagement branch are new patterns not yet
reflected in any `SAL-0X` card; worth pulling apart into standalone add-ons rather than one
$3k+ monolith sale.

## Node design

1. Webhook — new lead
2. HTTP Request — Apollo org-enrich
3. Gemini — score + tier (hot/warm/poor_fit)
4. Google Sheets — leads CRM tab
5. Switch by tier — Gemini personalized first-touch → Gmail + UltraMsg send
6. Webhook — inbound reply → OpenAI classify intent (book_meeting/objection/not_interested)
7. Schedule Trigger — non-responder follow-ups, pre-call Slack brief, weekly conversion report, no-show re-engagement
