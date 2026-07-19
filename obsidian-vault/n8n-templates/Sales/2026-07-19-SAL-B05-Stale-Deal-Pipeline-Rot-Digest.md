---
id: SAL-B05
title: "Stale-Deal / Pipeline-Rot Digest"
vertical: Sales
related_card: SAL-05
new_candidate: false
date_added: 2026-07-19
tags: [n8n-brainstorm, vertical/sal]
---

# Stale-Deal / Pipeline-Rot Digest

[[Sales Index]] · vertical `SAL` · reinforces `SAL-05`

**Source:** Slack-to-CRM Logger / deal-alert pattern

**Summary:** A scheduled digest flags every deal past its activity threshold, grouped by owner.

## Node design

1. Schedule Trigger (daily)
2. CRM query — deals with no activity > N days
3. Code — group by owner
4. Slack — digest per owner

