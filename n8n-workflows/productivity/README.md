# Productivity — Node Designs (PRD)

Vertical code `PRD` · buyer: solopreneurs, knowledge workers, ops leads.
Mirrors `src/data/verticals.ts` → `VERTICALS.find(v => v.code === "PRD")`.

---

## PRD-01 — AI Email Triage & Response Drafts
**Price:** $1,000–$1,500 · **Tier:** Simple/Medium · **Status:** spec

**Trigger:** Gmail Trigger (new mail)

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | Gmail Trigger | `n8n-nodes-base.gmailTrigger` | New inbound email |
| 2 | AI Agent — Classify | AI Agent / OpenAI Chat Model | urgent / follow-up / info / junk |
| 3 | Switch (4 paths) | `n8n-nodes-base.switch` | Route by classification |
| 4 | AI Agent — Draft Reply | AI Agent node | Non-junk paths only |
| 5 | Queue in Sheet | `n8n-nodes-base.googleSheets` | Human-review queue, 1-click send |
| 6 | Conditional Slack Ping | `n8n-nodes-base.if` + Slack | Only for "urgent" path |

```json
{"nodes":["Gmail Trigger","AI Agent","Switch","AI Agent","Google Sheets","If","Slack"]}
```
*Inspiration: matches the live trending template "Basic automatic Gmail email labelling with OpenAI and Gmail API" (n8n.io/workflows/2740) — this design extends it from labelling into a full triage + draft-reply queue.*

---

## PRD-02 — Meeting Transcript → Action Items → Tasks
**Price:** $1,800–$2,600 · **Tier:** Medium · **Status:** spec

**Trigger:** Webhook (Fireflies/Otter/Zoom transcript-ready)

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | Transcript Webhook | `n8n-nodes-base.webhook` | Fires when transcript is ready |
| 2 | Fetch Full Transcript | `n8n-nodes-base.httpRequest` | Pull complete text |
| 3 | AI Agent — Extract Action Items | AI Agent node | Structured task list output |
| 4 | Loop Over Items | `n8n-nodes-base.splitInBatches` | One task per action item |
| 5 | Create Task | Notion/ClickUp/Linear node | Push each item to PM tool |
| 6 | Post Recap | `n8n-nodes-base.slack` | Summary + links in channel |

```json
{"nodes":["Webhook","HTTP Request","AI Agent","Loop Over Items (Split in Batches)","Notion","Slack"]}
```

---

## PRD-03 — 7 AM AI Daily Brief
**Price:** $850–$1,200 · **Tier:** Rung 1 · **Status:** built ✅

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | Schedule Trigger (7am) | `n8n-nodes-base.scheduleTrigger` | Daily fire |
| 2 | Fetch Calendar | `n8n-nodes-base.googleCalendar` | Today's meetings |
| 3 | Fetch Inbox Needing Reply | Gmail node | Filtered/starred query |
| 4 | Fetch Tasks Due | Notion/ClickUp node | Due-today items |
| 5 | AI Agent — Prioritize & Summarize | AI Agent node | Merge into one brief |
| 6 | Send Slack DM | `n8n-nodes-base.slack` | Delivered before coffee |

```json
{"nodes":["Schedule Trigger","Google Calendar","Gmail","Notion","AI Agent","Slack"]}
```
*Already built and shipped — reference pattern for the AI-Agent-as-summarizer shape used elsewhere in this vertical.*

---

## PRD-04 — Doc & Report Generator
**Price:** $2,200–$3,200 · **Tier:** Medium · **Status:** spec

**Trigger:** Schedule (weekly/monthly)

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | Schedule Trigger | `n8n-nodes-base.scheduleTrigger` | Reporting cadence |
| 2 | Fetch Live Data | `n8n-nodes-base.httpRequest` / Google Sheets | Pull source metrics |
| 3 | AI Agent — Populate Template | AI Agent node | Fill template with narrative + data |
| 4 | Generate Google Doc | `n8n-nodes-base.googleDocs` | Formatted output |
| 5 | Move to Drive Folder | `n8n-nodes-base.googleDrive` | File in the right folder |
| 6 | Link in Slack | `n8n-nodes-base.slack` | Notify with doc link |

```json
{"nodes":["Schedule Trigger","Google Sheets","AI Agent","Google Docs","Google Drive","Slack"]}
```
*Inspiration: same RSS-to-formatted-output shape as the live "Draft weekly blog newsletter digests from RSS with OpenAI-compatible APIs" template (n8n.io/workflows/17169), generalized from newsletters to internal reports.*

---

## PRD-05 — Inbound PDF/File → Structured Data → Sheet
**Price:** $3,600–$4,800 · **Tier:** Complex · **Status:** slot (open build slot)

**Trigger:** Email attachment / Drive-folder watch

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | Drive Trigger | `n8n-nodes-base.googleDriveTrigger` | New file in watched folder |
| 2 | Convert PDF → Text | HTTP Request (LlamaCloud/parser API) | Extract raw text |
| 3 | AI Agent — Extract Fields | AI Agent node | Structured JSON per schema |
| 4 | Validate Fields | `n8n-nodes-base.if` | Confidence threshold check |
| 5 | Append Row | `n8n-nodes-base.googleSheets` | High-confidence rows auto-appended |
| 6 | Flag for Human | `n8n-nodes-base.slack` | Low-confidence rows routed to review |

```json
{"nodes":["Google Drive Trigger","HTTP Request","AI Agent","If","Google Sheets","Slack"]}
```
*Inspiration: directly modeled on the live trending template "Pdf to markdown converter with LlamaCloud parser" (n8n.io/workflows/11811) — this design adds the extraction + validation + sheet-append layer on top.*
