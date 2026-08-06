---
id: SMB-B14
title: "Custom Booking Engine (Calendar + Business Hours + REST API)"
vertical: Small-Business
related_card: SMB-01
new_candidate: true
date_added: 2026-08-06
tags: [n8n-brainstorm, vertical/smb]
---

# Custom Booking Engine (Calendar + Business Hours + REST API)

[[Small Business Index]] · vertical `SMB` · reinforces `SMB-01`

**Source:** [Complete booking system with Google Calendar, business hours & REST API](https://n8n.io/workflows/8635-complete-booking-system-with-google-calendar-business-hours-and-rest-api/)

**Summary:** `SMB-01` confirms an intake booking and `SMB-05` chases no-shows — both are
messaging layers on top of an existing calendar. This is the booking backend/API itself,
for a client with no calendar tooling who needs a custom intake form built on top. Medium
tier ($2,000–$3,500).

## Node design

1. Webhook (REST API) — availability query / booking request from any front-end
2. Code — apply business-hours + buffer-time rules
3. Google Calendar — check conflicts
4. IF — slot available
5. Google Calendar — create event
6. Webhook Response — confirmation payload back to caller
