---
id: PRD-B12
title: "Internal Knowledge-Base RAG Search Assistant (Drive + Gemini)"
vertical: Productivity
new_candidate: true
date_added: 2026-08-02
tags: [n8n-brainstorm, vertical/prd]
---

# Internal Knowledge-Base RAG Search Assistant (Drive + Gemini)

[[Productivity Index]] · vertical `PRD`

**Source:** [RAG chatbot for company documents using Google Drive and Gemini](https://n8n.io/workflows/2753-rag-chatbot-for-company-documents-using-google-drive-and-gemini/)

**Summary:** `PRD-B08` is Notion-specific (tasks/content via MCP); this is a general
cross-doc-type (PDFs, Docs, Sheets in Drive) knowledge assistant for "where's our X
policy/SOP" questions — fits any client with a scattered internal wiki. Medium tier
($2,000–$3,500).

## Node design

1. Google Drive Trigger — new/updated doc in watched folder
2. Text Splitter + Embeddings (Gemini)
3. Vector Store (Supabase pgvector) — upsert
4. Chat Trigger (Slack/webhook question) — separate branch
5. Vector Store — retrieval
6. AI Agent — answer grounded in retrieved chunks, cites source doc
7. Slack — reply in thread
