---
id: SMB-B10
title: "Insurance Quote Lead Routing"
vertical: Small Business
new_candidate: true
date_added: 2026-07-25
tags: [n8n-brainstorm, vertical/smb, new-candidate]
---

# Insurance Quote Lead Routing

[[Small Business Index]] · vertical `SMB`

**Source:** [Route insurance quote leads with OpenAI, Airtable, Sheets, Teams, Slack and Twilio](https://n8n.io/workflows/17075-route-insurance-quote-leads-with-openai-airtable-sheets-teams-slack-and-twilio/)

**Summary:** No card yet — proposed slot TBD (depends which of SMB-06/07/08/09 land
first). First insurance-specific SMB candidate — same slow-follow-up pain as `SMB-01`, in a
regulated vertical with underwriting-flag nuance built into the AI scoring step. Buyers
choose their own stack (Teams or Slack, Airtable or Sheets).

## Node design

1. Webhook — quote-form submission
2. Code — normalize payload
3. Airtable/Google Sheets — dedupe vs. recent email/phone
4. OpenAI — lead score, priority, underwriting flags, missing-info, next steps
5. Switch — hot/warm/cold
6. Teams/Slack alert (hot/warm) + Twilio SMS to agent (hot only)
7. Airtable/Sheets — log quote + status
