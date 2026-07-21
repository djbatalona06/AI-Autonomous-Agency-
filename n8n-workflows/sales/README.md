# Sales — Node Designs (SAL)

Vertical code `SAL` · buyer: SDR/AE teams, agencies running outbound, solo closers.
Mirrors `src/data/verticals.ts` → `VERTICALS.find(v => v.code === "SAL")`. Card IDs below match the app's catalog IDs 1:1 — promoting one from `spec`/`slot` to `built` is a one-line status change in that file plus dropping the finished `workflow.json` into this folder.

Complexity tiers and pricing follow the agency's Rung 2 sizing rubric (`references/business-model.md` in the `n8n-automation-business` skill): Simple $1,500–$2,000 / Medium $2,000–$3,500 / Complex $3,500–$5,000.

---

## SAL-01 — Lead Capture → CRM Auto-Intake
**Price:** $750–$1,000 · **Tier:** Rung 1 template install · **Status:** spec

**Trigger:** Webhook (Typeform / Jotform / Gravity Forms submit)

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | Form Webhook | `n8n-nodes-base.webhook` | Receive raw submission |
| 2 | Normalize Fields | `n8n-nodes-base.set` (Edit Fields) | Map form fields → canonical lead schema |
| 3 | Enrich Contact | `n8n-nodes-base.httpRequest` (Clearbit/Hunter.io) | Append company, title, socials |
| 4 | Dedupe Check | `n8n-nodes-base.if` | Query CRM by email/domain before create |
| 5 | Create/Update CRM Contact | HubSpot / Pipedrive / Airtable node | Upsert lead record |
| 6 | Slack Notify Rep | `n8n-nodes-base.slack` | Ping the owning rep in seconds |
| 7 | Error Handler | `n8n-nodes-base.errorTrigger` → Slack #alerts | Catch enrichment/CRM failures |

```json
{"nodes":["Webhook","Edit Fields (Set)","HTTP Request","If","HubSpot","Slack","Error Trigger"]}
```

---

## SAL-02 — AI Multi-Touch Lead Follow-Up
**Price:** $1,500–$2,500 · **Tier:** Medium · **Status:** spec

**Trigger:** CRM "New Lead" webhook or polling trigger

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | New Lead Trigger | CRM webhook | Fires on lead creation |
| 2 | AI Personalize Opener | `n8n-nodes-base.openAi` / AI Agent | Generate opener from lead source + context |
| 3 | Send Email (Touch 1) | Gmail/SendGrid node | Immediate first touch |
| 4 | Send SMS (Touch 1) | Twilio node | Parallel channel, same cadence |
| 5 | Wait 3 Days | `n8n-nodes-base.wait` | Cadence delay |
| 6 | Conditional: Replied? | `n8n-nodes-base.if` | Checks CRM activity/reply flag |
| 7 | Loop Remaining Touches | `n8n-nodes-base.splitInBatches` | Days 7 and 14 touches |
| 8 | Mark Lead Hot | CRM update node | Flip status on any reply |

```json
{"nodes":["Webhook","AI Agent","Gmail","Twilio","Wait","If","Loop Over Items (Split in Batches)","CRM Update"]}
```
*Inspiration: same AI-personalization + multi-channel + wait/conditional pattern as the flagship `WHL-01` build, adapted from B2C real-estate cadence to B2B SDR cadence.*

---

## SAL-03 — Meeting-Booked → CRM + AI Call-Prep
**Price:** $2,000–$3,000 · **Tier:** Medium · **Status:** spec

**Trigger:** Calendar booking webhook (Calendly/Cal.com)

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | Booking Webhook | `n8n-nodes-base.webhook` | Cal.com/Calendly "invitee.created" |
| 2 | Advance CRM Deal Stage | CRM update node | Move deal to "Meeting Booked" |
| 3 | Fetch Prospect Context | `n8n-nodes-base.httpRequest` | Pull CRM notes, past emails, company data |
| 4 | AI Agent — Call Prep Brief | AI Agent node | Summarize into a one-page prep doc |
| 5 | Post to Slack | `n8n-nodes-base.slack` | DM the rep the brief |
| 6 | Email Brief | Gmail node | Backup copy in inbox |

```json
{"nodes":["Webhook","HTTP Request","AI Agent","Edit Fields (Set)","Slack","Gmail"]}
```
*Inspiration: node shape mirrors the scraped "RAG chatbot for company documents using Google Drive and Gemini" (n8n.io/workflows/2753) — swap the document corpus for CRM/deal notes.*

---

## SAL-04 — AI Proposal / Quote Generator
**Price:** $3,500–$4,500 · **Tier:** Complex · **Status:** slot (open build slot)

**Trigger:** Manual/CRM button trigger on a "Ready to Quote" deal

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | Deal Trigger | CRM webhook/manual | Rep marks deal ready |
| 2 | Fetch Deal + Line Items | `n8n-nodes-base.httpRequest` | Pull CRM deal notes and pricing table |
| 3 | AI Agent — Draft Proposal | AI Agent node | Generate on-brand proposal copy |
| 4 | Render PDF | `n8n-nodes-base.htmlToPdf` / PDF service | Branded document output |
| 5 | Upload to Drive | `n8n-nodes-base.googleDrive` | Store + get shareable link |
| 6 | Log to CRM | CRM update node | Attach proposal + status |
| 7 | Queue for Send | Gmail draft / e-sign (DocuSign/PandaDoc) node | One-click send + e-sign |

```json
{"nodes":["Webhook","HTTP Request","AI Agent","HTML to PDF","Google Drive","CRM Update","Gmail"]}
```

---

## SAL-05 — Stale-Deal / Pipeline-Rot Alerter
**Price:** $850–$1,200 · **Tier:** Rung 1 template install · **Status:** spec

**Trigger:** Schedule (daily/weekly)

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | Schedule Trigger | `n8n-nodes-base.scheduleTrigger` | Daily run |
| 2 | Query Open Deals | `n8n-nodes-base.httpRequest` | Pull deals + last-activity timestamp |
| 3 | Filter Past Threshold | `n8n-nodes-base.filter` | Deals with no activity > N days |
| 4 | Group by Owner | `n8n-nodes-base.aggregate` | Build per-rep digest |
| 5 | Format Digest | `n8n-nodes-base.set` | Compose Slack blocks |
| 6 | Send Digest | `n8n-nodes-base.slack` | One message per owning rep |

```json
{"nodes":["Schedule Trigger","HTTP Request","Filter","Aggregate","Edit Fields (Set)","Slack"]}
```
