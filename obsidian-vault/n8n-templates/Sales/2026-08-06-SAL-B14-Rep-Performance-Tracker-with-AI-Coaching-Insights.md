---
id: SAL-B14
title: "Rep Performance Tracker with AI Coaching Insights"
vertical: Sales
related_card: SAL-B08
new_candidate: true
date_added: 2026-08-06
tags: [n8n-brainstorm, vertical/sal]
---

# Rep Performance Tracker with AI Coaching Insights

[[Sales Index]] · vertical `SAL` · reinforces `SAL-B08`

**Source:** [Track and analyze sales performance with AI insights and Google Sheets](https://n8n.io/workflows/5975-track-and-analyze-sales-performance-with-ai-insights-and-google-sheets/)

**Summary:** Manager-facing rep coaching tool — `SAL-B08` alerts on individual stalled
deals; this scores rep activity/quota trends over time and surfaces coaching guidance.
Medium tier ($2,000–$3,500).

## Node design

1. Schedule Trigger — daily
2. HTTP Request — CRM + telephony/email log pull (calls, emails, meetings, quota attainment per rep)
3. Code — aggregate activity metrics per rep
4. AI Agent — analyze patterns, surface coaching tips + quota-risk flags
5. Google Sheets — write rep scorecard
6. Slack — weekly manager digest
