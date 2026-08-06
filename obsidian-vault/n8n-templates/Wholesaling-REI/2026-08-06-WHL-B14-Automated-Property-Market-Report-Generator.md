---
id: WHL-B14
title: "Automated Property Market Report Generator"
vertical: Wholesaling / REI
new_candidate: true
date_added: 2026-08-06
tags: [n8n-brainstorm, vertical/whl]
---

# Automated Property Market Report Generator

[[Wholesaling REI Index]] · vertical `WHL`

**Source:** [Automated property market reports with Bright Data & n8n](https://n8n.io/workflows/5220-automated-property-market-reports-with-bright-data-and-n8n/)

**Summary:** First `WHL` card built for content/authority marketing rather than lead
intake or qualification — a recurring seller/investor-facing report that doubles as a
warm-lead nurture touch. Medium tier ($2,000–$3,500).

## Node design

1. Schedule Trigger — weekly, per target market/zip
2. HTTP Request — Bright Data (comps, days-on-market, price trends scrape)
3. AI Agent — synthesize market-trend narrative + investment-angle summary
4. PDF/Doc generation — branded market report
5. Gmail — send to seller leads/investor list
6. Google Sheets — log report + open/click tracking
