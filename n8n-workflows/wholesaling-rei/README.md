# Wholesaling / REI — Node Designs (WHL)

Vertical code `WHL` · buyer: wholesalers, investors, acquisition & dispo teams. **Flagship vertical** — theWRENCH / Vertex Supply warm-network play (see `n8n-automation-business` skill → `references/templates.md` Template 6).

Mirrors `src/data/verticals.ts` → `VERTICALS.find(v => v.code === "WHL")`.

> **Scrape note:** n8n's public template gallery skews SaaS/marketing/AI-ops — it has essentially no real-estate/wholesaling-specific templates. These five designs are agency-original builds (not lifted from the gallery), with node shapes borrowed from adjacent trending patterns where noted. This matches the skill's own guidance that WHL-01 is the highest-margin *custom* build, not an installable template.

---

## WHL-01 — AI Lead Follow-Up Sequence
**Price:** $1,250–$1,750 · **Tier:** Complex (5 integrations, AI, multi-channel) · **Status:** built ✅ · flagship ⭐

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | Lead Webhook | `n8n-nodes-base.webhook` | Podio/REISift/InvestorLift/PropStream/direct |
| 2 | AI Agent — Personalize Opener | AI Agent (OpenAI) | Generate opener from property address + source |
| 3 | Send SMS (Day 1) | Twilio node | Immediate first touch |
| 4 | Send Email (Day 1) | SendGrid node | Parallel channel |
| 5 | Wait → Day 3 Email | `n8n-nodes-base.wait` + SendGrid | Cadence continues |
| 6 | Wait → Day 7 Voicemail + SMS | `n8n-nodes-base.wait` + Slybroadcast + Twilio | Multi-channel touch |
| 7 | Conditional: Responded? | `n8n-nodes-base.if` | Checks CRM reply flag |
| 8 | Update CRM Status | CRM node | Mark "Hot" on any response |
| 9 | Wait → Day 14 Email | `n8n-nodes-base.wait` + SendGrid | Final cadence touch |
| 10 | Log Activity | `n8n-nodes-base.googleSheets` | Full-cadence audit trail |

```json
{"nodes":["Webhook","AI Agent","Twilio","SendGrid","Wait","Slybroadcast","If","CRM Update","Wait","Google Sheets"]}
```
*Already built and shipped — the reference pattern this entire vertical is built around.*

---

## WHL-02 — Cash-Buyer Dispo Blast + Match
**Price:** $2,000–$3,500 · **Tier:** Medium/Complex · **Status:** spec

**Trigger:** Webhook (new deal under contract)

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | New Deal Webhook | `n8n-nodes-base.webhook` | Deal marked under contract |
| 2 | Fetch Cash-Buyer DB | `n8n-nodes-base.googleSheets` / Postgres | Buy-box criteria per buyer |
| 3 | AI Agent — Match Buy Box | AI Agent node | Score deal against each buyer's criteria |
| 4 | Filter Matches | `n8n-nodes-base.filter` | Only buyers whose box fits |
| 5 | Loop Over Matches | `n8n-nodes-base.splitInBatches` | One send per matched buyer |
| 6 | Send Blast | Email/SMS node | Property details + comps |
| 7 | Log Responses | `n8n-nodes-base.googleSheets` | Track buyer interest |

```json
{"nodes":["Webhook","Google Sheets","AI Agent","Filter","Loop Over Items (Split in Batches)","Gmail","Google Sheets"]}
```

---

## WHL-03 — Skip-Trace / Owner-Lookup Intake
**Price:** $2,000–$3,000 · **Tier:** Medium · **Status:** spec

**Trigger:** Webhook (new lead / list import)

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | Lead Intake Webhook | `n8n-nodes-base.webhook` | New raw lead/address |
| 2 | Dedupe Against CRM | `n8n-nodes-base.if` | Skip already-known owners |
| 3 | Skip-Trace API Call | `n8n-nodes-base.httpRequest` | Owner phone/email/mailing lookup |
| 4 | Normalize Fields | `n8n-nodes-base.set` | Canonical owner record shape |
| 5 | Create CRM Contact | CRM node | Drop into follow-up pipeline |
| 6 | Queue for Follow-Up | Trigger `WHL-01` | Hand off to lead follow-up sequence |

```json
{"nodes":["Webhook","If","HTTP Request","Edit Fields (Set)","CRM Create","Execute Workflow"]}
```

---

## WHL-04 — County / Motivated-List Ingestion + Dedupe
**Price:** $850–$1,250 · **Tier:** Rung 1 · **Status:** spec

**Trigger:** Schedule (weekly)

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | Schedule Trigger | `n8n-nodes-base.scheduleTrigger` | Weekly pull |
| 2 | Fetch County/List Source | `n8n-nodes-base.httpRequest` | Probate, pre-foreclosure, code-violation feeds |
| 3 | Normalize Records | `n8n-nodes-base.set` | Canonical address/owner schema |
| 4 | Dedupe Against CRM | `n8n-nodes-base.filter` | Drop already-known records |
| 5 | Enrich New Records | `n8n-nodes-base.httpRequest` | Skip-trace the genuinely-new ones |
| 6 | Drop Into Pipeline | CRM create node | New leads land in the queue |

```json
{"nodes":["Schedule Trigger","HTTP Request","Edit Fields (Set)","Filter","HTTP Request","CRM Create"]}
```
*Inspiration: source-monitor → normalize → filter → alert shape borrowed from the live trending template "Monitor crypto news risk with CoinDesk RSS, OpenAI, Gmail, and Google Sheets" (n8n.io/workflows/17174) — same feed-monitoring pattern, retargeted from RSS news to county records.*

---

## WHL-05 — Deal Analyzer Intake → ARV/MAO Brief
**Price:** $3,500–$4,500 · **Tier:** Complex · **Status:** slot (open build slot)

**Trigger:** Webhook (address submitted)

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | Address Webhook | `n8n-nodes-base.webhook` | Rep submits an address |
| 2 | Fetch Comps | `n8n-nodes-base.httpRequest` | Comp API (ATTOM/PropStream) |
| 3 | AI Agent — Compute ARV/MAO | AI Agent node | Consistent comp-weighted valuation |
| 4 | Estimate Rehab | `n8n-nodes-base.httpRequest` / AI Agent | Condition-based rehab estimate |
| 5 | Render PDF Brief | `n8n-nodes-base.htmlToPdf` | Comps + ARV + MAO + rehab, one page |
| 6 | Save to Drive | `n8n-nodes-base.googleDrive` | Store the brief |
| 7 | Log for Team | `n8n-nodes-base.googleSheets` | Deal-analysis audit trail |

```json
{"nodes":["Webhook","HTTP Request","AI Agent","HTTP Request","HTML to PDF","Google Drive","Google Sheets"]}
```
