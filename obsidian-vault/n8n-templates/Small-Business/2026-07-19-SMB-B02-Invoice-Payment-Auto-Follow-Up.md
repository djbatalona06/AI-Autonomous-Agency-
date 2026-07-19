---
id: SMB-B02
title: "Invoice → Payment → Auto Follow-Up"
vertical: Small Business
related_card: SMB-02
new_candidate: false
date_added: 2026-07-19
tags: [n8n-brainstorm, vertical/smb]
---

# Invoice → Payment → Auto Follow-Up

[[Small Business Index]] · vertical `SMB` · reinforces `SMB-02`

**Source:** InvoiceChase: Automated AR Follow-up

**Summary:** Every unpaid invoice chases itself with polite branded reminders.

## Node design

1. Stripe/QuickBooks Webhook — invoice created
2. Wait (day 1/7/14)
3. IF — paid?
4. Gmail — branded reminder
5. Slack — escalation on day 14 if unpaid

