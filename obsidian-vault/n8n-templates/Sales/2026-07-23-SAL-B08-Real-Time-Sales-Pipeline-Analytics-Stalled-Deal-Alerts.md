---
id: SAL-B08
title: "Real-Time Sales Pipeline Analytics & Stalled-Deal Alerts"
vertical: Sales
new_candidate: true
date_added: 2026-07-23
tags: [n8n-brainstorm, vertical/sal, new-candidate]
---

# Real-Time Sales Pipeline Analytics & Stalled-Deal Alerts

[[Sales Index]] · vertical `SAL`

**Source:** [Real-time sales pipeline analytics with Bright Data, OpenAI, and Google Sheets](https://n8n.io/workflows/5974-real-time-sales-pipeline-analytics-with-bright-data-openai-and-google-sheets/)

**Summary:** No card yet — proposed SAL-07. None of B01–B07 give an always-on view across
the whole pipeline — a dashboard-free Ops Retainer add-on for any client already on
SAL-01/SAL-B01.

## Node design

1. Schedule Trigger
2. HTTP Request — CRM API (HubSpot/Salesforce/Pipedrive) pull pipeline data
3. OpenAI — anomaly detection (stalled deals, win-rate shifts)
4. Slack — real-time alert to reps/managers
5. Google Sheets — archive daily snapshot for trend analysis
