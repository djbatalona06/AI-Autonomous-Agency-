---
id: SAL-B07
title: "AI LinkedIn Enrichment → Personalized Outreach Generator"
vertical: Sales
new_candidate: true
date_added: 2026-07-22
tags: [n8n-brainstorm, vertical/sal, new-candidate]
---

# AI LinkedIn Enrichment → Personalized Outreach Generator

[[Sales Index]] · vertical `SAL`

**Source:** [Enrich LinkedIn profiles in Google Sheets with Apify](https://n8n.io/workflows/17086-enrich-linkedin-profiles-in-google-sheets-with-apify/) + [Generate personalized sales emails with LinkedIn data & Claude 3.7 via OpenRouter](https://n8n.io/workflows/5691-generate-personalized-sales-emails-with-linkedin-data-and-claude-37-via-openrouter/)

**Summary:** No card yet — proposed SAL-06/07. Pulls fresh LinkedIn profile data per lead row
and drafts a genuinely personalized opener instead of a templated one — differentiates from
SAL-B01/B02's enrichment+router by generating the actual outreach copy from live profile
signal, not just scoring/routing.

## Node design

1. Schedule Trigger (or manual/CRM webhook per lead batch)
2. Google Sheets — read lead list (name, company, LinkedIn URL)
3. Apify — scrape LinkedIn profile (headline, recent posts, role tenure)
4. AI Agent (Claude) — draft personalized opener referencing profile signal
5. Google Sheets — write draft back to row
6. Gmail — create draft (not auto-send — rep reviews first)
7. Slack — ping rep that a fresh batch is ready for review
