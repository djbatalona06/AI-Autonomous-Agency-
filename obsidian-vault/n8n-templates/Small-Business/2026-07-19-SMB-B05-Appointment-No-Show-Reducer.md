---
id: SMB-B05
title: "Appointment No-Show Reducer"
vertical: Small Business
related_card: SMB-05
new_candidate: false
date_added: 2026-07-19
tags: [n8n-brainstorm, vertical/smb]
---

# Appointment No-Show Reducer

[[Small Business Index]] · vertical `SMB` · reinforces `SMB-05`

**Source:** Appointment Reminder SMS pattern

**Summary:** Reminders at 24h + 2h, and no-shows get nudged to rebook instead of vanishing.

## Node design

1. Schedule Trigger
2. Calendar query — appointments tomorrow / in 2h
3. Twilio SMS — one-tap confirm/reschedule
4. IF — no confirm by cutoff → follow-up nudge to rebook
5. Google Sheets — log no-show rate

