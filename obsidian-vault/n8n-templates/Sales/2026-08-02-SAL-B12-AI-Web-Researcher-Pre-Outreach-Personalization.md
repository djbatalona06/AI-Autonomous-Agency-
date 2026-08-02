---
id: SAL-B12
title: "AI Web Researcher for Pre-Outreach Personalization"
vertical: Sales
new_candidate: true
date_added: 2026-08-02
tags: [n8n-brainstorm, vertical/sal]
---

# AI Web Researcher for Pre-Outreach Personalization

[[Sales Index]] · vertical `SAL`

**Source:** [AI web researcher for sales](https://n8n.io/workflows/2324-ai-web-researcher-for-sales/)

**Summary:** Runs before the first cold touch, on open-web research (company site, recent
news, socials) — not a CRM/LinkedIn lookup that only fires after a meeting is already
booked (`SAL-03`) or off a single LinkedIn scrape (`SAL-B07`). Medium tier ($2,000–$3,500).

## Node design

1. Manual/Webhook Trigger — prospect name + company
2. HTTP Request/Web Search tool — company site, recent news, LinkedIn
3. AI Agent — synthesize research brief (news, pain points, tech-stack signals)
4. Google Sheets — write brief
5. Gmail — draft personalized opener from the brief
6. Slack — rep review ping
