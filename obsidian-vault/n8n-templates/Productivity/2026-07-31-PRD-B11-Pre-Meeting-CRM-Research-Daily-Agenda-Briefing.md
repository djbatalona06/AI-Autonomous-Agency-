---
id: PRD-B11
title: "Pre-Meeting CRM Research + Daily Agenda Briefing"
vertical: Productivity
related_card: PRD-02
new_candidate: false
date_added: 2026-07-31
tags: [n8n-brainstorm, vertical/prd]
---

# Pre-Meeting CRM Research + Daily Agenda Briefing

[[Productivity Index]] · vertical `PRD`

**Source:** [AI-powered meeting research & daily agenda with Google Calendar, Attio CRM, and Slack](https://n8n.io/workflows/7968-ai-powered-meeting-research-and-daily-agenda-with-google-calendar-attio-crm-and-slack/)

**Summary:** Complements `PRD-02` (meeting transcript → action items, which runs *after* a
meeting) with the mirror-image *before* step — pulling today's calendar, researching each
attendee against real CRM history, and posting a morning brief. Different data source
(live CRM, not a transcript) and different timing from anything currently in `PRD-0X`.

## Node design

1. Schedule Trigger — early morning, before the workday starts
2. Google Calendar — get today's meetings
3. Loop Over Items — one pass per meeting
4. HTTP Request — Attio CRM lookup (attendee + deal/account history)
5. AI Agent — synthesize attendee context into talking points
6. Aggregate — combine all meeting briefs into one daily agenda
7. Slack — post the daily agenda + per-meeting brief
