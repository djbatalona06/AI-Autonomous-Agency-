---
id: ECM-B09
title: "Brand Impersonation & Deepfake Threat Hunter"
vertical: Ecommerce
new_candidate: true
date_added: 2026-07-24
tags: [n8n-brainstorm, vertical/ecm, new-candidate]
---

# Brand Impersonation & Deepfake Threat Hunter

[[Ecommerce Index]] · vertical `ECM`

**Source:** [Hunt brand impersonation and deepfake threats with Claude, Google Sheets and SendGrid](https://n8n.io/workflows/17360-hunt-brand-impersonation-and-deepfake-threats-with-claude-google-sheets-and-sendgrid/)

**Summary:** No card yet — proposed ECM-09. First brand-protection/security surface in
this vertical — every existing card automates the store's own lifecycle; this watches the
outside world for counterfeiters and deepfake ad scams running under the client's brand.

## Node design

1. Schedule Trigger — every 4 hrs
2. Set — brand context (domains, handles, keywords, logo description)
3. HTTP Request — brand-monitoring/social-listening API
4. AI Agent (Claude) — classify impersonation risk, assign type + rationale
5. Code — composite threat score (AI score + reach + account-age + image-similarity)
6. Google Sheets — append `ImpersonationScans` tracker
7. IF — critical tier or AI-voice-scam
8. SendGrid — alert email to the brand-protection inbox
