---
id: SMB-B09
title: "Contractor/Vendor License Verification for Lead Lists"
vertical: Small Business
new_candidate: true
date_added: 2026-07-24
tags: [n8n-brainstorm, vertical/smb, new-candidate]
---

# Contractor/Vendor License Verification for Lead Lists

[[Small Business Index]] · vertical `SMB`

**Source:** [Verify US contractor licenses in lead lists with Apify](https://n8n.io/workflows/17355-verify-us-contractor-licenses-in-lead-lists-with-apify/)

**Summary:** No card yet — proposed SMB-09. Nothing in SMB-B01–B08 vets a third party
before a small business hands them work or a referral. Direct cross-sell to `WHL` clients
too — wholesalers/investors vetting rehab contractors before a deal closes.

## Node design

1. Manual/Webhook Trigger — lead list (company, state, optional license#)
2. Switch — map state → correct Apify license-lookup actor (flag unsupported states)
3. Apify — run the state licensing-portal lookup
4. Code — match returned record via exact license# or normalized name
5. Set — verdict (verified / expired / review / not-found / unverifiable)
6. Filter — split verified-active from needs-review
