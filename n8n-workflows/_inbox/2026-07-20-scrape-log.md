# Scrape Log — 2026-07-20

Source: https://n8n.io/workflows/ (n8n.io official template gallery — 10,759 templates live at time of scrape)

## Raw pulls (Trending / Featured / Recently Added)

| Title | Nodes (partial) | Link | Routed to |
|---|---|---|---|
| Basic automatic Gmail email labelling with OpenAI and Gmail API | Gmail Trigger, Wait, Sticky Note | [17169/2740](https://n8n.io/workflows/2740-basic-automatic-gmail-email-labelling-with-openai-and-gmail-api/) | PRD-01 (inspiration) |
| RAG chatbot for company documents using Google Drive and Gemini | Google Drive, Google Drive Trigger | [2753](https://n8n.io/workflows/2753-rag-chatbot-for-company-documents-using-google-drive-and-gemini/) | SAL-03 (inspiration) |
| Talk to your Google Sheets using ChatGPT-5 | AI Agent, OpenAI Chat Model | [7639](https://n8n.io/workflows/7639-talk-to-your-google-sheets-using-chatgpt-5/) | ECM-05 (inspiration) |
| Pdf to markdown converter with LlamaCloud parser | HTTP Request, If, Google Drive | [11811](https://n8n.io/workflows/11811-pdf-to-markdown-converter-with-llamacloud-parser/) | PRD-05 (inspiration) |
| Draft weekly blog newsletter digests from RSS with OpenAI-compatible APIs | HTTP Request, If, No Op | [17169](https://n8n.io/workflows/17169-draft-weekly-blog-newsletter-digests-from-rss-with-openai-compatible-apis/) | PRD-04 (inspiration) |
| Send and track Slack invoice requests with Gemini, Google Sheets and Gmail | Google Sheets, If, Slack | [17192](https://n8n.io/workflows/17192-send-and-track-slack-invoice-requests-with-gemini-google-sheets-and-gmail/) | SMB-02 (inspiration) |
| Send WhatsApp booking links for Facebook leads with Sheets, Redis, and Cal.com | Google Sheets, If, Redis | [17181](https://n8n.io/workflows/17181-create-instagram-carousels-and-tiktok-slideshows-with-openai-and-postfast/) | SMB-01 (inspiration) |
| Reschedule calendar appointments with Google Sheets and Google Calendar | Google Sheets, If, Edit Fields | [17179](https://n8n.io/workflows/17179-reschedule-calendar-appointments-with-google-sheets-and-google-calendar/) | SMB-05 (inspiration) |
| Monitor crypto news risk with CoinDesk RSS, OpenAI, Gmail, and Google Sheets | Google Sheets, HTTP Request, If | [17174](https://n8n.io/workflows/17174-monitor-crypto-news-risk-with-coindesk-rss-openai-gmail-and-google-sheets/) | WHL-04 (inspiration) |
| Provision new employee accounts to Google Workspace, Slack, Jira, and Salesforce | Merge, Edit Fields, Slack | [12090](https://n8n.io/workflows/12090-provision-new-employee-accounts-to-google-workspace-slack-jira-and-salesforce/) | SMB-03 (pattern reference) |
| AI-Powered SEO Cannibalization Monitor: Databox, GSC & Slack | Merge, Loop Over Items, Slack | [15691](https://n8n.io/workflows/15691-ai-powered-seo-cannibalization-monitor-databox-google-search-console-and-slack/) | (Marketing — outside the 5 verticals, logged for reference only) |
| Intelligent legal document review and compliance automation | HTTP Request, Postgres, Edit Fields | [11861](https://n8n.io/workflows/11861-intelligent-legal-document-review-and-compliance-automation/) | (outside scope — logged for reference only) |

## Coverage gaps found this run
- **Ecommerce (ECM):** no Shopify-specific template surfaced in Trending/Featured/Recently-Added on this pass. `n8n.io/workflows/categories/other/` and `/categories/marketing/` need a direct category crawl next run, not just the homepage rails.
- **Wholesaling/REI (WHL):** gallery has no real-estate-specific templates at all (confirmed via skill notes — this vertical is agency-original custom build, not template-install). Daily agent should stop expecting direct hits here and instead log *pattern* matches only (e.g. RSS-monitor shape → county-record monitor).
- **Sales (SAL):** homepage rails skew AI/ops-general; category crawl of `/workflows/categories/sales/` not yet done — do this explicitly on the next run.

## Follow-ups queued for the daily agent
1. Category-crawl `sales/`, `marketing/`, `other/`, `document-ops/` (not just homepage) to find true ECM and SAL hits.
2. Cross-check each new pull against the 25 existing catalog IDs in `src/data/verticals.ts` before adding as "new" — only log genuinely new node patterns or newly trending integrations.
3. Anything that doesn't map to an existing SAL/ECM/WHL/PRD/SMB slot but is clearly one of the 5 verticals goes into a dated `_inbox/{date}/candidates.md` file for DJ to triage into a 6th+ card or a swap.
