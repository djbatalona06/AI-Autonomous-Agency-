# Scrape Log — 2026-08-04

Source: targeted web search cross-referenced against live `n8n.io/workflows/<id>-<slug>/`
template pages, plus community roundups (n8nlab.io, ConnectSafely, BrowserAct,
awesome-n8n-templates on GitHub). A direct `WebFetch` of `n8n.io/workflows` from this
session returned HTTP 403 (Cloudflare bot protection) again this run — same result as
every prior manual run since 2026-07-20, and no `FIRECRAWL_API_KEY` is configured in this
environment either.

**Automation note (unchanged, 15+ days running):** both scheduled GitHub Actions —
`n8n-workflow-scout.yml` (00:07 UTC) and `n8n-brainstorm-scrape.yml` (07:00 UTC) — have
failed on every run from 2026-07-20 through today (2026-08-04), confirmed via
`actions_list` (latest runs: 2026-08-04T03:28Z failure, 2026-08-03T10:46Z failure). Root
cause unchanged since first diagnosed in PR #48: the Anthropic account backing
`ANTHROPIC_API_KEY` has an insufficient credit balance. No code change in this repo can
fix this — it needs credits added at console.anthropic.com. This is now flagged in five
consecutive PRs (#48, #49, #50, #52, and today's) without resolution.

**PR backlog note:** draft PRs #49 (2026-07-30), #50 (2026-07-31, B11 batch), and #52
(2026-08-02, B12 batch) are all still open and green (Vercel deploy checks pass), awaiting
DJ's manual review/merge per his standing instruction to review before merging. Nothing in
any of them needs a code fix — they're simply unreviewed. Today's PR adds a fourth to the
stack. Because each daily batch branches off `main` independently rather than stacking on
the prior day's still-open PR, the four are mutually independent (no merge conflicts
between them), but IDs were coordinated by hand each run to avoid collisions — see the
"Note" callouts in each `docs/n8n-brainstorm/*.md` batch header.

## Raw pulls (search-sourced, cross-checked against live n8n.io template pages)

| Title | Nodes (partial) | Link | Routed to |
|---|---|---|---|
| AI sales agent — fully automated email handling & lead scoring system | AI Agent, Email Trigger, Switch | [10128](https://n8n.io/workflows/10128-ai-sales-agent-fully-automated-email-handling-and-lead-scoring-system/) | SAL-B13 |
| Shopify multi-module automation with GPT-4o, Langchain agents & integrations | AI Agent, Switch, Shopify | [4455](https://n8n.io/workflows/4455-shopify-multi-module-automation-with-gpt-4o-langchain-agents-and-integrations/) | ECM-B13 |
| Enrich property inventory survey with image recognition and AI agent | AI Agent (vision), HTTP Request | [2330](https://n8n.io/workflows/2330-enrich-property-inventory-survey-with-image-recognition-and-ai-agent/) | WHL-B13 |
| AI agent for realtime insights on meetings | Webhook, AI Agent, Filter | [2651](https://n8n.io/workflows/2651-ai-agent-for-realtime-insights-on-meetings/) | PRD-B13 |
| Automate multi-channel customer support with Gmail, Telegram, and GPT AI | Gmail Trigger, Telegram Trigger, AI Agent | [4474](https://n8n.io/workflows/4474-automate-multi-channel-customer-support-with-gmail-telegram-and-gpt-ai/) | SMB-B13 |

**Also surfaced, not routed (too close to an existing card or a pending draft-PR entry):**

| Finding | Link | Why skipped |
|---|---|---|
| AI blog generator for Shopify product listings (GPT-4o + Sheets) | [4735](https://n8n.io/workflows/4735-ai-blog-generator-for-shopify-product-listings-using-gpt-4o-and-google-sheets/) | Near-duplicate of `ECM-B12` (pending PR #52), same content-generation shape |
| Smart Shopify agent — AI-powered abandoned cart recovery | [4396](https://n8n.io/workflows/4396-smart-shopify-agent-ai-powered-abandoned-cart-recovery/) | Already covered by `ECM-01` |
| Qualify real estate leads automatically with OpenAI, Gmail & Airtable CRM | [5428](https://n8n.io/workflows/5428-qualify-real-estate-leads-automatically-with-openai-gmail-and-airtable-crm/) | Close match to `WHL-B08`'s qualification shape, different channel only |
| Actioning your meeting next steps using transcripts and AI | [2328](https://n8n.io/workflows/2328-actioning-your-meeting-next-steps-using-transcripts-and-ai/) | Duplicates `PRD-B02`'s transcript → action-items pattern |
| AI customer support assistant · WhatsApp ready | [3859](https://n8n.io/workflows/3859-ai-customer-support-assistant-whatsapp-ready-works-for-any-business/) | Duplicates `SMB-B06` |

## Coverage notes

- **Sales:** `SAL-B13` is the first "continuous inbox scoring" pattern — every existing
  card scores a lead once (at intake, or before first touch); this re-scores on every
  reply.
- **Ecommerce:** `ECM-B13` is the first multi-module "ops agent" umbrella rather than a
  single-purpose automation — a natural Complex-tier upsell once a client already has 2–3
  `ECM` cards live.
- **Wholesaling/REI:** `WHL-B13` is the first card to score the *property* (via photos)
  rather than the *lead/contact* — direct feed into the `WHL-B04` deal analyzer.
- **Productivity:** `PRD-B13` is the first realtime/streaming pattern in the vertical —
  every other `PRD` card processes something after the fact.
- **Small Business:** `SMB-B13` generalizes `SMB-B06`'s WhatsApp-only autoresponder into a
  channel-agnostic unified inbox (Gmail + Telegram to start).

## Follow-ups queued for the next run

1. **Billing blocker — 15+ days running, unresolved.** DJ needs to add credits to the
   Anthropic account backing `ANTHROPIC_API_KEY` at console.anthropic.com. Single blocker
   for both scheduled GitHub Actions to resume unattended.
2. **PRs #49, #50, #52 still open and unreviewed**, all green. No code fix needed — waiting
   on DJ's manual review per his standing instruction. Today's PR will be a fourth.
3. **Google Drive folder sprawl — now 4 folders**, not 3 as last flagged: `Yawn Agency — n8n
   Template Library` (canonical, id `1Ly4NAQtZPYQjqppCvEbi2bK5wyEXWCkz`, mirrored today),
   `Yawn Agency — n8n Templates`, `n8n Templates`, and `Yawn Agency - n8n Workflow
   Brainstorm`. Needs DJ's confirmation to consolidate/delete the other three — this
   session did not delete anything without explicit sign-off.
4. **Template preview photos still blocked.** `n8n.io` template pages 403 direct fetches
   from this environment (no `FIRECRAWL_API_KEY` configured). `BrainstormSource.previewImageUrl`
   stays unset until a Firecrawl key is added as a repo/session secret.
5. **Google Drive mirror failed this run.** `mcp__Google-Drive__create_file` returned an
   internal error on every attempt today — including a minimal test write with no parent
   folder specified — so no new Drive doc was created for the B13 batch. This looks like a
   connector-side fault, not a permissions issue (read/search access worked fine). Needs a
   retry on a future run; the GitHub commit for this batch is unaffected and current.
