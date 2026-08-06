---
id: PRD-B14
title: "AI Receipt & Expense Processing Agent"
vertical: Productivity
new_candidate: true
date_added: 2026-08-06
tags: [n8n-brainstorm, vertical/prd]
---

# AI Receipt & Expense Processing Agent

[[Productivity Index]] · vertical `PRD`

**Source:** [Automate receipt processing for expense tracking with Google Drive, VLM Run & Airtable](https://n8n.io/workflows/8393-automate-receipt-processing-for-expense-tracking-with-google-drive-vlm-run-and-airtable/)

**Summary:** First finance/back-office card in `PRD` — every existing card automates
inbox, meetings, or docs, not expenses. Simple tier ($1,500–$2,000) — a clean low-hours
Ops Retainer add-on.

## Node design

1. Google Drive Trigger — new receipt image/PDF in watched folder
2. VLM Run (vision model) — extract vendor, date, line items, total
3. Code — categorize by expense type
4. Airtable — log expense record
5. IF — over threshold → Slack approval ping
6. Schedule Trigger — monthly summary report to Sheets
