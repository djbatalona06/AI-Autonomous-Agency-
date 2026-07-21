---
id: SAL-B06
title: "AI Reply-Tracking Follow-Up Nudger"
vertical: Sales
new_candidate: true
date_added: 2026-07-21
tags: [n8n-brainstorm, vertical/sal, new-candidate]
---

# AI Reply-Tracking Follow-Up Nudger

[[Sales Index]] · vertical `SAL`

**Source:** [B2B lead follow-up automation with Gemini AI, Gmail and Google Sheets](https://n8n.io/workflows/11283-b2b-lead-follow-up-automation-with-gemini-ai-gmail-and-google-sheets)

**Summary:** No card yet — proposed SAL-06. Thread-aware reply tracking + same-thread nudge, cheap add-on for Template 1/2 clients.

## Node design

1. Schedule Trigger
2. Google Sheets — read intro-email log
3. IF — no reply after N days
4. Gemini/OpenAI — draft casual reminder from thread context
5. Gmail — send as reply on original thread
6. Google Sheets — update status
