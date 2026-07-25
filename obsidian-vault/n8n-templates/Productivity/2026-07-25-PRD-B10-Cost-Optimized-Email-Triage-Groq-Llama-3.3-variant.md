---
id: PRD-B10
title: "Cost-Optimized Email Triage (Groq/Llama 3.3 variant)"
vertical: Productivity
related_card: PRD-01
new_candidate: false
date_added: 2026-07-25
tags: [n8n-brainstorm, vertical/prd, hardening-idea]
---

# Cost-Optimized Email Triage (Groq/Llama 3.3 variant)

[[Productivity Index]] · vertical `PRD`

**Source:** [Label Gmail emails by priority with Groq Llama 3.3](https://n8n.io/workflows/17365-label-gmail-emails-by-priority-with-groq-llama-33/)

**Summary:** Not a new build — a cheaper model swap for `PRD-01`'s classification step.
Groq's free tier (no credit card) vs. metered OpenAI API for the triage-only step. Worth
keeping as an alternate-stack option for thin-margin Rung 1 clients where API cost eats
into the $750–$1,000 price band, or as a fallback when a client is rate-limited on OpenAI.

## Node design

1. Gmail Trigger — poll every minute
2. HTTP Request — Groq OpenAI-compatible chat completions (Llama 3.3 70B)
3. Code — parse JSON category, fallback to "Other" on parse failure
4. Switch — Action Required / Promotions / Other
5. Gmail — apply matching label
