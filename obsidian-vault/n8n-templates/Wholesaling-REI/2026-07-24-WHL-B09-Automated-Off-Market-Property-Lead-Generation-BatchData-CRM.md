---
id: WHL-B09
title: "Automated Off-Market Property Lead Generation (BatchData + CRM)"
vertical: Wholesaling/REI
new_candidate: true
date_added: 2026-07-24
tags: [n8n-brainstorm, vertical/whl, new-candidate, coverage-gap-correction]
---

# Automated Off-Market Property Lead Generation (BatchData + CRM)

[[Wholesaling REI Index]] · vertical `WHL`

**Source:** [Automated property lead generation with BatchData and CRM integration](https://n8n.io/workflows/3665-automated-property-lead-generation-with-batchdata-and-crm-integration/)

**Summary:** No card yet — proposed WHL-09. **Corrects a standing coverage-gap note:** the
2026-07-20 scrape log said the n8n.io gallery has no real-estate-specific templates and
told the daily agent to stop expecting direct hits here. That was wrong — this is a real,
purpose-built real-estate template (property/owner data, equity filtering, off-market deal
alerts), not a pattern match. Given the overlap with `WHL-B01`'s skip-trace data needs,
consider folding BatchData in as an alternate/additional data source rather than shipping
a standalone card.

## Node design

1. Schedule Trigger
2. HTTP Request — BatchData API property search on saved criteria
3. Code — diff against the previous scan to isolate new/changed listings
4. Filter — high-equity, absentee-owner, distressed signals
5. HTTP Request — pull full owner + property detail for qualified hits
6. Gmail — formatted alert (property details, equity %, Google Maps link)
7. Slack/Teams — team notification
