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
