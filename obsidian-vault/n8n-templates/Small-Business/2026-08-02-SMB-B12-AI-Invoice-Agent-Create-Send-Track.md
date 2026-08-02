---
id: SMB-B12
title: "AI Invoice Agent — Create, Send, Track"
vertical: Small-Business
related_card: SMB-02
new_candidate: false
date_added: 2026-08-02
tags: [n8n-brainstorm, vertical/smb]
---

# AI Invoice Agent — Create, Send, Track

[[Small Business Index]] · vertical `SMB`

**Source:** [AI invoice agent](https://n8n.io/workflows/7905-ai-invoice-agent/)

**Summary:** `SMB-02` chases invoices that already exist and are unpaid; this is the front
half — drafting and issuing the invoice from raw job notes in the first place, and
initializing status tracking. Natural pairing: sell this + `SMB-02` together as the full
invoice lifecycle. Medium tier ($2,000–$3,500).

## Node design

1. Webhook/Form — job or order marked billable
2. AI Agent — draft line items from job notes
3. PDF generation — invoice template
4. Gmail — send to customer
5. Google Sheets/Airtable — log invoice, status = sent
6. Schedule Trigger — daily status poll
7. IF — marked paid in accounting tool — update status
