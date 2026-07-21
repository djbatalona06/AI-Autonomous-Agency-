# E-commerce — Node Designs (ECM)

Vertical code `ECM` · buyer: Shopify/Woo store owners doing $5K+/mo.
Mirrors `src/data/verticals.ts` → `VERTICALS.find(v => v.code === "ECM")`.

---

## ECM-01 — Abandoned Cart Recovery
**Price:** $1,000–$1,500 · **Tier:** Rung 1/2 border · **Status:** spec

**Trigger:** Shopify `checkouts/create` + `checkouts/update` webhook

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | Cart Webhook | `n8n-nodes-base.webhook` (Shopify) | Fires on abandoned checkout |
| 2 | Wait 1hr | `n8n-nodes-base.wait` | Touch 1 delay |
| 3 | Conditional: Purchased? | `n8n-nodes-base.if` | Stop if order completed |
| 4 | Send Email (Touch 1) | Gmail/Klaviyo node | Reminder, no discount |
| 5 | Wait 24hr → Touch 2 | `n8n-nodes-base.wait` + email | Second reminder |
| 6 | Wait 72hr → Touch 3 + Discount | `n8n-nodes-base.wait` + email | Discount code included |
| 7 | Log to Sheet | `n8n-nodes-base.googleSheets` | Recovery funnel tracking |

```json
{"nodes":["Webhook","Wait","If","Gmail","Wait","Gmail","Wait","Edit Fields (Set)","Gmail","Google Sheets"]}
```

---

## ECM-02 — Post-Purchase Review & UGC Request
**Price:** $1,100–$1,600 · **Tier:** Simple/Medium · **Status:** spec

**Trigger:** Shopify `orders/fulfilled` webhook

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | Fulfillment Webhook | `n8n-nodes-base.webhook` | Order delivered signal |
| 2 | Wait N Days | `n8n-nodes-base.wait` | Post-delivery buffer |
| 3 | Send Review Request | Email/SMS node | Ask for review + photo |
| 4 | Capture Response | `n8n-nodes-base.webhook` (form) | Star rating + text |
| 5 | Switch: Rating Sentiment | `n8n-nodes-base.switch` | Happy vs unhappy branch |
| 6a | Route to Public Review | HTTP Request (Shopify/Judge.me API) | Post rating publicly |
| 6b | Route to Support | `n8n-nodes-base.slack` | Unhappy customers caught privately |

```json
{"nodes":["Webhook","Wait","Gmail","Webhook","Switch","HTTP Request","Slack"]}
```

---

## ECM-03 — Order-Status & Shipping-Update Comms
**Price:** $750–$1,000 · **Tier:** Rung 1 · **Status:** built ✅

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | Shipping Webhook | `n8n-nodes-base.webhook` (ShipStation/Shopify) | Milestone event (label created, in transit, delivered) |
| 2 | Switch: Milestone Type | `n8n-nodes-base.switch` | Branch per status |
| 3 | Render Branded Template | `n8n-nodes-base.set` | Merge tracking data into copy |
| 4 | Send Email | Gmail/SendGrid node | Branded status email |
| 5 | Log Event | `n8n-nodes-base.googleSheets` | Ticket-deflection tracking |

```json
{"nodes":["Webhook","Switch","Edit Fields (Set)","Gmail","Google Sheets"]}
```
*Already built and shipped — kept here as the reference pattern for the other four.*

---

## ECM-04 — Low-Stock + Restock Alert
**Price:** $2,000–$3,000 · **Tier:** Medium · **Status:** spec

**Trigger:** Schedule (hourly) + inventory webhook

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | Schedule/Inventory Trigger | `n8n-nodes-base.scheduleTrigger` | Poll Shopify inventory levels |
| 2 | Fetch Inventory | `n8n-nodes-base.httpRequest` | Shopify Admin API |
| 3 | Filter Below Threshold | `n8n-nodes-base.filter` | SKUs under reorder point |
| 4 | Alert Owner | `n8n-nodes-base.slack` | Real-time low-stock ping |
| 5 | Watch Restock | `n8n-nodes-base.if` | Detect quantity back above 0 |
| 6 | Blast Waitlist | Klaviyo/Gmail node | "Back in stock" email to waitlist |

```json
{"nodes":["Schedule Trigger","HTTP Request","Filter","Slack","If","Gmail"]}
```

---

## ECM-05 — AI Win-Back / Reactivation
**Price:** $1,800–$2,800 · **Tier:** Medium · **Status:** spec

**Trigger:** Schedule (weekly)

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | Schedule Trigger | `n8n-nodes-base.scheduleTrigger` | Weekly run |
| 2 | Query Customers | `n8n-nodes-base.httpRequest` | Shopify customers past typical reorder window |
| 3 | Fetch Order History | `n8n-nodes-base.httpRequest` | Pull last purchased items per customer |
| 4 | AI Agent — Personalize Offer | AI Agent node | Reference exact prior purchase |
| 5 | Send Win-Back Email | Klaviyo/Gmail node | Personalized offer send |
| 6 | Log to Sheet | `n8n-nodes-base.googleSheets` | Reactivation funnel tracking |

```json
{"nodes":["Schedule Trigger","HTTP Request","HTTP Request","AI Agent","Gmail","Google Sheets"]}
```
*Inspiration: personalization-from-history pattern mirrors the scraped "Talk to your Google Sheets using ChatGPT-5" (n8n.io/workflows/7639) — same AI Agent-over-tabular-data shape, applied to order history instead of ad-hoc Sheet Q&A.*
