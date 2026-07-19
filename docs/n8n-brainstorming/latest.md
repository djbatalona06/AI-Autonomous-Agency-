# n8n Workflow Scout — 2026-07-15

Seed brief (first run, generated manually — see `README.md` for the ongoing
automated version). Source: live scrape of
[n8n.io/workflows](https://n8n.io/workflows/) (trending/featured/recently-added
sections, `categories/sales`, `categories/real-estate-automation`,
`categories/e-commerce`) plus cross-referenced 2026 template roundups.

**What's trending on n8n.io right now:** AI-agent workflows are ~78% of new
submissions over the last 30 days; 67% of all templates ship at least one AI
node; multi-agent chains (researcher → writer → reviewer) have doubled in two
months. For Yawn this means: lead every new build proposal with "AI does the
judgment call, you approve the output" — it's what the market is already
buying.

Each entry below is import-ready as an n8n node chain and priced per the
Rung 2 complexity rubric ($1,500–$2,000 simple / $2,000–$3,500 medium /
$3,500–$5,000 complex).

---

## Sales

### 1. AI Lead Scoring & Enrichment Router — *medium*
`Webhook (ad/form lead)` → `HTTP Request (Clearbit/Apollo enrichment)` → `AI Agent (score + summarize)` → `Switch (route by score)` → `HubSpot/Pipedrive — Create or Update` → `Slack notify`
- **Template fit:** extends Template 1 (Lead Capture → CRM Auto-Intake) with AI scoring instead of a flat create.
- **Source:** "Lead Enrichment Pipeline" (Clearbit + HubSpot + LinkedIn) — connectsafely.ai 2026 roundup.
- **Pitch:** any client already on Template 1 is a 1-call upsell to this.

### 2. Slack-to-CRM Deal Logger — *medium*
`Slack Trigger (message in #deals)` → `AI Agent (extract deal fields)` → `Salesforce/HubSpot — Update` → `Google Sheets (append log)`
- **Template fit:** new.
- **Source:** "Slack-to-CRM Logger" — connectsafely.ai (Slack + Salesforce + Google Sheets).

### 3. AI Proposal / Quote Generator — *complex*
`Webhook (deal stage = "proposal")` → `HTTP Request (pull client data from CRM)` → `AI Agent (draft proposal copy)` → `HTML/PDF (render)` → `Gmail (send)` → `CRM (note update)`
- **Template fit:** new — highest-margin sales build, good Rung 2 anchor at $3,500+.
- **Source:** "AI-Powered Proposal Generator" — n8n.io `categories/sales`.

### 4. Stale-Deal Follow-Up Cadence — *simple*
`Schedule Trigger (daily)` → `CRM Query (deals stale > N days)` → `AI Agent (personalized nudge draft)` → `Gmail (send)` → `Slack (rep digest)`
- **Template fit:** extends Template 3's cadence logic to sales instead of invoicing.
- **Source:** "Follow-up reminder systems" — n8n.spot 2026 picks.

### 5. Call-Summary-to-CRM-Note — *medium*
`Webhook (Twilio/Fireflies call-done)` → `AI Agent (summarize + extract action items)` → `CRM (note create)` → `Slack (alert if "hot")`
- **Template fit:** new.
- **Source:** referenced directly in n8n.io's own HubSpot workflow set ("call-summary-to-CRM-note").

---

## Ecommerce

### 1. Abandoned Cart Recovery (3-touch) — *medium*
`Shopify Webhook (cart abandoned)` → `Wait (1 hr)` → `If (purchased?)` → `Email #1 (SendGrid)` → `Wait (24 hr)` → `If` → `Email #2 + discount` → `Wait (72 hr)` → `If` → `Email #3 final` → `Google Sheets (log)`
- **Template fit:** this *is* Template 5 — keep quoting it as-is, it's still the top-cited ecommerce use case in every 2026 roundup.
- **Source:** scalahosting.com, dev.to 2026 edition — both flag cart recovery as the highest-ROI ecommerce template.

