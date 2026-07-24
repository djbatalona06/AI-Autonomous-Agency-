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

### 2026-07-24 batch

*(Numbered `PRD-B09` to skip past `PRD-B07`/`PRD-B08`, which only exist in still-open
draft PRs #39/#40, not yet on `main`.)*

9. **n8n Workflow Backup & Sync to GitHub (Semantic SHAs)** — proposed `PRD-09` (new
   candidate)
   - *Inspired by:* "Back up and sync workflow JSONs with GitHub using semantic SHAs" —
     [n8n.io/workflows/17352](https://n8n.io/workflows/17352-back-up-and-sync-workflow-jsons-with-github-using-semantic-shas/).
   - *Node design:* Schedule/Manual Trigger → n8n API (list all workflows) → Filter
     (drop archived) → Code (deterministic SHA-256 per workflow from nodes/connections/
     settings) → GitHub (check target repo exists; create it if not) → GitHub (list
     existing backup files, diff against current SHAs to find new/changed/renamed/deleted)
     → GitHub (create/update files, delete stale ones).
   - *Why it's distinct:* this is meta — Yawn's own ops tooling, not a client vertical
     card, but it's the exact gap in this repo's own pipeline: every n8n build this agency
     ships today lives only in the client's n8n instance until someone manually exports
     it. This template turns that into an automatic nightly GitHub backup — a candidate to
     run against Yawn's own delivery instance first, then resell as a "workflow version
     control" retainer add-on to clients who host multiple workflows.
