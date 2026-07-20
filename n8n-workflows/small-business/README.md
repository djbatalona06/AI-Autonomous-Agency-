# Small Business — Node Designs (SMB)

Vertical code `SMB` · buyer: 5–50 employee local & service firms.
Mirrors `src/data/verticals.ts` → `VERTICALS.find(v => v.code === "SMB")`.

---

## SMB-01 — Client Intake → Booking + Confirmation
**Price:** $750–$1,000 · **Tier:** Rung 1 · **Status:** spec

**Trigger:** Webhook (inquiry form / Facebook Lead Ad)

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | Inquiry Webhook | `n8n-nodes-base.webhook` | New inquiry captured |
| 2 | Dedupe Against CRM | `n8n-nodes-base.if` | Check existing contact via Sheets/Redis cache |
| 3 | Log Contact | `n8n-nodes-base.googleSheets` | Zero double-entry system of record |
| 4 | Generate Booking Link | Cal.com node | One-click bookable slot |
| 5 | Send via WhatsApp/SMS | Twilio/WhatsApp node | Deliver link instantly |
| 6 | Confirm on Booking | `n8n-nodes-base.webhook` (Cal.com booked) | Mark contact "booked" |

```json
{"nodes":["Webhook","If","Google Sheets","Cal.com","Redis","Webhook"]}
```
*Inspiration: directly modeled on the live trending template "Send WhatsApp booking links for Facebook leads with Sheets, Redis, and Cal.com" (n8n.io/workflows/17181) — same dedupe-cache-then-book shape.*

---

## SMB-02 — Invoice → Payment → Auto Follow-Up
**Price:** $850–$1,200 · **Tier:** Rung 1 · **Status:** spec

**Trigger:** Webhook (QuickBooks/Stripe new invoice)

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | Invoice Webhook | `n8n-nodes-base.webhook` | New invoice created |
| 2 | Wait to Day 1/7/14 | `n8n-nodes-base.wait` | Reminder cadence |
| 3 | Conditional: Paid? | `n8n-nodes-base.if` | Stops chase once paid |
| 4 | Send Branded Reminder | Gmail node | Polite escalating tone |
| 5 | Track Status | `n8n-nodes-base.googleSheets` | Per-invoice log |
| 6 | Escalate Day 14 | `n8n-nodes-base.slack` | Owner alert if still unpaid |

```json
{"nodes":["Webhook","Wait","If","Gmail","Google Sheets","Wait","If","Slack"]}
```
*Inspiration: same trigger→track→escalate shape as the live trending template "Send and track Slack invoice requests with Gemini, Google Sheets and Gmail" (n8n.io/workflows/17192).*

---

## SMB-03 — New-Hire Onboarding Orchestration
**Price:** $1,500–$2,500 · **Tier:** Simple/Medium · **Status:** spec

**Trigger:** Google Sheets row added (or BambooHR webhook)

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | Sheets Trigger | `n8n-nodes-base.googleSheetsTrigger` | New hire row added |
| 2 | Send Welcome Email | `n8n-nodes-base.gmail` | Day-1 welcome |
| 3 | Create Accounts Checklist | `n8n-nodes-base.notion` | Onboarding checklist page |
| 4 | Book Day-1 Meeting | `n8n-nodes-base.googleCalendar` | Auto-scheduled intro |
| 5 | DM Manager | `n8n-nodes-base.slack` | Heads-up with checklist link |

```json
{"nodes":["Google Sheets Trigger","Gmail","Notion","Google Calendar","Slack"]}
```

---

## SMB-04 — Review & Reputation Engine
**Price:** $2,000–$3,000 · **Tier:** Medium · **Status:** spec

**Trigger:** Webhook/schedule (post-service completion)

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | Job-Complete Trigger | `n8n-nodes-base.webhook` | Service marked done |
| 2 | Wait 1 Day | `n8n-nodes-base.wait` | Post-service buffer |
| 3 | Send CSAT Micro-Survey | Email/SMS node | 1-tap star rating |
| 4 | Switch: Rating | `n8n-nodes-base.switch` | Happy vs unhappy branch |
| 5a | Nudge to Google/Yelp | Email node | Direct link to public review |
| 5b | Route to Owner | `n8n-nodes-base.slack` | Private catch before it goes public |

```json
{"nodes":["Webhook","Wait","Gmail","Switch","Gmail","Slack"]}
```

---

## SMB-05 — Appointment No-Show Reducer
**Price:** $850–$1,200 · **Tier:** Rung 1 · **Status:** spec

**Trigger:** Calendar event created

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | Calendar Trigger | `n8n-nodes-base.googleCalendarTrigger` | New appointment booked |
| 2 | Wait Until 24h Before | `n8n-nodes-base.wait` | First reminder window |
| 3 | Send Reminder + Confirm/Reschedule | SMS/Email node | One-tap action links |
| 4 | Wait Until 2h Before | `n8n-nodes-base.wait` | Second reminder window |
| 5 | Conditional: No Response? | `n8n-nodes-base.if` | Detect silent no-shows |
| 6 | Nudge to Rebook | Gmail/SMS node | Recover the slot instead of losing it |

```json
{"nodes":["Google Calendar Trigger","Wait","Twilio","Wait","If","Gmail"]}
```
*Inspiration: same reschedule-detection shape as the live trending template "Reschedule calendar appointments with Google Sheets and Google Calendar" (n8n.io/workflows/17179).*
