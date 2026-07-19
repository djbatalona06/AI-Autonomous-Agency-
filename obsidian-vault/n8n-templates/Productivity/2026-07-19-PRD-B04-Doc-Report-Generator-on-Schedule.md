---
id: PRD-B04
title: "Doc & Report Generator on Schedule"
vertical: Productivity
related_card: PRD-04
new_candidate: false
date_added: 2026-07-19
tags: [n8n-brainstorm, vertical/prd]
---

# Doc & Report Generator on Schedule

[[Productivity Index]] · vertical `PRD` · reinforces `PRD-04`

**Source:** Scheduled report → Google Doc pattern

**Summary:** A finished, formatted Google Doc generated on schedule from a template + live data.

## Node design

1. Schedule Trigger
2. Google Sheets/DB — pull live metrics
3. OpenAI — narrative summary
4. Google Docs — populate template
5. Drive save + Slack link

