---
id: SMB-B04
title: "Review & Reputation Engine"
vertical: Small Business
related_card: SMB-04
new_candidate: false
date_added: 2026-07-19
tags: [n8n-brainstorm, vertical/smb]
---

# Review & Reputation Engine

[[Small Business Index]] · vertical `SMB` · reinforces `SMB-04`

**Source:** Review Request After Service + review-monitoring pattern

**Summary:** Happy customers get nudged to review; unhappy ones get routed to you first.

## Node design

1. Schedule/Webhook — job completed → Wait 2 days → Gmail/SMS review ask
2. IF — in-app rating < 4 → route to support else → Google/Yelp review link
3. Second branch: Schedule Trigger → Google Business Profile (new reviews) → Slack alert

