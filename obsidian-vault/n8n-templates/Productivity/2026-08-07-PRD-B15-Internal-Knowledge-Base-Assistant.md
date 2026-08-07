---
id: PRD-B15
title: "Internal Knowledge Base Assistant (Slack + RAG over Drive)"
vertical: Productivity
new_candidate: true
date_added: 2026-08-07
tags: [n8n-brainstorm, vertical/prd]
---

# Internal Knowledge Base Assistant (Slack + RAG over Drive)

[[Productivity Index]] · vertical `PRD`

**Source:** [Slack AI chatbot for business team with RAG, Claude 3.7 Sonnet and Google Drive](https://n8n.io/workflows/3414-slack-ai-chatbot-for-business-team-with-rag-claude-37-sonnet-and-google-drive/)

**Summary:** No card yet — proposed `PRD-10`. First "ask the company anything" card —
every existing PRD card automates an inbox/meeting/doc/task/receipt event; this indexes
and answers from the team's own knowledge instead.

## Node design

1. Slack Trigger — @mention or DM
2. Vector Store retrieval — indexed Google Drive docs (SOPs, policies, past proposals)
3. AI Agent (Claude) — answer grounded in retrieved docs, cite source doc
4. IF — no confident match
5. Slack — reply with answer + source links, or escalate to a human channel
