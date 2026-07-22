# Scrape Log — 2026-07-22

Source: https://n8n.io/workflows/ (n8n.io official template gallery — 10,802 templates live at
time of scrape) + homepage rails + category crawl (`sales`, `marketing`, `other`,
`document-ops`) + external roundups (n8nlab.io, Intuz, BrowserAct, Goodspeed).

**Note on today's run:** the scheduled GitHub Action (`n8n-workflow-scout.yml`, fires
~07:00 UTC / 12:00 AM PT) ran at 03:32 UTC and failed — the `ANTHROPIC_API_KEY` secret is
configured but the account's Anthropic credit balance is too low (`"Your credit balance is
too low to access the Anthropic API"`), so the automated pipeline never reached the scrape
step. This has now failed 3 days running (07-20, 07-21, 07-22). Today's brief below was
produced manually via this Claude Code session instead, so the daily cadence didn't break —
but the GitHub Action needs credits added before it can resume unattended. Flagged to DJ.

## Raw pulls (Trending / Featured / Recently Added / Category crawl)

| Title | Nodes (partial) | Link | Routed to |
|---|---|---|---|
| Enrich LinkedIn profiles in Google Sheets with Apify | Google Sheets, HTTP Request, No Op | [17086](https://n8n.io/workflows/17086-enrich-linkedin-profiles-in-google-sheets-with-apify/) | SAL-B07 |
| Generate personalized sales emails with LinkedIn data & Claude 3.7 via OpenRouter | Google Sheets, HTTP Request, If | [5691](https://n8n.io/workflows/5691-generate-personalized-sales-emails-with-linkedin-data-and-claude-37-via-openrouter/) | SAL-B07 (pattern co-source) |
| Restyle seasonal Shopify product images with dreem.ai and Slack | If, Loop Over Items, Slack | [17273](https://n8n.io/workflows/17273-restyle-seasonal-shopify-product-images-with-dreemai-and-slack/) | ECM-B07 |
| Generate multi-angle on-model Shopify product photos with Dreem.ai | If, Loop Over Items, Slack | [n8n.io/workflows recently-added, 2026-07-22 listing] | ECM-B07 (pattern co-source) |
| Deduplicate and archive Notion database rows daily with an audit log | HTTP Request, Switch, Notion | [16801](https://n8n.io/workflows/16801-deduplicate-and-archive-notion-database-rows-daily-with-an-audit-log/) | PRD-B07 |
| Classify documents and extract invoice data with LDXhub AnalyzeDoc and Google Sheets | Google Sheets, No Op, Switch | [17039](https://n8n.io/workflows/17039-classify-documents-and-extract-invoice-data-with-ldxhub-analyzedoc-and-google-sheets/) | SMB-B07 |
| Extract and validate invoice data from Google Drive using OCR.Space, Gemini, and Google Sheets | Google Sheets, HTTP Request, If | [17077](https://n8n.io/workflows/17077-extract-and-validate-invoice-data-from-google-drive-using-ocrspace-gemini-and-google-sheets/) | SMB-B07 (pattern co-source) |
| Route insurance quote leads with OpenAI, Airtable, Sheets, Teams, Slack and Twilio | Airtable, Google Sheets, HTTP Request | [17075](https://n8n.io/workflows/17075-route-insurance-quote-leads-with-openai-airtable-sheets-teams-slack-and-twilio/) | (logged for reference — pattern already covered by SAL prior entries) |
| Qualify Facebook lead ads and send follow-ups with Gemini, Gmail and Sheets | Webhook, Edit Fields, Google Sheets | [17258](https://n8n.io/workflows/17258-qualify-facebook-lead-ads-and-send-follow-ups-with-gemini-gmail-and-sheets/) | (logged — close match to existing WHL-02/SMB-01 shape, not new) |

**External roundup pulls (community/blog, cross-referenced against the gallery for real
n8n.io templates, not just article claims):**

| Finding | Source | Routed to |
|---|---|---|
| "Client Testimonial & Review Generation" (post-closing, DocuSign + transaction system + Google/Zillow) | [n8nlab.io — Top n8n Workflows for The Modern Real Estate Agency](https://n8nlab.io/blog/n8n-workflows-real-estate-agency) | WHL-B07 (pattern match — no direct n8n.io template exists for this vertical, confirmed again this run) |
| Real-time low-stock alerts to suppliers (not just internal) | [n8nlab.io — 10 Best n8n Workflow Automation Strategies for Shopify](https://n8nlab.io/blog/n8n-workflow-automation-shopify) | (logged — ECM-B03/ECM-04 already cover the internal-alert version; supplier-facing variant is a future candidate, not promoted today) |

## Coverage gaps found this run

- **Ecommerce (ECM):** confirmed again — n8n.io has **no dedicated e-commerce category**
  (only `ai`, `sales`, `it-ops`, `marketing`, `document-ops`, `other`, `support`). Shopify
  hits keep surfacing inside `other/miscellaneous` and homepage "Recently added" instead.
  `categories/e-commerce/` returns a 404 — stop trying that URL on future runs, crawl
  `other/` and homepage recently-added instead.
- **Wholesaling/REI (WHL):** reconfirmed — no real-estate-specific n8n.io template exists
  at all. Continues to be an agency-original build vertical; today's WHL-B07 is a pattern
  match off a real-estate *blog* roundup (n8nlab.io), not an n8n.io template link.
- **Sales (SAL):** `categories/sales/` crawl worked cleanly this run (CRM, Lead Generation,
  Lead Nurturing subsections) — no gap this time.

## Follow-ups queued for the daily agent

1. **Billing blocker:** `n8n-workflow-scout.yml`'s Anthropic account needs credits before
   the automated pipeline can run unattended again — this is now a 3-day-running failure,
   not a one-off. Escalated in today's summary to DJ.
2. Keep skipping `n8n.io/workflows/categories/e-commerce/` (404) — crawl `other/` and the
   homepage "Recently added" rail for Shopify/WooCommerce hits instead.
3. Cross-check each new pull against the 25 existing catalog IDs in `src/data/verticals.ts`
   plus the growing B01–B07 brainstorm backlog before adding as "new" — only log genuinely
   new node patterns or newly trending integrations (done for this run's 5 additions).
