# Productivity — n8n Brainstorm Log

Vertical code `PRD`. Cross-reference: `src/data/verticals.ts` → `VERTICALS.find(v => v.code === "PRD")`.

---

### 2026-07-19 batch

1. **AI Email Triage & Draft Replies** — reinforces `PRD-01`
   - *Inspired by:* "AI-powered email triage & auto-response system with OpenAI Agents and
     Gmail" — a live n8n.io template
     ([n8n.io/workflows/9157](https://n8n.io/workflows/9157-ai-powered-email-triage-and-auto-response-system-with-openai-agents-and-gmail/)).
   - *Node design:* Gmail Trigger → Text Classifier/OpenAI (urgent / follow-up / info /
     junk) → Switch (4 paths) → OpenAI draft reply → Gmail draft + Google Sheets queue →
     Slack ping for the urgent path.

2. **Meeting Transcript → Action Items → Tasks** — reinforces `PRD-02`
   - *Inspired by:* "AI meeting summary & action item tracker with Notion, Slack, and Gmail"
     ([n8n.io/workflows/10286](https://n8n.io/workflows/10286-ai-meeting-summary-and-action-item-tracker-with-notion-slack-and-gmail/))
     and the Gemini/Google Workspace variant
     ([n8n.io/workflows/5904](https://n8n.io/workflows/5904-transform-meeting-notes-into-action-items-with-gemini-and-google-workspace/)).
   - *Node design:* Webhook (Zoom/Otter/Fireflies transcript) → OpenAI (extract summary,
     decisions, action items with owners + due dates) → Split → Notion/ClickUp/Linear create
     task → Google Calendar due-date event → Slack recap.

3. **7 AM AI Daily Brief** — reinforces `PRD-03` (already `built`)
   - *Inspired by:* "AI-powered calendar & meeting digest" ([n8n.io/workflows/4385](https://n8n.io/workflows/4385-ai-powered-calendar-and-meeting-digest-with-gmail-and-gpt-4oclaude-daily-brief/))
     and "Automated daily briefing with Todoist, Google Calendar & GPT-4o"
     ([n8n.io/workflows/6133](https://n8n.io/workflows/6133-automated-daily-briefing-with-todoist-google-calendar-and-gpt-4o-via-gmail/)).
   - *Node design:* Schedule Trigger (7 AM) → Google Calendar (today's events) + Gmail
     (unread/urgent) + Todoist/Asana (tasks due) → OpenAI (synthesize a prioritized brief) →
     Slack DM / WhatsApp / Email send.
   - *Note:* this card is already built — treat these as hardening ideas (add the
     WhatsApp-delivery branch, add a weather/news enrichment step) rather than a rebuild.

4. **Doc & Report Generator on Schedule** — reinforces `PRD-04`
   - *Inspired by:* the recurring "scheduled report → Google Doc" pattern in productivity
     template roundups (pull live metrics, narrate with AI, populate a branded template).
   - *Node design:* Schedule Trigger → Google Sheets/DB (pull live metrics) → OpenAI
     (narrative summary) → Google Docs (populate template) → Drive save + Slack link.

5. **Inbound File → Structured Data → Sheet** — reinforces `PRD-05`
   - *Inspired by:* the "expense receipt / invoice email → spreadsheet" pattern that appears
     across nearly every small-business and productivity template list checked this run.
   - *Node design:* Gmail/Drive Trigger (new attachment) → HTTP Request (LlamaParse/OCR) →
     OpenAI (extract + validate fields) → IF (confidence below threshold → flag row for a
     human) → Google Sheets append.

**New-candidate watch:** nothing distinct enough surfaced beyond `PRD-01..05` this run —
next pass should look at Slack-thread-to-task and "AI personal assistant" multi-agent
orchestrator patterns (seen in n8n.io/workflows/4723) as a possible higher-tier bundle.

---

### 2026-07-21 batch

6. **Voice Memo → Structured Brief & Task Capture** — *new candidate, no card yet
   (proposed `PRD-06`)*
   - *Inspired by:* the "capture → transcribe → structure" voice-memo pattern documented in
     2026 founder-productivity write-ups, paired with n8n's built-in Speech-to-Text node.
   - *Node design:* Telegram/WhatsApp voice-note Trigger (or Google Drive new-audio-file
     trigger) → Speech-to-Text (Whisper) → OpenAI (structure into a brief: goal, context,
     next steps, owner) → Notion/Google Docs (create the brief) → ClickUp/Todoist (create a
     task per action item) → Slack/Telegram confirmation.
   - *Why it's worth building:* solopreneur and agency-owner clients think out loud in the
     car/on walks — this is the only card in `PRD` that captures ideas at the point of
     speech rather than after they've already sat down at a desk.

---

### 2026-07-23 batch

7. **Notion AI Assistant via MCP for Task & Content Management** — proposed `PRD-07` (new
   candidate)
   - *Inspired by:* "Create a Notion AI assistant with Google Gemini for managing tasks &
     content" —
     [n8n.io/workflows/4857](https://n8n.io/workflows/4857-create-a-notion-ai-assistant-with-google-gemini-for-managing-tasks-and-content/).
     Preview screenshot published by the template author:
     ![Notion AI assistant workflow canvas](https://n8niostorageaccount.blob.core.windows.net/n8nio-strapi-blobs-prod/assets/Screenshot_2025_06_10_at_15_11_56_44128748dc.png)
   - *Node design:* Chat Trigger (chat UI, or Telegram/Slack front-end) → AI Agent
     (Gemini/Claude) parses the request → Notion MCP Server (community node) creates/
     retrieves/updates pages & databases → Switch (route by action type) → chat response
     confirming the action.
   - *Why it's distinct:* `PRD-B01..B06` all write *into* a tool on a trigger; this is the
     first two-way, conversational surface — turns the client's own Notion workspace into
     an agent instead of a target. Setup is a single MCP connection, which makes it cheap
     retainer-tier work once built once.
