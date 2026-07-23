---
id: WHL-B08
title: "SMS-Based AI Real Estate Lead Qualifier"
vertical: Wholesaling/REI
new_candidate: true
date_added: 2026-07-23
tags: [n8n-brainstorm, vertical/whl, new-candidate]
---

# SMS-Based AI Real Estate Lead Qualifier

[[Wholesaling REI Index]] · vertical `WHL`

**Source:** [Qualify real estate leads via SMS with GPT-4o, Twilio, and Google Sheets](https://n8n.io/workflows/6332-qualify-real-estate-leads-via-sms-with-gpt-4o-twilio-and-google-sheets/)

**Summary:** No card yet — proposed WHL-08. Instant SMS pre-qualification the moment a web
lead lands, before any human touch — a cheap on-ramp ahead of the WHL-01 flagship nurture.
A real, live n8n.io template (not a pattern match).

## Node design

1. Webhook — website lead-capture form submitted
2. Twilio SMS — instant reply, opens AI conversation
3. AI Agent (GPT-4o) — asks budget/location/timeline pre-qualifying questions
4. Supabase/Postgres — store chat history keyed to phone number
5. Google Sheets — log qualified lead summary
6. CRM/Slack — hand off to the acquisitions rep
