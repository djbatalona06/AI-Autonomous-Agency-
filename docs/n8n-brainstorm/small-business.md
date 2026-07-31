# Small Business — n8n Brainstorm Log

Vertical code `SMB`. Cross-reference: `src/data/verticals.ts` → `VERTICALS.find(v => v.code === "SMB")`.

---

### 2026-07-19 batch

1. **Client Intake → Booking + Confirmation** — reinforces `SMB-01`
   - *Inspired by:* the "Appointment Follow-Up Workflow" community thread (confirm, remind,
     review-request cycle) plus the standard Calendly-booking-to-CRM pattern.
   - *Node design:* Webhook (form/Calendly) → CRM create-or-update contact → Google Calendar
     book/check availability → Gmail/SMS confirmation → Slack notify owner.

2. **Invoice → Payment → Auto Follow-Up** — reinforces `SMB-02`
   - *Inspired by:* "InvoiceChase: Automated AR Follow-up" (n8ntemplatestore.com) and the
     Stripe/QuickBooks reminder-cadence pattern.
   - *Node design:* Stripe/QuickBooks Webhook (invoice created) → Wait (day 1 / 7 / 14) →
     IF (paid?) → Gmail branded reminder → Slack escalation on day 14 if still unpaid.

3. **New-Hire Onboarding Orchestration** — reinforces `SMB-03`
   - *Inspired by:* the agency's own Template 4 in the template library
     (`references/templates.md`) plus the "Provision new employee accounts" featured n8n.io
     template.
   - *Node design:* Google Sheets/BambooHR Trigger (new row) → Gmail welcome email → Notion
     accounts checklist → Google Calendar Day-1 meeting → Slack DM to the manager.

4. **Review & Reputation Engine** — reinforces `SMB-04`
   - *Inspired by:* "Review Request After Service" (Uzunu template list) combined with a
     review-monitoring branch from the ScalaHosting 2026 roundup.
   - *Node design:* two triggers feeding one workflow — (a) Schedule/Webhook on job
     completion → Wait 2 days → Gmail/SMS review ask → IF (in-app rating < 4 → route to
     support instead of a public review) else → Google/Yelp review link; (b) Schedule
     Trigger → Google Business Profile (new reviews check) → Slack alert on any new review.

5. **Appointment No-Show Reducer** — reinforces `SMB-05`
   - *Inspired by:* "Appointment Reminder SMS" (Uzunu) — "reduce no-shows 40–60% without
     lifting a finger" is the recurring claim across every source that covers this pattern.
   - *Node design:* Schedule Trigger → Calendar query (appointments tomorrow / in 2h) →
     Twilio SMS with one-tap confirm/reschedule → IF (no confirm by cutoff) → follow-up
     nudge to rebook → Google Sheets log of no-show rate.

**New-candidate watch:** nothing distinct enough surfaced beyond `SMB-01..05` this run —
next pass should look at the "Contract Signed → Project Kickoff" and "Expense Receipt →
Spreadsheet" patterns as possible retainer add-ons rather than standalone cards.

---

### 2026-07-21 batch

6. **WhatsApp AI Customer Support Autoresponder** — *new candidate, no card yet (proposed
   `SMB-06`)*
   - *Inspired by:* "Automate WhatsApp customer support with voice transcription, FAQ and
     appointment scheduling" — [n8n.io/workflows/8454](https://n8n.io/workflows/8454-automate-whatsapp-customer-support-with-voice-transcription-faq-and-appointment-scheduling).
   - *Node design:* WhatsApp Trigger (message in, text or voice note) → Speech-to-Text (if
     voice) → AI Agent (answer FAQ or classify as booking request) → IF (booking) → Google
     Calendar check/book → WhatsApp reply → Google Sheets log.
   - *Why it's distinct from `SMB-01`:* that card assumes a web form/Calendly front door;
     this one meets the customer on WhatsApp directly — a strong fit for local-service SMBs
     whose customers already text them instead of filling out forms.

---

### 2026-07-23 batch

