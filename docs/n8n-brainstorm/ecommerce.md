# E-commerce — n8n Brainstorm Log

Vertical code `ECM`. Cross-reference: `src/data/verticals.ts` → `VERTICALS.find(v => v.code === "ECM")`.

---

### 2026-07-19 batch

1. **AI Abandoned Checkout Recovery** — reinforces `ECM-01`
   - *Inspired by:* "CartRescue: AI Abandoned-Checkout Recovery" (n8ntemplatestore.com) plus
     n8n's own blog reference build.
   - *Node design:* Shopify Webhook (`checkout/create`) → Wait 1h → HTTP Request (Shopify
     Orders API, check converted via checkout token) → IF (purchased?) → Gmail/Klaviyo
     3-touch sequence (1h / 24h / 72h, discount code on touch 3) → Google Sheets log.

2. **Post-Purchase Review & UGC Funnel** — reinforces `ECM-02`
   - *Inspired by:* the "Review Request After Service" / post-purchase review pattern
     repeated across n8n's Shopify workflow blog and 2026 template roundups.
   - *Node design:* Shopify Order Trigger (fulfilled) → Wait 7 days → Gmail review + photo
     ask → IF (in-app rating < 4 → route to support ticket instead of a public review) →
     Google Sheets log.

3. **Low-Stock + Restock Waitlist Blast** — reinforces `ECM-04`
   - *Inspired by:* "Restock Alert: Back-in-Stock Waitlist Notifier" (a "Popular" tag on
     n8ntemplatestore.com's e-commerce category).
   - *Node design:* Schedule Trigger → Shopify/WooCommerce (inventory levels) → IF (below
     threshold) → Telegram/Slack alert to owner → Airtable waitlist lookup → Klaviyo/Gmail
     "back in stock" blast to the waitlist.

4. **Competitor Price Intelligence Monitor** — *new candidate, no card yet (proposed `ECM-06`)*
   - *Inspired by:* "Competitor Price Intelligence" — tagged "Top rated" on the same
     marketplace category page.
   - *Node design:* Schedule Trigger → HTTP Request / scraper (competitor product pages) →
     Code (diff vs. last-seen price, stored in Sheets) → Google Sheets log → Slack alert on
     undercut.
   - *Why flag it:* every e-commerce roundup checked this run lists price intelligence as a
     top-3 requested build; nothing in the current catalog covers it.

5. **AI Win-Back / Reactivation Sequence** — reinforces `ECM-05`
   - *Inspired by:* the "win-back" pattern that shows up whenever a source pairs Shopify with
     an LLM node (personalizing the offer from actual purchase history rather than a generic
     discount blast).
   - *Node design:* Schedule Trigger → Shopify (customers past typical reorder window) →
     OpenAI (personalize offer referencing what they bought) → Klaviyo/Gmail send → Sheets
     log response.

**New-candidate watch:** Competitor Price Intelligence Monitor above — worth scoping as
`ECM-06` if a store owner asks for it; otherwise keep it as a retainer add-on rather than a
standalone Rung 1/2 card (it's ongoing monitoring, not a one-time build).

---

### 2026-07-21 batch

6. **AI Customer Support Chatbot with Order Memory** — *new candidate, no card yet
   (proposed `ECM-07`, since `ECM-06` is already claimed by the price monitor above)*
   - *Inspired by:* "AI-Powered E-commerce Customer Support Chatbot with GPT-4 and Supabase"
     — [n8n.io/workflows/7256](https://n8n.io/workflows/7256-ai-powered-e-commerce-customer-support-chatbot-with-gpt-4-and-supabase/).
   - *Node design:* Chat Widget/Webhook Trigger → Supabase (retrieve order + customer
     history for context) → OpenAI/GPT-4 Agent (answer with memory of the conversation and
     order state) → IF (needs a human — refund/complaint) → Slack/Zendesk escalate, else →
     respond directly in the chat.
   - *Why flag it:* every current ECM card is trigger-driven automation behind the scenes;
     this is the first live, customer-facing AI surface — good anchor for a Rung 2 Medium
     build ($2,000–$3,500) with a retainer story (model/prompt tuning as ongoing work).

---

### 2026-07-23 batch

8. **Auto-Segment Customers by Purchase Behavior** — proposed `ECM-08` (new candidate)
   - *Inspired by:* "Segment retail customers by purchase behavior with CRM and Google
     Sheets" —
     [n8n.io/workflows/12870](https://n8n.io/workflows/12870-segment-retail-customers-by-purchase-behavior-with-crm-and-google-sheets/).
   - *Node design:* Webhook (new order/customer-update event from Shopify/WooCommerce/CRM)
     → Code (normalize order count, lifetime spend, last-order date, category) → Switch
     (classify new / repeat / VIP / inactive) → CRM/email platform (sync segment tag) →
     Google Sheets (log the segmentation event).
   - *Why it's distinct:* nothing in `ECM-B01..B07` builds ongoing lifecycle segmentation —
     this feeds targeted campaigns and pairs naturally with `ECM-B05`'s win-back sequence
     (segment first, then trigger the right sequence per tier).

---

### 2026-07-24 batch

*(Numbered `ECM-B09` to skip past `ECM-B07`/`ECM-B08`, which only exist in still-open
draft PRs #39/#40, not yet on `main`.)*

9. **Brand Impersonation & Deepfake Threat Hunter** — proposed `ECM-09` (new candidate)
   - *Inspired by:* "Hunt brand impersonation and deepfake threats with Claude, Google
     Sheets and SendGrid" —
     [n8n.io/workflows/17360](https://n8n.io/workflows/17360-hunt-brand-impersonation-and-deepfake-threats-with-claude-google-sheets-and-sendgrid/).
   - *Node design:* Schedule Trigger (every 4 hrs) → Set (brand context: domains, handles,
     keywords, logo description) → HTTP Request (brand-monitoring/social-listening API) →
     AI Agent/Claude (classify impersonation risk, assign type + rationale) → Code
     (composite threat score from AI score + reach + account-age + image-similarity
     signals) → Google Sheets (append `ImpersonationScans` tracker) → IF (critical tier or
     AI-voice-scam) → SendGrid (alert email to the brand-protection inbox).
   - *Why it's distinct:* nothing in `ECM-B01..B08` is a security/brand-protection
     surface — every existing card automates the store's own lifecycle (cart, reviews,
     stock, pricing, win-back, support). This is the first card that watches the *outside*
     world for counterfeiters and deepfake ad scams running under the client's brand —
     good Rung 2 Medium retainer sell for any DTC brand that's been hit by knockoffs.

---

### 2026-07-25 batch

*(Note: `ECM-B07`/`ECM-B08`/`ECM-B09` exist only in still-open draft PRs #39/#40/#41 and
aren't on `main` yet. This entry is numbered `ECM-B10` to avoid colliding with any of them.)*

7. **Order Confirmation + Team Notification Starter** — *new candidate, no card yet
   (proposed slot number TBD — depends which of `ECM-06`/`07`/`08`/`09` land first)*
   - *Inspired by:* "Automate e-commerce order processing with email notifications &
     webhooks" —
     [n8n.io/workflows/7518](https://n8n.io/workflows/7518-automate-e-commerce-order-processing-with-email-notifications-and-webhooks/)
     (4.6/5 across 27 reviews, explicitly built for beginners).
   - *Node design:* Webhook (new-order event from Shopify/WooCommerce/BigCommerce/Etsy) →
     Set (store config: name, contact, branding) → validation (required fields present) →
     Gmail (branded customer confirmation) → Gmail (internal team/fulfillment alert) →
     error-handling branch on incomplete payload → Respond to Webhook (ack back to the
     platform).
   - *Why it's distinct:* every other ECM card assumes the store already has *something*
     wired up (cart tracking, review flow, inventory sync). This is the pre-req step below
     all of them — the first thing a brand-new store owner needs — and its "beginner,
     5-minute setup, built-in nodes only" framing is a near-perfect **Rung 1 Template
     Install** ($750, 14-day warranty): cheapest possible ECM on-ramp, cross-sell straight
     into `ECM-01` (abandoned checkout) once the store has volume.
