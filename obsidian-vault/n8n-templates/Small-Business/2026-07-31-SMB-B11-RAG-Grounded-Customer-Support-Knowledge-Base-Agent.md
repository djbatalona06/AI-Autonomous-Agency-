---
id: SMB-B11
title: "RAG-Grounded Customer Support Knowledge-Base Agent"
vertical: Small-Business
related_card: SMB-06
new_candidate: false
date_added: 2026-07-31
tags: [n8n-brainstorm, vertical/smb]
---

# RAG-Grounded Customer Support Knowledge-Base Agent

[[Small Business Index]] · vertical `SMB`

**Source:** [Smart Customer Support System with GPT-4o, Gmail, Slack & Drive Knowledge Base](https://n8n.io/workflows/4543-smart-customer-support-system-with-gpt-4o-gmail-slack-and-drive-knowledge-base/)

**Summary:** Reinforces `SMB-06` (WhatsApp AI Customer Support Autoresponder) with more
depth on the reasoning step — instead of a simple intent-classify-and-template reply, this
syncs the business's actual support docs from Google Drive into a knowledge base and
grounds every reply in it, escalating only what the docs can't answer.

## Node design

1. Gmail Trigger — poll inbox every minute
2. Google Drive — sync support docs into a vector store (Pinecone/Supabase Vector)
3. AI Agent (GPT-4o, RAG) — classify email (billing/support/spam/urgent) + draft grounded reply
4. Switch — route by classification
5. Gmail — send auto-reply (support/billing) or save as draft for review
6. Slack — escalate "urgent" and low-confidence answers to a human