### 2. WooCommerce/Shopify Sales Tracker — *simple*
`Shopify/WooCommerce Trigger (new order)` → `Edit Fields (normalize)` → `Google Sheets (append)` → `Slack (daily summary)`
- **Template fit:** new, cheap add-on to any ecommerce client ($750–$1,000 range).
- **Source:** "WooCommerce sales tracker" — scalahosting.com (marked "import-ready").

### 3. Supplier Feed → Product Import/Sync — *medium*
`Schedule Trigger` → `HTTP Request (supplier feed)` → `Code (transform/dedupe)` → `Shopify (bulk create/update)` → `Slack (error alert)`
- **Template fit:** new.
- **Source:** "Product import" — scalahosting.com ("adapt" tier).

### 4. AI Product Video Generator — *medium*
`Webhook (new tagged product photo)` → `Higgsfield/Dreem.ai (generate product video)` → `Shopify (attach media)` → `Slack (notify)`
- **Template fit:** new — Yawn already has Higgsfield access, so this is a near-zero-marginal-cost build to offer.
- **Source:** "Create Shopify product videos from tagged photos with Dreem.ai and Slack" — n8n.io recently-added (2026-07-15, same-day listing).

### 5. Review Monitoring & AI Reply — *medium*
`Schedule Trigger` → `Google Business Profile/Shopify Reviews API` → `AI Agent (sentiment + draft reply)` → `If (negative → Slack escalation; positive → auto-post reply)`
- **Template fit:** new.
- **Source:** "Review monitoring" — scalahosting.com.

---

## Wholesaling / REI

### 1. AI Lead Follow-Up Sequence — *complex* (this is Template 6 ⭐)
`Webhook (Podio/REISift/PropStream)` → `AI Agent (personalize opener from property + source)` → `Twilio SMS + SendGrid email (Day 1)` → `Wait` → `If (responded?)` → `Slybroadcast voicemail (Day 7)` → `CRM (status → "Hot")` → `Google Sheets (activity log)`
- **Template fit:** Template 6 — still the highest-margin play for theWRENCH/Vertex Supply contacts. No change needed, just keep leading with it.

### 2. Automated Lead Capture & CRM Entry — *simple*
`Webhook (Zillow/Facebook Lead Ads)` → `HTTP Request (dedupe check)` → `CRM (Follow Up Boss/LionDesk — create)` → `Slack (alert)`
- **Template fit:** the on-ramp template ahead of Template 6 — sell as a $750 install, upsell into Template 6 within 30 days.
- **Source:** n8nlab.io "Best n8n Workflows For The Modern Real Estate Business" — cites "99% faster response time, eliminates lead leakage."

### 3. "Just Listed / Just Sold" Social Campaign — *medium*
`Trigger (MLS update or manual)` → `AI Agent (generate copy + hashtags)` → `Google Sheets (asset queue)` → `Facebook/Instagram/LinkedIn (post)` → `Slack (confirm)`
- **Template fit:** new.
- **Source:** n8nlab.io — "saves 5+ hours of marketing work per listing."

### 4. Transaction Milestone Tracker — *medium*
`Webhook (Dotloop/SkySlope stage change)` → `Switch (milestone type)` → `Email/SMS (buyer + seller update)` → `Asana (task update)` → `Slack (internal ping)`
- **Template fit:** new.
- **Source:** n8nlab.io — "reduces coordination emails by 70%."

### 5. Daily Market/Deal Intelligence Report — *medium*
`Schedule Trigger (daily AM)` → `HTTP Request (MLS/PropStream data)` → `AI Agent (summarize comps/deals)` → `Google Sheets (log)` → `Gmail/Slack (digest to acquisitions team)`
- **Template fit:** new — good ops-retainer add-on for existing Template 6 clients (fits inside the 3 hr/mo cap).
- **Source:** n8nlab.io — "Daily Market Update Report Generation."

---

## Productivity

### 1. AI Meeting Summarizer — *simple*
`Google Calendar Trigger (meeting ends)` → `Transcript pull (Whisper)` → `AI Agent (summarize + action items)` → `Notion (page create)` → `Slack (DM attendees)`
- **Template fit:** new — matches connectsafely.ai's "Most Popular n8n Templates by Category" table for Productivity.
- **Source:** connectsafely.ai 2026 roundup.

