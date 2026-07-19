---
title: Productivity — n8n Node Designs
tags: [n8n, vertical/productivity, automation-agency]
aliases: [Productivity Workflows]
parent: "[[../_index|n8n Workflow Brainstorm]]"
updated: 2026-07-18
---

# Productivity

5 node designs seeded from n8n.io's Personal Productivity category (617+ templates) and Notion integration page. Aligns with `templates/template-2-email-triage` in the private repo.

## 1. Weekly Business + Home Task Planner
- **Trigger:** Schedule Trigger (Sundays 17:00, configurable)
- **Node chain:** Schedule Trigger → Notion (pull tasks, optional — falls back to built-in list) → OpenAI (generate weekly plan with 2×2-hour protected deep-work blocks) → Gmail (single digest email, CC partner optional) → Telegram confirmation ping
- **Fit:** Rung 1 template install, $750–$1,000. Great low-friction lead-magnet for solopreneurs.
- **Inspired by:** [Weekly business & home task planner with Notion, email digests and Telegram](https://n8n.io/workflows/7789-weekly-business-and-home-task-planner-with-notion-email-digests-and-telegram/)

## 2. Notion AI Summary & Auto-Tagger
- **Trigger:** Notion Trigger (new row, polled every minute) or Notion Web Clipper save
- **Node chain:** Notion Trigger → HTTP Request (fetch saved URL content) → OpenAI (generate summary + tags) → Notion (update row with summary/tags columns)
- **Fit:** Rung 1 template install, $750–$1,000. Simple, 2 integrations.
- **Inspired by:** [Notion AI summary & tags](https://n8n.io/workflows/4431-notion-ai-summary-and-tags/)

## 3. Inbox Triage & Draft Assistant
- **Trigger:** Gmail Trigger (schedule poll)
- **Node chain:** Gmail Trigger → OpenAI classify (urgent / follow-up / info request / junk) → Switch (4 paths) → Draft reply (non-junk) → Google Sheets queue (human 1-click send) → Conditional Slack ping for urgent
- **Fit:** Rung 1–2 boundary, $1,000–$1,500. This is Template 2 — reuse directly for solopreneur/agency-owner clients.
- **Source:** existing `templates/template-2-email-triage`

## 4. Meeting-to-Action-Items Pipeline
- **Trigger:** Webhook (Zoom/Otter/Fireflies transcript ready) or Google Calendar Trigger (meeting ends)
- **Node chain:** Webhook/Calendar Trigger → HTTP Request (fetch transcript) → OpenAI (extract action items + owners + due dates) → Notion/Asana (create tasks) → Slack (post summary to team channel)
- **Fit:** Rung 2 Simple, $1,500–$2,000. One AI node, 3 integrations, no branching.
- **Inspired by:** general Notion AI-assistant pattern — [Create a Notion AI assistant with Google Gemini](https://n8n.io/workflows/4857-create-a-notion-ai-assistant-with-google-gemini-for-managing-tasks-and-content/)

## 5. Daily Standup / Status Rollup
- **Trigger:** Schedule Trigger (8:00 AM weekdays)
- **Node chain:** Schedule Trigger → Notion/Sheets (pull yesterday's task changes) + Slack (read channel activity) → Merge → OpenAI (synthesize status digest) → Slack post (team channel) + Gmail (leadership copy)
- **Fit:** Rung 2 Simple, $1,500–$2,000. Good retainer-conversion candidate — small enough to fit inside the 3hr/mo cap for updates.
- **Inspired by:** category pattern across [Top Personal Productivity workflows](https://n8n.io/workflows/categories/personal-productivity/)

## Pipeline Log
<!-- Daily cron appends new candidates below this line. Do not remove. -->
