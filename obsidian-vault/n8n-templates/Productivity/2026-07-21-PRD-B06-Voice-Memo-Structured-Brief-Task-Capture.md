---
id: PRD-B06
title: "Voice Memo → Structured Brief & Task Capture"
vertical: Productivity
new_candidate: true
date_added: 2026-07-21
tags: [n8n-brainstorm, vertical/prd, new-candidate]
---

# Voice Memo → Structured Brief & Task Capture

[[Productivity Index]] · vertical `PRD`

**Source:** Voice-memo capture → transcribe → structure pattern (2026 founder-productivity writeups) + n8n Speech-to-Text node

**Summary:** No card yet — proposed PRD-06. Captures ideas at the point of speech instead of after the fact.

## Node design

1. Telegram/WhatsApp voice-note Trigger (or Google Drive new-audio-file trigger)
2. Speech-to-Text — Whisper
3. OpenAI — structure into brief (goal, context, next steps, owner)
4. Notion/Google Docs — create brief
5. ClickUp/Todoist — create task per action item
6. Slack/Telegram — confirmation