### 2. Personal/Team Life Manager (Telegram) — *complex*
`Telegram Trigger` → `If (command type)` → `AI Agent (route)` → `Google Calendar/Sheets/Gmail (act)` → `Telegram (reply)`
- **Template fit:** new — n8n.io's own "Personal life manager with Telegram, Google services & voice-enabled AI" is currently a newcomer-essentials pick, i.e. proven demand.
- **Source:** n8n.io homepage, newcomer essentials section (scraped 2026-07-15).

### 3. AI Email Triage & Draft Queue — *medium*
`Gmail Trigger (schedule)` → `AI Agent (classify: urgent/follow-up/info/junk)` → `Switch (4 paths)` → `Draft reply` → `Google Sheets (queue)` → `Slack (review ping)`
- **Template fit:** this *is* Template 2 — no change, keep quoting as-is.

### 4. GitHub/Task Issue Triage — *simple*
`GitHub Trigger (new issue)` → `AI Agent (label + prioritize)` → `GitHub (apply label/assignee)` → `Slack (notify)`
- **Template fit:** new — good fit for dev-adjacent solopreneur clients.
- **Source:** connectsafely.ai — "GitHub Issue Triage" listed as a standout DevOps template.

### 5. Weekly Ops Digest Generator — *medium*
`Schedule Trigger (Friday PM)` → `Aggregate (Sheets/CRM/Stripe/GitHub)` → `AI Agent (synthesize digest)` → `Notion/Google Docs (save)` → `Slack/Gmail (send to team)`
- **Template fit:** new — natural fit for the Ops Retainer tier (fits the ≤3 hr/mo cap once built).

---

## Small Business

### 1. Invoice → Payment → Follow-up — *simple* (this is Template 3)
`Webhook (Stripe/QuickBooks new invoice)` → `Wait` → `If (paid?)` → `Branded email reminder (day 1/7/14)` → `Loop` → `Slack (escalation day 14)`
- **Template fit:** Template 3 — no change, still a clean $750–$1,000 install.

### 2. New Hire Onboarding Orchestration — *simple* (this is Template 4)
`Google Sheets Trigger (new hire row)` → `Gmail (welcome)` → `Notion (checklist create)` → `Google Calendar (Day 1 meeting)` → `Slack (DM manager)`
- **Template fit:** Template 4 — no change.

### 3. Weekly Revenue Report — *simple*
`Schedule Trigger` → `Stripe/QuickBooks (pull revenue data)` → `Code (aggregate)` → `Gmail (send summary to owner)`
- **Template fit:** new — scalahosting.com marks this "import-ready," good $750-tier quick win.
- **Source:** scalahosting.com — "Weekly revenue report."

### 4. Customer Feedback Analyzer — *medium*
`Typeform/Webhook (new response)` → `AI Agent (sentiment + categorize)` → `Airtable (log)` → `If (negative → Slack alert owner)`
- **Template fit:** new.
- **Source:** connectsafely.ai — "Customer Feedback Analyzer" (Typeform + OpenAI + Airtable).

### 5. Security/Compliance Questionnaire Drafter — *medium*
`Webhook (new questionnaire doc)` → `HTTP Request (pull from Notion knowledge base)` → `AI Agent (draft answers)` → `Google Docs (create draft)` → `Slack (review ping)`
- **Template fit:** new — niche but high-willingness-to-pay (vendor security reviews are a recurring SMB pain point).
- **Source:** "Draft security questionnaire answers with Notion, Google Docs, and Slack" — n8n.io recently-added (2026-07-15, same-day listing).

---

## Quick take for DJ

- **Fastest close:** Ecommerce #2 (Sales Tracker) and Small Business #3 (Weekly Revenue Report) are both "import-ready," sub-$1,000 quick wins — good pilot-phase closers if you need a fast $750 win.
- **Best upsell path:** Sales #1 (Lead Scoring) is a one-call upsell for anyone already on Template 1; Wholesaling #2 (Lead Capture) → Template 6 is the same play for the wholesale network.
- **Retainer fodder:** Wholesaling #5 and Productivity #5 are both small enough to build *inside* an existing Ops Retainer's 3 hr/mo cap — use them as retainer-conversion bait per the Step 7 script.
