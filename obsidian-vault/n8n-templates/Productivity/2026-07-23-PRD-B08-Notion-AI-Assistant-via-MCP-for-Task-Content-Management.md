---
id: PRD-B08
title: "Notion AI Assistant via MCP for Task & Content Management"
vertical: Productivity
new_candidate: true
date_added: 2026-07-23
tags: [n8n-brainstorm, vertical/prd, new-candidate]
---

# Notion AI Assistant via MCP for Task & Content Management

[[Productivity Index]] · vertical `PRD`

**Source:** [Create a Notion AI assistant with Google Gemini for managing tasks & content](https://n8n.io/workflows/4857-create-a-notion-ai-assistant-with-google-gemini-for-managing-tasks-and-content/)

**Preview:** ![Notion AI assistant workflow canvas](https://n8niostorageaccount.blob.core.windows.net/n8nio-strapi-blobs-prod/assets/Screenshot_2025_06_10_at_15_11_56_44128748dc.png)
*(screenshot published by the template author on the n8n.io listing)*

**Summary:** No card yet — proposed PRD-07. PRD-B01–B06 all write *into* a tool on a
trigger; this is the first two-way, conversational surface — turns the client's own Notion
workspace into an agent instead of a target. Setup is a single MCP connection, cheap
retainer-tier work once built once.

## Node design

1. Chat Trigger (chat UI, or Telegram/Slack front-end)
2. AI Agent (Gemini/Claude) — parses the request
3. Notion MCP Server (community node) — create/retrieve/update pages & databases
4. Switch — route by action type (create/search/update)
5. Chat response — confirm the action back to the user
