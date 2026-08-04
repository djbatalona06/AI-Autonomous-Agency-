---
id: PRD-B13
title: "Realtime Meeting Co-Pilot"
vertical: Productivity
new_candidate: true
date_added: 2026-08-04
tags: [n8n-brainstorm, vertical/prd]
---

# Realtime Meeting Co-Pilot

[[Productivity Index]] · vertical `PRD`

**Source:** [AI agent for realtime insights on meetings](https://n8n.io/workflows/2651-ai-agent-for-realtime-insights-on-meetings/)

**Summary:** Runs during the live call as an in-meeting copilot — different
infrastructure (streaming vs. batch) and a different buyer than `PRD-B02`'s post-meeting
transcript processing. Complex tier ($3,500–$5,000).

## Node design

1. Webhook — live meeting transcript stream (Zoom/Meet bot integration)
2. AI Agent (streaming) — extract objections, questions, commitments as they're said
3. Filter — surface only actionable/flagged moments
4. Slack/desktop notify — push live prompts to the rep/host mid-call
5. Google Sheets — log flagged moments post-call for follow-up
