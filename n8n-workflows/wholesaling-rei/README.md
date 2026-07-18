---
title: "Wholesaling / REI — n8n Node Designs"
tags: [n8n, vertical/wholesaling-rei, automation-agency, high-margin]
aliases: [Wholesaling Workflows, Real Estate Investor Workflows]
parent: "[[../_index|n8n Workflow Brainstorm]]"
updated: 2026-07-18
---

# Wholesaling / REI ⭐

Highest-margin vertical — primary warm-network play for theWRENCH, Vertex Supply, and existing wholesale buyer/seller relationships (see `templates/template-6-ai-lead-followup` in the private repo, $1,250–$1,750 installed). 5 node designs below extend that template with real n8n.io candidates.

## 1. Property Lead Skip-Trace & Scorer
- **Trigger:** Schedule Trigger or Webhook (batch pull)
- **Node chain:** Trigger → HTTP Request (BatchData Property Search API — location, value range, equity %, absentee ownership) → Code node (lead scoring on equity %, years owned, tax status) → HTTP Request (skip trace owner contact) → Format node → Excel/Sheets export + CRM push (HubSpot/Salesforce) → Gmail summary email
- **Fit:** Rung 2 Medium, $2,500–$3,500. 3+ integrations, scoring logic.
- **Inspired by:** [Real estate lead generation with BatchData skip tracing & CRM integration](https://n8n.io/workflows/3666-real-estate-lead-generation-with-batchdata-skip-tracing-and-crm-integration/)

## 2. Hot / Warm / Cold AI Qualifier + Voice Call
- **Trigger:** Webhook (inbound lead — website form or WhatsApp)
- **Node chain:** Webhook Trigger → OpenAI/GPT-4o (extract budget/timeline/property type from free text, score 1–10) → Switch (Hot 8–10 / Warm 5–7 / Cold 1–4) → **Hot:** VAPI outbound AI voice call → wait for call → pull transcript → GPT-4o generate personalized proposal → HTML format → Gmail send; **Warm:** automated nurture email; **Cold:** log only → Google Sheets log (all tiers)
- **Fit:** Rung 2 Complex, $3,500–$5,000. Multi-path orchestration, AI, voice, 5+ integrations — DJ's highest-ticket REI build.
- **Inspired by:** [Real Estate AI Lead Qualifier + Voice Agent + Proposal Generator](https://community.n8n.io/t/real-estate-ai-lead-qualifier-voice-agent-proposal-generator-gpt-4o-vapi-gmail-sheets/300394)

## 3. Multi-Channel Follow-Up Cadence (Template 6 extension)
- **Trigger:** Webhook (new lead — Podio/REISift/InvestorLift/PropStream export/direct webhook)
- **Node chain:** Webhook Trigger → OpenAI (AI-personalized opener from property address + source) → Day 1: Twilio SMS + SendGrid email → Wait → Day 3: email → Day 7: Slybroadcast voicemail drop + SMS → Day 14: email → CRM status update to "Hot" on any response → Google Sheets activity log
- **Fit:** Rung 2 Complex, $1,250–$1,750 (this IS Template 6 — already built; log as the baseline to compare new candidates against).
- **Source:** existing `templates/template-6-ai-lead-followup`

## 4. Open House CRM Sync + 7-Day Auto Follow-Up
- **Trigger:** Webhook (sign-in app, e.g. SignSnap Home)
- **Node chain:** Webhook Trigger → Score lead → HubSpot/Follow Up Boss/Monday.com sync → 7-day SMS + email nurture sequence (Wait/Loop nodes) → Sheets log
- **Fit:** Rung 2 Simple–Medium, $2,000–$3,000. Good fit for brokers in the wholesale network, not just wholesalers.
- **Inspired by:** [6 n8n Real Estate Templates: One for Every Pillar](https://nextautomation.us/resources/free-templates/6-real-estate-n8n-templates-20260209)

## 5. Zillow/MLS Investment Deal Scanner
- **Trigger:** Apify Actor Trigger (scheduled scrape)
- **Node chain:** Apify Trigger → Scrape live Zillow/MLS listings → Code node (clean/normalize) → OpenAI (AI investment scoring 1–100 on equity/ARV/cash-flow heuristics) → Google Sheets store → Slack alert when score > 80
- **Fit:** Rung 2 Complex, $3,000–$4,500. AI scoring + scraping infra — pairs well with the skip-trace design (#1) as an upsell pair.
- **Inspired by:** [6 n8n Real Estate Templates: One for Every Pillar](https://nextautomation.us/resources/free-templates/6-real-estate-n8n-templates-20260209)

## Pipeline Log
<!-- Daily cron appends new candidates below this line. Do not remove. -->
