---
title: Small Business — n8n Node Designs
tags: [n8n, vertical/small-business, automation-agency]
aliases: [Small Business Workflows]
parent: "[[../_index|n8n Workflow Brainstorm]]"
updated: 2026-07-18
---

# Small Business

5 general SMB-ops node designs seeded from n8n.io/workflows, the Invoice Processing category (248+ templates), and third-party SMB template roundups. Aligns with `templates/template-3-invoice-followup` and `templates/template-4-onboarding` in the private repo.

## 1. Invoice Lifecycle & Escalating Reminders
- **Trigger:** Webhook (order/invoice data from QuickBooks/FreshBooks/Stripe)
- **Node chain:** Webhook Trigger → Split Out (line items) → Code (calc subtotal/tax/total) → Aggregate → Google Sheets log → Gmail (invoice + payment link) → **Reminder flow:** Schedule Trigger (daily) → Split In Batches (unpaid invoices) → Switch (5 escalation levels: friendly → second notice → urgent → final → collections) → Slack (collections handoff)
- **Fit:** Rung 2 Medium, $2,000–$3,000. Branching + 5-level escalation logic. Extends Template 3.
- **Inspired by:** [Invoice management system with Gmail reminders, Google Sheets, and Slack escalations](https://n8n.io/workflows/12113-invoice-management-system-with-gmail-reminders-google-sheets-and-slack-escalations/)

## 2. New Hire Onboarding Orchestration
- **Trigger:** Google Sheets Trigger (new row) or BambooHR webhook
- **Node chain:** Sheets/BambooHR Trigger → Gmail (welcome email) → Notion (accounts checklist create) → Google Calendar (Day-1 meeting) → Slack DM (manager notification)
- **Fit:** Rung 1 template install, $1,000–$1,250. This is Template 4 — reuse directly for 5–50 employee SMBs.
- **Source:** existing `templates/template-4-onboarding`

## 3. Customer Feedback Collector & Router
- **Trigger:** Webhook (survey/form submission)
- **Node chain:** Webhook Trigger → OpenAI (sentiment analysis) → Google Sheets log → IF negative → Slack alert to owner (fast recovery window) → IF positive → Email (request public review, Google/Yelp/Trustpilot link)
- **Fit:** Rung 1 template install, $750–$1,000. Simple, 2 integrations, one branch.
- **Inspired by:** SMB template roundup — [Top 30 n8n Workflow Templates](https://www.intuz.com/blog/best-n8n-workflow-templates/)

## 4. Appointment Reminder & No-Show Reducer
- **Trigger:** Google Calendar Trigger (new/upcoming appointment)
- **Node chain:** Calendar Trigger → Wait (until 24h prior) → Twilio/WhatsApp SMS reminder → Wait (until 2h prior) → second reminder → Google Sheets log (no-show tracking)
- **Fit:** Rung 1 template install, $750–$1,000. Ideal for service businesses (salons, clinics, contractors).
- **Inspired by:** [15 Best n8n Templates](https://www.dumplingai.com/blog/15-best-n8n-templates-ready-to-use-workflows-to-automate-anything) — "Appointment Reminders"

## 5. Support Ticket Router & SLA Watchdog
- **Trigger:** Webhook (helpdesk new ticket — Zendesk/Freshdesk/generic form)
- **Node chain:** Webhook Trigger → OpenAI classify (urgent / billing / tech / general) → Switch (route to correct Slack channel/inbox) → Schedule Trigger (SLA check, hourly) → IF unanswered > threshold → Escalate (Slack DM to owner)
- **Fit:** Rung 2 Simple, $1,500–$2,000. Branching + SLA timer logic.
- **Inspired by:** [15 Best n8n Templates](https://www.dumplingai.com/blog/15-best-n8n-templates-ready-to-use-workflows-to-automate-anything) — "Support Ticket Routing"

## Pipeline Log
<!-- Daily cron appends new candidates below this line. Do not remove. -->
