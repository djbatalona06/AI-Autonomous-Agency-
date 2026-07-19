---
id: PRD-B01
title: "AI Email Triage & Draft Replies"
vertical: Productivity
related_card: PRD-01
new_candidate: false
date_added: 2026-07-19
tags: [n8n-brainstorm, vertical/prd]
---

# AI Email Triage & Draft Replies

[[Productivity Index]] · vertical `PRD` · reinforces `PRD-01`

**Source:** AI-powered email triage & auto-response system with OpenAI Agents and Gmail — https://n8n.io/workflows/9157-ai-powered-email-triage-and-auto-response-system-with-openai-agents-and-gmail/

**Summary:** Pre-sorts every email and drafts a ready-to-edit reply for the ones that matter.

## Node design

1. Gmail Trigger
2. Text Classifier/OpenAI — urgent/follow-up/info/junk
3. Switch — 4 paths
4. OpenAI — draft reply
5. Gmail draft + Google Sheets queue
6. Slack — ping for urgent path

