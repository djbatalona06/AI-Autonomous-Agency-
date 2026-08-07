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

---

### 2026-07-24 batch

*(Note: two more daily batches — 2026-07-22 and 2026-07-23 — exist as still-open draft PRs
\#39 and \#40 and aren't in this file yet on `main`. This entry is numbered `SAL-B09` to
avoid colliding with `SAL-B07`/`SAL-B08` once those merge.)*

9. **Google-Maps Local-Business Enrichment → Territory Prospecting List** — proposed
   `SAL-09` (new candidate)
   - *Inspired by:* "Enrich Google Maps business and lead data with CoreClaw and Google
     Sheets" —
     [n8n.io/workflows/17362](https://n8n.io/workflows/17362-enrich-google-maps-business-and-lead-data-with-coreclaw-and-google-sheets/).
   - *Node design:* Schedule Trigger (every 30 min) → Google Sheets (read unprocessed rows
     from a "Query" tab: keyword + base location) → HTTP Request (start CoreClaw Google
     Maps scrape+enrich job) → Wait/poll until the run succeeds → HTTP Request (fetch
     results) → Split Out (per business) → Google Sheets (append business details tab +
     enriched contact tab).
   - *Why it's distinct:* `SAL-B01` enriches *inbound* form leads (Clearbit/Hunter); this
     builds outbound prospecting lists from scratch by geography/keyword — a fit for SDR
     teams and agencies doing territory-based cold outreach, not just lead-in enrichment.

---

### 2026-07-25 batch

*(Note: `SAL-B07`/`SAL-B08`/`SAL-B09` exist only in still-open draft PRs #39/#40/#41 and
aren't on `main` yet. This entry is numbered `SAL-B10` to avoid colliding with any of them.)*

7. **Full Lead-to-Meeting AI Pipeline** — reinforces `SAL-01`/`SAL-02`/`SAL-03`
   - *Inspired by:* "Run a full lead-to-meeting pipeline with Google Sheets, Gmail, Gemini
     and OpenAI" —
     [n8n.io/workflows/17383](https://n8n.io/workflows/17383-run-a-full-lead-to-meeting-pipeline-with-google-sheets-gmail-gemini-and-openai/)
     (new on n8n.io within the last 24 hours, 4.6/5 across 27 reviews).
   - *Node design:* Webhook (new lead) → HTTP Request (Apollo org-enrich) → Gemini (score +
     tier: hot/warm/poor_fit) → Google Sheets (leads CRM tab) → Switch by tier → Gemini
     (personalized first-touch) → Gmail + UltraMsg (email/SMS send) → Webhook (inbound
     reply) → OpenAI (classify intent: book_meeting/objection/not_interested) → branch to
     booking-link email / AI objection-handling reply / closed-lost → Schedule Trigger
     (non-responder follow-ups, pre-call Slack brief, weekly conversion report, no-show
     re-engagement).
   - *Why it's worth logging even though it overlaps existing cards:* it's the single most
     complete reference build seen yet for the full `SAL-01→SAL-02→SAL-03` chain in one
     workflow — the reply-intent classifier (book/object/decline) and the no-show
     re-engagement branch are both new patterns not yet reflected in any `SAL-0X` card.
     Worth pulling apart into standalone add-ons rather than one $3k+ monolith sale.

---

### 2026-08-07 batch

*(Note: `SAL-B11`–`SAL-B14` exist only in still-open draft PRs #50/#52/#55/#56 and aren't on
`main` yet. This entry is numbered `SAL-B15` to avoid colliding with any of them. Direct
`n8n.io` scraping is still Cloudflare-blocked from this environment — sourced via targeted
web search cross-checked against the live template page.)*

8. **Technographic Prospecting: BuiltWith Tech-Stack Signals → Trello Lead Board** —
   proposed `SAL-10` (new candidate)
   - *Inspired by:* "Automate Sales Pipeline: BuiltWith Technology Data to Trello Lead
     Cards with Google Sheets" —
     [n8n.io/workflows/4786](https://n8n.io/workflows/4786-automate-sales-pipeline-builtwith-technology-data-to-trello-lead-cards-with-google-sheets/).
   - *Node design:* Schedule Trigger → Google Sheets (target domain list) → HTTP Request
     (BuiltWith tech-stack lookup per domain) → Code (flag domains missing/using a
     competing tool — buying signal) → Trello (create lead card with detected stack) →
     Google Sheets (mark processed).
   - *Why it's distinct:* every prior SAL entry enriches or routes an *inbound* lead; this
     builds an outbound list by what software a prospect already runs — a colder-outbound
     signal, good SDR-team retainer fodder.
