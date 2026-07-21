---
id: ECM-B06
title: "AI Customer Support Chatbot with Order Memory"
vertical: E-commerce
new_candidate: true
date_added: 2026-07-21
tags: [n8n-brainstorm, vertical/ecm, new-candidate]
---

# AI Customer Support Chatbot with Order Memory

[[E-commerce Index]] · vertical `ECM`

**Source:** [AI-Powered E-commerce Customer Support Chatbot with GPT-4 and Supabase](https://n8n.io/workflows/7256-ai-powered-e-commerce-customer-support-chatbot-with-gpt-4-and-supabase/)

**Summary:** No card yet — proposed ECM-07 (ECM-06 already claimed by price monitor). First live customer-facing AI surface in the ECM vertical.

## Node design

1. Chat Widget/Webhook Trigger
2. Supabase — retrieve order + customer history
3. OpenAI/GPT-4 Agent — answer with conversation + order memory
4. IF — needs human (refund/complaint)
5. Slack/Zendesk — escalate, else respond in chat
