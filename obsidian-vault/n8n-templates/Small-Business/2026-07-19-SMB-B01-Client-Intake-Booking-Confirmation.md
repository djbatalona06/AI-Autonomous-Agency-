---
id: SMB-B01
title: "Client Intake → Booking + Confirmation"
vertical: Small Business
related_card: SMB-01
new_candidate: false
date_added: 2026-07-19
tags: [n8n-brainstorm, vertical/smb]
---

# Client Intake → Booking + Confirmation

[[Small Business Index]] · vertical `SMB` · reinforces `SMB-01`

**Source:** Appointment Follow-Up Workflow (n8n community thread)

**Summary:** Every inquiry becomes a booked appointment and a logged contact, zero double entry.

## Node design

1. Webhook — form/Calendly
2. CRM — create-or-update contact
3. Google Calendar — book/check availability
4. Gmail/SMS — confirmation
5. Slack — notify owner

