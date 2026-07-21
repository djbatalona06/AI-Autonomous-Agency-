---
id: PRD-B05
title: "Inbound File → Structured Data → Sheet"
vertical: Productivity
related_card: PRD-05
new_candidate: false
date_added: 2026-07-19
tags: [n8n-brainstorm, vertical/prd]
---

# Inbound File → Structured Data → Sheet

[[Productivity Index]] · vertical `PRD` · reinforces `PRD-05`

**Source:** Expense receipt / invoice email → spreadsheet pattern

**Summary:** Any inbound file is read, fields extracted + validated, low-confidence ones flagged.

## Node design

1. Gmail/Drive Trigger — new attachment
2. HTTP Request — LlamaParse/OCR
3. OpenAI — extract + validate fields
4. IF — confidence below threshold → flag row for a human
5. Google Sheets — append

