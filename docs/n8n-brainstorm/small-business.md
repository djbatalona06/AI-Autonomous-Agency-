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
