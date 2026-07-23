---
id: SMB-B08
title: "AI Request-to-Quote PDF Generator"
vertical: Small Business
new_candidate: true
date_added: 2026-07-23
tags: [n8n-brainstorm, vertical/smb, new-candidate]
---

# AI Request-to-Quote PDF Generator

[[Small Business Index]] · vertical `SMB`

**Source:** [Automated request-to-quote with OpenAI, Google Sheets & CraftMyPDF](https://n8n.io/workflows/8239-automated-request-to-quote-with-openai-google-sheets-and-craftmypdf/)

**Summary:** No card yet — proposed SMB-07. Nothing in SMB-B01–B06 gets a priced quote out
the door — SMB-01 books the appointment, SMB-02 chases the invoice after the fact; this
fills the gap in between. Clean $1,500–$2,000 Rung 2 Simple sell for any service business
still quoting by hand or spreadsheet.

## Node design

1. Form Trigger — "Request a Quote" (requirements, budget, need-by date)
2. Google Sheets — load product/service catalog (SKU, price, stock, min qty)
3. OpenAI — select line items, build a strict JSON quote (respects stock/min qty, discount cap)
4. Code — compute totals, VAT, invoice number, due date
5. CraftMyPDF — render a branded PDF quote
6. Email (SMTP) — send the customer the quote automatically
