---
id: SAL-B03
title: "AI Proposal / Quote Generator"
vertical: Sales
related_card: SAL-04
new_candidate: false
date_added: 2026-07-19
tags: [n8n-brainstorm, vertical/sal]
---

# AI Proposal / Quote Generator

[[Sales Index]] · vertical `SAL` · reinforces `SAL-04`

**Source:** AI proposal generator pattern (agency template roundups)

**Summary:** Turns deal notes + line items into a branded proposal PDF, ready to send.

## Node design

1. CRM Trigger — deal stage = Proposal
2. OpenAI — draft from notes + line items
3. HTML/PDF render
4. CRM — attach document
5. Slack/Email — queue for one-click send + e-sign

