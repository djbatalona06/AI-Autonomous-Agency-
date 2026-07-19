---
id: PRD-B02
title: "Meeting Transcript → Action Items → Tasks"
vertical: Productivity
related_card: PRD-02
new_candidate: false
date_added: 2026-07-19
tags: [n8n-brainstorm, vertical/prd]
---

# Meeting Transcript → Action Items → Tasks

[[Productivity Index]] · vertical `PRD` · reinforces `PRD-02`

**Source:** AI meeting summary & action item tracker with Notion, Slack, and Gmail — https://n8n.io/workflows/10286-ai-meeting-summary-and-action-item-tracker-with-notion-slack-and-gmail/

**Summary:** Converts a call's action items into real tasks the moment the call ends.

## Node design

1. Webhook — Zoom/Otter/Fireflies transcript
2. OpenAI — extract summary, decisions, action items w/ owners + due dates
3. Split
4. Notion/ClickUp/Linear — create task
5. Google Calendar — due-date event
6. Slack — recap

