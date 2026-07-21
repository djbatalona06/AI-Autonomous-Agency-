---
id: SMB-B06
title: "WhatsApp AI Customer Support Autoresponder"
vertical: Small Business
new_candidate: true
date_added: 2026-07-21
tags: [n8n-brainstorm, vertical/smb, new-candidate]
---

# WhatsApp AI Customer Support Autoresponder

[[Small Business Index]] · vertical `SMB`

**Source:** [Automate WhatsApp customer support with voice transcription, FAQ and appointment scheduling](https://n8n.io/workflows/8454-automate-whatsapp-customer-support-with-voice-transcription-faq-and-appointment-scheduling)

**Summary:** No card yet — proposed SMB-06. Meets local-service customers on WhatsApp instead of a web form.

## Node design

1. WhatsApp Trigger — text or voice note
2. Speech-to-Text — if voice
3. AI Agent — FAQ answer or classify booking request
4. IF — booking request
5. Google Calendar — check/book
6. WhatsApp — reply
7. Google Sheets — log
