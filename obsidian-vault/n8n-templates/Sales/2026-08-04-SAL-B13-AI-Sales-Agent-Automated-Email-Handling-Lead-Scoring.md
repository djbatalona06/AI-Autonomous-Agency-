---
id: SAL-B13
title: "AI Sales Agent — Automated Email Handling & Lead Scoring"
vertical: Sales
new_candidate: true
date_added: 2026-08-04
tags: [n8n-brainstorm, vertical/sal]
---

# AI Sales Agent — Automated Email Handling & Lead Scoring

[[Sales Index]] · vertical `SAL`

**Source:** [AI sales agent — fully automated email handling & lead scoring system](https://n8n.io/workflows/10128-ai-sales-agent-fully-automated-email-handling-and-lead-scoring-system/)

**Summary:** Scores and routes on every inbound reply as the email conversation
continues — an always-on inbox layer, distinct from `SAL-01`'s one-time intake scoring and
`SAL-B12`'s pre-outreach research. Medium tier ($2,000–$3,500).

## Node design

1. Email Trigger (IMAP/Gmail) — inbound lead reply or inquiry
2. AI Agent — classify + score lead hot/warm/cold from message content
3. CRM update — write score + stage
4. Switch by score — hot: AI drafts reply + Slack ping / cold: nurture-sequence tag
5. Gmail — send AI-drafted reply (human-reviewed queue for hot leads)
6. Google Sheets — scoring log for pipeline reporting
