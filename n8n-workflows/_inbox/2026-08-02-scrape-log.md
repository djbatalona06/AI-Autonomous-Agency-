# Scrape Log — 2026-08-02

Source: [n8n.io/workflows](https://n8n.io/workflows/) (targeted search — see automation note
below) plus community roundups (n8nlab.io, Intuz, BrowserAct, Goodspeed, ConnectSafely,
awesome-n8n-templates on GitHub) cross-referenced against live n8n.io template links.

**Automation note:** both `n8n-workflow-scout.yml` and `n8n-brainstorm-scrape.yml` are
**still failing on every scheduled run** — confirmed via a direct `WebFetch` of
`n8n.io/workflows` from this session, which also returned HTTP 403 (Cloudflare bot
protection), matching what the GitHub Actions runner has seen since 2026-07-20. No
`FIRECRAWL_API_KEY` is configured in this environment either, so today's findings below come
from targeted web search + cross-referencing real `n8n.io/workflows/<id>-<slug>/` URLs,
same fallback method used on 2026-07-22 and again by the 2026-07-31 catch-up (PR #50).

**Root cause is unchanged and still unresolved:** the Anthropic account backing
`ANTHROPIC_API_KEY` has an insufficient credit balance — this is now confirmed broken for
**13+ consecutive scheduled days** (2026-07-20 through 2026-08-02). PR #49 (OIDC fix, safe
but insufficient alone) and PR #50 (2026-07-31 catch-up + diagnosis) are both still open,
draft, and green — awaiting DJ's review/merge and, separately, credits added at
console.anthropic.com. No code change in this repo can fix the billing blocker.

## Raw pulls (search-sourced, cross-checked against live n8n.io template pages)

| Title | Nodes (partial) | Link | Routed to |
|---|---|---|---|
| AI web researcher for sales | AI Agent, Web Search, HTTP Request | [2324](https://n8n.io/workflows/2324-ai-web-researcher-for-sales/) | SAL-B12 |
| Auto-generate problem-focused blog posts for Shopify products with AI | Shopify, AI Agent, Filter | [5107](https://n8n.io/workflows/5107-auto-generate-problem-focused-blog-posts-for-shopify-products-with-ai/) | ECM-B12 |
| AI real estate agent: end-to-end ops automation (web, data, voice) | AI Agent, Webhook, Calendar | [4368](https://n8n.io/workflows/4368-ai-real-estate-agent-end-to-end-ops-automation-web-data-voice/) | WHL-B12 |
| Real estate chatbot with AI property matching and automated calendar scheduling | AI Agent, Calendar, Webhook | [7250](https://n8n.io/workflows/7250-real-estate-chatbot-with-ai-property-matching-and-automated-calendar-scheduling/) | (already claimed by pending `WHL-B11` in draft PR #50 — not re-logged) |
| RAG chatbot for company documents using Google Drive and Gemini | Google Drive, Vector Store, AI Agent | [2753](https://n8n.io/workflows/2753-rag-chatbot-for-company-documents-using-google-drive-and-gemini/) | PRD-B12 |
| AI invoice agent | AI Agent, PDF, Gmail | [7905](https://n8n.io/workflows/7905-ai-invoice-agent/) | SMB-B12 |

**Also surfaced, not routed (already covered by an existing card):**

| Finding | Link | Why skipped |
|---|---|---|
| Lead generation agent | [7423](https://n8n.io/workflows/7423-lead-generation-agent/) | Close match to `SAL-01`/`SAL-B01` shape (form → enrich → outreach) |
| Automatic Shopify order fulfillment process | [3296](https://n8n.io/workflows/3296-automatic-shopify-order-fulfillment-process/) | Fulfillment-only automation, not a vertical-facing candidate — internal ops, not currently in scope |
| Real estate lead generation with BatchData skip tracing & CRM integration | [3666](https://n8n.io/workflows/3666-real-estate-lead-generation-with-batchdata-skip-tracing-and-crm-integration/) | Already the direct source for `WHL-B01`/`WHL-01` |
| AI invoice agent variants (PDF processing/approval flow) | [4452](https://n8n.io/workflows/4452-automated-pdf-invoice-processing-and-approval-flow-using-openai-and-google-sheets/) | Inbound AP side already covered by `SMB-B07` |

## Coverage notes

- **Sales:** clean hit — `AI web researcher for sales` fills a genuine pre-first-contact
  research gap (existing cards start at CRM enrichment or post-booking call-prep).
- **Ecommerce:** first content-marketing-angle candidate logged (`ECM-B12`) — every prior
  ECM card automates a transactional/lifecycle step, not top-of-funnel content.
- **Wholesaling/REI:** two direct real-estate n8n.io hits surfaced this run (4368, 7250).
  7250 duplicates the source already claimed by the pending `WHL-B11` in draft PR #50, so
  only 4368 was routed here as `WHL-B12` to avoid a collision once #50 merges.
- **Productivity:** `PRD-B12` formalizes a pattern (2753) that was previously only cited as
  inspiration for `SAL-03`'s design — logged here as its own general-purpose card since it
  stands on its own merit for any client with a scattered internal wiki.
- **Small Business:** `SMB-B12` is the front-half complement to `SMB-02` (invoice creation
  vs. invoice chasing) — natural pair-sell.

## Follow-ups queued for the next run

1. **Billing blocker — 13 days running, unresolved.** DJ needs to add credits to the
   Anthropic account backing `ANTHROPIC_API_KEY` at console.anthropic.com. This is the
   single blocker for both scheduled GitHub Actions to resume unattended. Flagged again in
   this run's PR description.
2. **PRs #49 and #50 are still open and unreviewed** (both draft, both green/mergeable per
   GitHub Actions status checks). Nothing in either needs a code fix right now — they're
   waiting on DJ's manual review per his standing instruction to review before merge.
3. **Google Drive duplicate folders** (first flagged in PR #50, still unresolved): three
   separate "n8n Templates"-style folders exist in Drive — `Yawn Agency — n8n Template
   Library` (canonical, referenced by `n8n-workflows/README.md`), `Yawn Agency — n8n
   Templates`, and a bare `n8n Templates` folder. Today's mirror went only to the canonical
   one; the other two are untouched pending DJ's confirmation to consolidate/delete.
4. **Template preview photos still blocked.** n8n.io template pages 403 direct fetches
   from this environment too (not just the GitHub Actions runner) and no
   `FIRECRAWL_API_KEY` is configured here either. `BrainstormSource.previewImageUrl` stays
   unset until a Firecrawl key is added as a repo/session secret.