7. **AI Request-to-Quote PDF Generator** — proposed `SMB-07` (new candidate)
   - *Inspired by:* "Automated request-to-quote with OpenAI, Google Sheets & CraftMyPDF" —
     [n8n.io/workflows/8239](https://n8n.io/workflows/8239-automated-request-to-quote-with-openai-google-sheets-and-craftmypdf/).
   - *Node design:* Form Trigger ("Request a Quote": requirements, budget, need-by date) →
     Google Sheets (load product/service catalog: SKU, price, stock, min qty) → OpenAI
     (select line items, build a strict JSON quote, respects stock/min qty and a discount
     cap) → Code (compute totals, VAT, invoice number, due date) → CraftMyPDF (render a
     branded PDF quote) → Email/SMTP (send the customer the quote automatically).
   - *Why it's distinct:* nothing in `SMB-B01..B06` gets a priced quote out the door —
     `SMB-01` books the appointment, `SMB-02` chases the invoice after the fact; this fills
     the gap in between. Clean $1,500–$2,000 Rung 2 Simple sell for any service business
     still quoting by hand or spreadsheet.

---

### 2026-07-24 batch

*(Numbered `SMB-B09` to skip past `SMB-B07`/`SMB-B08`, which only exist in still-open
draft PRs #39/#40, not yet on `main`.)*

9. **Contractor/Vendor License Verification for Lead Lists** — proposed `SMB-09` (new
   candidate)
   - *Inspired by:* "Verify US contractor licenses in lead lists with Apify" —
     [n8n.io/workflows/17355](https://n8n.io/workflows/17355-verify-us-contractor-licenses-in-lead-lists-with-apify/).
   - *Node design:* Manual/Webhook Trigger (lead list: company, state, optional license#)
     → Switch (map state → correct Apify license-lookup actor, or flag unsupported states)
     → Apify (run the state licensing-portal lookup) → Code (match returned record via
     exact license# or normalized name) → Set (verdict: verified / expired / review /
     not-found / unverifiable) → Filter (split verified-active from needs-review).
   - *Why it's distinct:* nothing in `SMB-B01..B08` vets a third party before a small
     business hands them work or a referral — this fills that gap for any local-service
     SMB (contractors, property managers, referral networks) that subcontracts work and
     needs a paper trail proving the sub was licensed. Direct cross-sell to `WHL` clients
     too — wholesalers/investors vetting rehab contractors before a deal closes.

---

### 2026-07-25 batch

*(Note: `SMB-B07`/`SMB-B08`/`SMB-B09` exist only in still-open draft PRs #39/#40/#41 and
aren't on `main` yet. This entry is numbered `SMB-B10` to avoid colliding with any of them.)*

7. **Insurance Quote Lead Routing** — *new candidate, no card yet (proposed slot number
   TBD — depends which of `SMB-06`/`07`/`08`/`09` land first)*
   - *Inspired by:* "Route insurance quote leads with OpenAI, Airtable, Sheets, Teams,
     Slack and Twilio" —
     [n8n.io/workflows/17075](https://n8n.io/workflows/17075-route-insurance-quote-leads-with-openai-airtable-sheets-teams-slack-and-twilio/).
   - *Node design:* Webhook (quote-form submission) → Code (normalize payload) → Airtable
     and/or Google Sheets lookup (dedupe vs. recent email/phone) → OpenAI (lead score,
     priority, underwriting flags, missing-info, next steps) → Switch (hot/warm/cold) →
     Microsoft Teams and/or Slack alert (hot/warm) → Twilio SMS to agent (hot only) →
     Airtable/Sheets (log the quote + status).
   - *Why it's distinct:* nothing in `SMB-01..06` targets insurance agencies specifically —
     this is a "buyers choose their own stack" template (Teams *or* Slack, Airtable *or*
     Sheets) that fits Yawn's local-service SMB buyer profile well: an independent insurance
     agent losing quotes to slow follow-up is the same pain as `SMB-01`'s booking-confirmation
     buyer, just in a regulated vertical with underwriting-flag nuance built into the AI
     scoring step.

---

### 2026-07-31 batch

*(Note: automated `n8n-brainstorm-scrape.yml` has failed every scheduled run since
2026-07-20 — see `n8n-workflows/_inbox/2026-07-31-scrape-log.md` for the diagnosis. This
batch also closes the 07-26→07-30 gap where no manual catch-up ran.)*

11. **RAG-Grounded Customer Support Knowledge-Base Agent** — reinforces `SMB-06`
    - *Inspired by:* "Smart Customer Support System with GPT-4o, Gmail, Slack & Drive
      Knowledge Base" —
      [n8n.io/workflows/4543](https://n8n.io/workflows/4543-smart-customer-support-system-with-gpt-4o-gmail-slack-and-drive-knowledge-base/).
    - *Node design:* Gmail Trigger (poll every minute) → Google Drive (sync support docs to
      a vector store) → AI Agent (GPT-4o, RAG — classify + draft grounded reply) → Switch
      (billing/support/spam/urgent) → Gmail (send or draft) → Slack (escalate urgent/low
      confidence to a human).
    - *Why it's distinct from `SMB-B06`:* that card is a simple WhatsApp
      classify-and-template autoresponder; this grounds every reply in the business's actual
      docs instead of a static template, escalating only what the docs can't answer.
