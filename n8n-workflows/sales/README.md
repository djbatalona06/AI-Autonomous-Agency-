---
title: Sales — n8n Node Designs
tags: [n8n, vertical/sales, automation-agency]
aliases: [Sales Workflows]
parent: "[[../_index|n8n Workflow Brainstorm]]"
updated: 2026-07-18
---

# Sales

5 node designs seeded from n8n.io/workflows (sales category, 1,555+ templates) and the CRM/Lead Generation/Lead Nurturing sub-categories. Cross-reference: `templates/template-1-lead-capture` in the agency's private repo covers the simplest of these already.

## 1. Company Research Auto-Briefer
- **Trigger:** Calendar event created (Google Calendar) or CRM stage-change webhook
- **Node chain:** Calendar/Webhook Trigger → HTTP Request (news/company search API) → OpenAI (summarize into a 5-bullet call brief) → Slack DM to rep → CRM note append
- **Fit:** Rung 1 template install, $750–$1,000. Simple, 2 integrations, no branching.
- **Inspired by:** [Scrape recent news about a company before a call](https://n8n.io/workflows/2110-scrape-recent-news-about-a-company-before-a-call/)

## 2. Lead Enrichment & Auto-Router
- **Trigger:** Webhook (web form / ad landing page)
- **Node chain:** Webhook Trigger → HTTP Request (Clearbit/Apollo enrichment) → OpenAI (lead score 1–10) → Switch (route by score: hot/warm/cold) → CRM create (HubSpot/Pipedrive) → Slack alert on hot
- **Fit:** Rung 2 Medium, $2,000–$3,500. Branching + AI scoring + 3 integrations.
- **Inspired by:** [Generate leads with Google Maps](https://n8n.io/workflows/2605-generate-leads-with-google-maps/), [OpenAI GPT-3 company enrichment](https://n8n.io/workflows/1862-openai-gpt-3-company-enrichment-from-website-content/)

## 3. Cold Outreach Personalizer
- **Trigger:** Schedule Trigger (reads a prospect list) or Google Sheets row added
- **Node chain:** Schedule/Sheets Trigger → HTTP Request (LinkedIn/enrichment data) → OpenAI/Claude (draft personalized opener) → Gmail draft (human-in-loop send) → Sheets log
- **Fit:** Rung 1–2 boundary, $1,250–$2,000 depending on whether send is automatic or drafted-for-review.
- **Inspired by:** [Generate personalized sales emails with LinkedIn data & Claude 3.7](https://n8n.io/workflows/5691-generate-personalized-sales-emails-with-linkedin-data-and-claude-37-via-openrouter/)

## 4. No-Reply Follow-Up Sequencer
- **Trigger:** Schedule Trigger (daily sweep of an email log)
- **Node chain:** Schedule Trigger → Google Sheets (read send log) → IF (no reply after N days) → Gmail send follow-up → Update Sheets status → Slack notify rep when thread goes cold (no response after final touch)
- **Fit:** Rung 1 template install, $750–$1,000.
- **Inspired by:** [Gmail campaign sender: bulk-send + auto follow-up if no reply](https://n8n.io/workflows/2137-gmail-campaign-sender-bulk-send-emails-and-follow-up-automatically-if-no-reply/)

## 5. Quote-to-Close Nudge
- **Trigger:** Webhook (quote/proposal sent event from CRM or PandaDoc/DocuSign)
- **Node chain:** Webhook Trigger → Wait (day 1) → HTTP Request (check quote status) → IF not accepted → Gmail reminder → Loop (day 7, day 14) → Slack escalation to rep on day 14 if still unpaid/unsigned
- **Fit:** Rung 2 Simple, $1,500–$2,000. Linear with wait/loop logic.
- **Inspired by:** [Send scheduled quote follow-up emails with Gmail and Google Sheets](https://n8n.io/workflows/16975-send-scheduled-quote-follow-up-emails-with-gmail-and-google-sheets/)

## Pipeline Log
<!-- Daily cron appends new candidates below this line. Do not remove. -->
