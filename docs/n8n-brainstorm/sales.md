# Sales — n8n Brainstorm Log

Vertical code `SAL`. Cross-reference: `src/data/verticals.ts` → `VERTICALS.find(v => v.code === "SAL")`.

Each entry below is a concrete node design pulled from what's trending/popular on
[n8n.io/workflows](https://n8n.io/workflows/categories/sales/) and adjacent template
marketplaces, translated into a Yawn-sellable shape.

---

### 2026-07-19 batch

1. **AI Lead Enrichment & CRM Router** — reinforces `SAL-01`
   - *Inspired by:* "Lead Enrichment Pipeline" (Clearbit/Apollo → HubSpot), a top-cited
     pattern across n8n.io's sales category and every marketplace roundup this run touched.
   - *Node design:* Webhook/Typeform Trigger → HTTP Request (Clearbit or Apollo enrichment) →
     Code (lead score 0–100 from firmographic fit) → Switch (route by score/company size) →
     HubSpot/Pipedrive Create-or-Update Contact → Slack notify owning rep.
   - *Why it's worth building:* the "no manual entry, rep pinged in seconds" pitch is the
     single most-requested sales automation across every source checked this run.

2. **Cold Outreach Multichannel Sequencer (dedupe email + LinkedIn)** — reinforces `SAL-02`
   - *Inspired by:* "Multichannel Outreach Workflow" — syncs email campaigns with LinkedIn
     activity so the same prospect never gets double-messaged.
   - *Node design:* Schedule Trigger → Google Sheets (prospect list) → HTTP Request
     (PhantomBuster/LinkedIn activity check) → IF (already contacted this week?) →
     Gmail/SendGrid send → Wait → Update Sheets status.
   - *Sell angle:* agencies running outbound at scale are the buyer; dedupe logic is the
     differentiator over a bare Zapier zap.

3. **AI Proposal / Quote Generator from Deal Notes** — reinforces `SAL-04` (currently an
   open `slot`)
   - *Inspired by:* recurring "AI proposal generator" pattern in agency-facing template
     roundups (deal notes + line items → branded PDF).
   - *Node design:* CRM Trigger (deal stage = Proposal) → OpenAI (draft from notes + line
     items) → HTML/PDF render node → CRM attach → Slack/email queue for one-click send +
     e-sign.
   - *Why now:* this is the highest-priced Sales card ($3,500–$4,500) and still unbuilt —
     good next slot to fill.

4. **Meeting-Booked → CRM + AI Call-Prep** — reinforces `SAL-03`
   - *Inspired by:* Calendly-booking-to-CRM patterns paired with an AI attendee-research step
     (seen repeatedly in real-estate and B2B sales template packs alike).
   - *Node design:* Calendly/Google Calendar Trigger → HTTP Request (Clearbit/LinkedIn
     enrich attendee) → OpenAI (summarize + talking points) → CRM update stage → Slack DM +
     email prep brief to the rep.

5. **Stale-Deal / Pipeline-Rot Digest** — reinforces `SAL-05`
   - *Inspired by:* "Slack-to-CRM Logger" and deal-alert patterns from the 2026 agency
     template lists.
   - *Node design:* Schedule Trigger (daily) → CRM query (deals with no activity > N days) →
     Code (group by owner) → Slack digest per owner.

**New-candidate watch (not yet a card):** nothing distinct enough surfaced this run beyond
what's already scoped in `SAL-01..05` — next run should widen the search to AI SDR /
inbox-to-CRM logging patterns.

---

### 2026-07-21 batch

6. **AI Reply-Tracking Follow-Up Nudger** — proposed `SAL-06` (new candidate)
   - *Inspired by:* "B2B lead follow-up automation with Gemini AI, Gmail and Google Sheets" —
     [n8n.io/workflows/11283](https://n8n.io/workflows/11283-b2b-lead-follow-up-automation-with-gemini-ai-gmail-and-google-sheets).
   - *Node design:* Schedule Trigger → Google Sheets (read intro-email log) → IF (no reply
     after N days) → Gemini/OpenAI (draft a casual, personalized reminder from thread
     context) → Gmail (send as reply on the original thread, not a cold new email) →
     Google Sheets (update status).
   - *Why it's distinct from `SAL-B02`:* that one dedupes email vs. LinkedIn touches;
     this one is purely thread-aware reply detection + same-thread nudge — a cheap
     $750–$1,000 add-on for any client already on Template 1 or 2.

---

### 2026-07-23 batch

7. **Real-Time Sales Pipeline Analytics & Stalled-Deal Alerts** — proposed `SAL-07` (new
   candidate)
   - *Inspired by:* "Real-time sales pipeline analytics with Bright Data, OpenAI, and
     Google Sheets" —
     [n8n.io/workflows/5974](https://n8n.io/workflows/5974-real-time-sales-pipeline-analytics-with-bright-data-openai-and-google-sheets/).
   - *Node design:* Schedule Trigger → HTTP Request (CRM API — HubSpot/Salesforce/Pipedrive
     pull) → OpenAI (anomaly detection: stalled deals, win-rate shifts) → Slack (real-time
     alert to reps/managers) → Google Sheets (archive daily snapshot for trend analysis).
   - *Why it's distinct:* none of `SAL-B01..B07` give an always-on view across the whole
     pipeline — this is a dashboard-free retainer add-on ($500–$1,000/mo tier filler) for
     any client already on `SAL-01`/`SAL-B01`.
