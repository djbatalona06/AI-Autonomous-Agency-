# Wholesaling / REI — n8n Brainstorm Log

Vertical code `WHL` (flagship ⭐). Cross-reference: `src/data/verticals.ts` → `VERTICALS.find(v => v.code === "WHL")`.

---

### 2026-07-19 batch

1. **Skip-Trace + Lead-Scoring Intake** — reinforces `WHL-03`
   - *Inspired by:* "Real estate lead generation with BatchData skip tracing & CRM
     integration" — a live n8n.io template
     ([n8n.io/workflows/3666](https://n8n.io/workflows/3666-real-estate-lead-generation-with-batchdata-skip-tracing-and-crm-integration/)).
   - *Node design:* Schedule + Manual dual Trigger → HTTP Request (BatchData property
     search) → Code (filter absentee-owner + 5yrs+ owned + tax-delinquent, score 0–100) →
     HTTP Request (skip trace for phone/email/mailing) → parallel output: Excel export +
     HubSpot/CRM create + email summary.
   - *Note:* this is close enough to a ready-made reference build that it could shortcut
     `WHL-03`'s dev time significantly — worth pulling the actual JSON next session.

2. **Cash-Buyer Dispo Match + Blast** — reinforces `WHL-02`
   - *Inspired by:* dispo-matching pattern referenced across wholesaling automation guides
     (match a new deal against a buyer database instead of blasting the whole list).
   - *Node design:* Webhook (new deal submitted) → Airtable/CRM query (cash-buyer DB) →
     Code (match against buy-box criteria: price, area, property type) → Twilio SMS +
     SendGrid blast to matched buyers only → CRM log.

3. **County / Motivated-List Ingestion + Dedupe** — reinforces `WHL-04`
   - *Inspired by:* the recurring "list ingestion" step in every REI automation guide
     surfaced this run (PropStream/county exports → normalize → dedupe → enrich).
   - *Node design:* Schedule Trigger (weekly) → HTTP Request/CSV import (county list or
     PropStream export) → Code (normalize fields + dedupe vs. CRM) → BatchData enrich →
     CRM insert (new records only).

4. **Deal Analyzer Intake → ARV/MAO Brief** — reinforces `WHL-05`
   - *Inspired by:* the "Zillow Investment Scanner + AI Scoring" pattern (Apify Actor
     Trigger → AI investment scoring) adapted to wholesaler math (ARV/MAO/rehab) instead of
     a buy-hold score.
   - *Node design:* Webhook (address submitted) → HTTP Request (comps via Apify/Zillow
     scrape) → Code (ARV, MAO, rehab formula) → PDF generation → CRM log + Slack/email
     brief.

5. **Open-House / Inbound-Call → 7-Day AI Follow-Up** — *new candidate, complements the
   `WHL-01` flagship rather than replacing it (proposed `WHL-06`)*
   - *Inspired by:* "Open House CRM Sync + 7-Day Auto Follow-Up" (SignSnap-style webhook →
     score → sync → nurture cadence).
   - *Node design:* Webhook (sign-in sheet/call intake) → Code (lead scoring) → CRM sync
     (HubSpot/FUB/Monday.com) → OpenAI-personalized SMS + email cadence (Twilio + SendGrid)
     over 7 days → CRM status flips to "Hot" on any reply.
   - *Why flag it:* it's the same shape as the flagship `WHL-01` but for the acquisitions
     side of the funnel (inbound calls/open-house sign-ins) rather than outbound seller
     leads — a natural upsell once `WHL-01` is installed.

---

### 2026-07-21 batch

6. **Inbound Lead Auto-Router by Intent (Rent / Sell / Buy) + AI Personalization** — *new
   candidate, complements the `WHL-01` flagship as a front-door router (proposed `WHL-07`)*
   - *Inspired by:* the "real estate property follow-up automation" pattern circulating in
     n8n practitioner communities this month — routes a single inbound webhook to
     rent/sale/purchase branches with a personalized opener per branch, then calendar +
     CRM + Slack.
   - *Node design:* Webhook (site form/Facebook Lead Ads) → AI Agent (classify intent:
     rent / sell / buy / investor) → Switch (route by intent) → OpenAI (personalize opener
     referencing the property/source) → CRM create-or-update → Google Calendar (book a
     showing if the branch calls for one) → Slack notify the right agent.
   - *Why now:* wholesalers and small brokerages keep getting one generic form for very
     different lead types — a $1,500–$2,000 Rung 2 Simple sell as the on-ramp ahead of the
     full `WHL-01` nurture sequence.

---

### 2026-07-23 batch

7. **SMS-Based AI Real Estate Lead Qualifier** — proposed `WHL-08` (new candidate)
   - *Inspired by:* "Qualify real estate leads via SMS with GPT-4o, Twilio, and Google
     Sheets" —
     [n8n.io/workflows/6332](https://n8n.io/workflows/6332-qualify-real-estate-leads-via-sms-with-gpt-4o-twilio-and-google-sheets/).
   - *Node design:* Webhook (website lead-capture form submitted) → Twilio SMS (instant
     reply, opens AI conversation) → AI Agent/GPT-4o (asks budget/location/timeline
     pre-qualifying questions) → Supabase/Postgres (store chat history keyed to phone
     number) → Google Sheets (log qualified lead summary) → CRM/Slack (hand off to the
     acquisitions rep).
   - *Why it's distinct:* `WHL-B01` scores inbound property lists, `WHL-B05`/`B06` handle
     open-house and intent-routed leads — none of them qualify a brand-new web lead by SMS
     conversation in the first sixty seconds. Cheap on-ramp ahead of the `WHL-01` flagship
     nurture, and it's a real, live n8n.io template (not a pattern match).

---

### 2026-07-24 batch

*(Numbered `WHL-B09` to skip past `WHL-B07`/`WHL-B08`, which only exist in still-open
draft PRs #39/#40, not yet on `main`.)*

9. **Automated Off-Market Property Lead Generation (BatchData + CRM)** — proposed `WHL-09`
   (new candidate)
   - *Inspired by:* "Automated property lead generation with BatchData and CRM
     integration" —
     [n8n.io/workflows/3665](https://n8n.io/workflows/3665-automated-property-lead-generation-with-batchdata-and-crm-integration/).
   - *Node design:* Schedule Trigger → HTTP Request (BatchData API property search on
     saved criteria) → Code (diff against the previous scan to isolate new/changed
     listings) → Filter (high-equity, absentee-owner, distressed signals) → HTTP Request
     (pull full owner + property detail for qualified hits) → Gmail (formatted alert:
     property details, equity %, Google Maps link) → Slack/Teams (team notification).
   - *Why flag this one specially:* the `2026-07-20` scrape log explicitly noted "gallery
     has no real-estate-specific templates at all" for this vertical and told the daily
     agent to stop expecting direct hits. **That was wrong** — this is a real, live,
     purpose-built real-estate template on n8n.io (property/owner data, equity filtering,
     off-market deal alerts), not a pattern match from an adjacent category. Correcting the
     coverage-gap note: `WHL` does have direct n8n.io hits; today's search just hadn't
     surfaced one yet. Given `BatchData` overlaps the `WHL-B01` skip-trace pipeline's data
     needs, this is a strong candidate to fold into `WHL-01`/`WHL-B01` as an alternate data
     source rather than ship as a standalone card.

---

### 2026-07-25 batch

*(Note: `WHL-B07`/`WHL-B08`/`WHL-B09` exist only in still-open draft PRs #39/#40/#41 and
aren't on `main` yet. This entry is numbered `WHL-B10` to avoid colliding with any of them.)*

7. **Property Lead Scoring Engine (BatchData)** — reinforces `WHL-03`
   - *Inspired by:* "Automated real estate property lead scoring with BatchData" —
     [n8n.io/workflows/3664](https://n8n.io/workflows/3664-automated-real-estate-property-lead-scoring-with-batchdata/)
     — the companion template to the lead-*generation* build (3665) already logged in a
     prior batch; same creator, adjacent template IDs.
   - *Node design:* CRM Webhook (new lead + address) → HTTP Request (BatchData property
     lookup) → Code (scoring algorithm: property value, square footage, property age,
     investment/non-owner-occupied status, lot size → weighted 0–100 score) → Switch
     (classify high-value / qualified / potential / unqualified) → CRM update (enriched
     property data + score) → IF (high-value) → immediate task creation → Slack notify.
   - *Why it's worth logging separately from `WHL-B01`:* `WHL-B01` is the intake + skip-trace
     pipeline; this is purely the *scoring algorithm* half, spelled out in enough detail
     (exact weighting factors) to drop straight into `WHL-03`'s build instead of writing one
     from scratch. Also targets a wider buyer list than wholesalers alone — mortgage
     lenders, home-service contractors, and insurance agents qualifying by property
     characteristics — worth keeping in mind if Yawn ever sells `WHL-03` outside the core
     wholesaling niche.

---

### 2026-08-02 batch

*(Note: `WHL-B11` exists only in still-open draft PR #50 — an inbound buyer chatbot
sourced from the same template this run also turned up
([n8n.io/workflows/7250](https://n8n.io/workflows/7250-real-estate-chatbot-with-ai-property-matching-and-automated-calendar-scheduling/)).
Not re-logged here to avoid a duplicate once #50 merges. This entry is numbered `WHL-B12`
and sourced from a different live template to avoid colliding with #50.)*

8. **AI Voice Ops Agent — Seller Correspondence + Buyer Negotiation Scheduling** — *new
   candidate, no card yet*
   - *Inspired by:* "AI real estate agent: end-to-end ops automation (web, data, voice)" —
     [n8n.io/workflows/4368](https://n8n.io/workflows/4368-ai-real-estate-agent-end-to-end-ops-automation-web-data-voice/).
   - *Node design:* Webhook (inbound seller/buyer call or message) → AI Agent
     (Claude/voice — classify intent: seller inquiry / buyer negotiation / scheduling) →
     Switch → [seller branch: AI drafts correspondence, logs to CRM] / [buyer branch: AI
     prepares counter-offer talking points, proposes times] → Google Calendar (book
     confirmed slot) → CRM (log outcome) → Slack (deal-desk notify on any offer/counter).
   - *Why it's distinct:* `WHL-01`/`WHL-B01` is instant multi-channel follow-up; `WHL-B11`
     (pending) is inbound property-match + scheduling. This is the first card handling live
     negotiation talking points and dual seller+buyer correspondence via voice, not just
     text follow-up or property matching — Complex tier ($3,500–$5,000): multi-path
     orchestration, AI agent, CRM + calendar integrations.
