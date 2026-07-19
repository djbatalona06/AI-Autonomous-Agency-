---
id: SAL-B02
title: "Cold Outreach Multichannel Sequencer"
vertical: Sales
related_card: SAL-02
new_candidate: false
date_added: 2026-07-19
tags: [n8n-brainstorm, vertical/sal]
---

# Cold Outreach Multichannel Sequencer

[[Sales Index]] · vertical `SAL` · reinforces `SAL-02`

**Source:** Multichannel Outreach Workflow

**Summary:** Syncs email + LinkedIn outreach so the same prospect never gets double-messaged.

## Node design

1. Schedule Trigger
2. Google Sheets — prospect list
3. HTTP Request — LinkedIn/PhantomBuster activity check
4. IF — already contacted this week?
5. Gmail/SendGrid — send
6. Wait, then update Sheets status

