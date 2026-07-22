---
id: SMB-B07
title: "Inbound Vendor Invoice OCR → AP Auto-Entry"
vertical: Small Business
new_candidate: true
date_added: 2026-07-22
tags: [n8n-brainstorm, vertical/smb, new-candidate]
---

# Inbound Vendor Invoice OCR → AP Auto-Entry

[[Small Business Index]] · vertical `SMB`

**Source:** [Classify documents and extract invoice data with LDXhub AnalyzeDoc and Google Sheets](https://n8n.io/workflows/17039-classify-documents-and-extract-invoice-data-with-ldxhub-analyzedoc-and-google-sheets/) + [Extract and validate invoice data from Google Drive using OCR.Space, Gemini, and Google Sheets](https://n8n.io/workflows/17077-extract-and-validate-invoice-data-from-google-drive-using-ocrspace-gemini-and-google-sheets/)

**Summary:** No card yet — proposed SMB-06/07. Flips SMB-02 (outbound AR reminders) around:
this automates the *inbound* accounts-payable side — a natural upsell to any client already
on SMB-02.

## Node design

1. Email/Webhook Trigger — incoming vendor invoice (attachment)
2. OCR/AI Extract — LDXhub AnalyzeDoc or Gemini OCR pulls vendor, amount, due date, line items
3. Edit Fields — normalize into canonical AP schema
4. If — matches known vendor/PO or under budget threshold
5. QuickBooks/Xero — create bill
6. Slack — approval ping for anything over threshold
7. Google Sheets — AP log (audit trail)
