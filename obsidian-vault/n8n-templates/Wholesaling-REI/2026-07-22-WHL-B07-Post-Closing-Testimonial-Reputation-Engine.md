---
id: WHL-B07
title: "Post-Closing Testimonial & Reputation Engine"
vertical: Wholesaling/REI
new_candidate: true
date_added: 2026-07-22
tags: [n8n-brainstorm, vertical/whl, new-candidate]
---

# Post-Closing Testimonial & Reputation Engine

[[Wholesaling REI Index]] · vertical `WHL`

**Source:** [n8nlab.io — Top n8n Workflows for The Modern Real Estate Agency](https://n8nlab.io/blog/n8n-workflows-real-estate-agency) ("Client Testimonial & Review Generation" row) — **pattern match, not a direct n8n.io template.** Reconfirmed this run: n8n.io still has no dedicated real-estate category, so WHL stays an agency-original build vertical.

**Summary:** No card yet — proposed WHL-06/07. None of B01–B06 cover the post-closing
reputation loop — this closes that gap and doubles as a warm-lead source (satisfied
sellers/buyers referred back into the pipeline).

## Node design

1. CRM/Dotloop — trigger on deal status → "Closed"
2. Wait (3 days, so the ask doesn't land day-of)
3. AI Agent — draft a personalized review request referencing the property + rep by name
4. Twilio SMS + Gmail — send the request
5. If — review link clicked?
6. Google Business Profile / Zillow — monitor for the posted review
7. CRM — log outcome; route negative sentiment to a private escalation instead of public post
