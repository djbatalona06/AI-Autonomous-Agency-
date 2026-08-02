# Hermes Agent — Local Setup, Mobile Gateway & Obsidian "Second Brain" Sync

This is DJ Batalona's implementation plan for a fully local Hermes Agent system on his desktop,
accessible via mobile through messaging gateways, and synchronized with this Obsidian vault
(`obsidian-vault/` in `djbatalona06/AI-Autonomous-Agency-`) for a persistent Second Brain. It's
written so the resulting identity works whether the agent running it ends up being **Hermes**
(local CLI) or **Claude Code** (this repo's existing Claude tooling).

---

### Phase 0: Identity Snapshot

Compiled by scanning DJ's 5 repos on 2026-08-02. Full detail lives in the notes below — this is
the quick-reference version so Phase 4's identity files don't have to be re-derived from scratch.

| Fact | Source | Confidence |
| --- | --- | --- |
| DJ Batalona, batalona06@gmail.com | matches session identity across all repos | confirmed |
| Runs two ventures: Untapped Market (cannabis discovery app) + Yawn (n8n automation agency) | `untapped-market`, `AI-Autonomous-Agency-` | confirmed |
| Based in Puget Sound / Seattle, WA area | inferred from target-city lists + PNW template content | inferred — verify |
| Also actively job-hunting (Ops + Tech resumes on file) | `untapped-market/job-finder/resumes/` | confirmed |
| Technical, prefers detailed/explained output | `.claude/identity.json` "ecc-tools" bundles, repeated across repos | medium confidence (machine-generated) |
| Built a personal study PWA for someone named Jenny | `jenny-s-study-guide` | confirmed app exists; relationship inferred — verify |
| Has a real, actively-synced Obsidian vault already (`obsidian-vault/n8n-templates/`) | `AI-Autonomous-Agency-` | confirmed |

Full detail: [[User]], [[Projects/Untapped Market]], [[Projects/Yawn (AI Autonomous Agency)]],
[[Projects/CIS155 DOOM Site]], [[People/Jenny]], [[Knowledge/Tech Stack]].

---

### Phase 1: Environment & Dependencies

To run Hermes locally with high reliability, hardware should ideally have at least
**16GB–32GB of RAM** and an NVIDIA GPU with **8GB–24GB of VRAM**.

1. **Inference Engine (The Brain):** Install **Ollama** or **LM Studio**. Ollama is the
   recommended backend for 2026, serving as the local model provider.
2. **Model Selection:** Pull **Qwen 3.6 (14B or 32B)** for the best balance of reasoning and
   speed, or **Hermes 4.3 36B** for native agentic tool-calling.
3. **Local Isolation:** Run Hermes inside a **Docker container** to keep it isolated from the
   primary system files while allowing it to think it has full access.
4. **CLI Tools:** Ensure `git`, `curl`, `ffmpeg`, and `ripgrep` are installed on the host machine
   to support file operations and media processing.

---

### Phase 2: Local Application Setup

#### 1. Configure the Inference Backend
Hermes requires a large context window to manage the Second Brain.
- **Ollama:** Launch with `OLLAMA_CONTEXT_LENGTH=64000 ollama serve` to prevent the agent from
  "going senile" mid-task.
- **Model Pull:** `ollama pull qwen3:14b` (or the chosen model).

#### 2. Install Hermes Agent
Run the official one-line install script. During the **Quick Setup** wizard:
- **Provider:** Select **Custom Endpoint**.
- **Base URL:** `http://localhost:11434/v1`.
- **Model:** the exact name pulled (e.g. `qwen3:14b`).
- **Sandbox:** **Docker isolated container** for safety.

#### 3. Mobile Access (The Gateway)
Hermes doesn't have a standalone mobile app — it uses **Messaging Gateways** for a mobile
interface.
- **Telegram Setup:** Create a bot via **@BotFather**, obtain the API token, add it to
  `~/.hermes/config.yaml`.
- **Launch:** `hermes gateway` to make the agent reachable from your phone via Telegram,
  WhatsApp, or Discord.

---

### Phase 3: Obsidian Vault Synchronization

This vault (`obsidian-vault/` in `AI-Autonomous-Agency-`) is already a real, git-tracked,
partially-automated Obsidian vault — `obsidian-vault/n8n-templates/` gets synced into it daily by
`.github/workflows/n8n-brainstorm-scrape.yml`. The plan below extends that existing setup rather
than replacing it.

1. **Vault structure:** `People/`, `Projects/`, `Decisions/`, `Companies/`, `Meetings/`,
   `Daily/`, `Knowledge/` (added by this update), plus the pre-existing `n8n-templates/`.
2. **GitHub link:** the vault already lives in a git repo (`AI-Autonomous-Agency-`). In Hermes,
   use `hermes config set` to securely store a **GitHub Personal Access Token** scoped to this
   repo for push access.
3. **Automated backup (cron):** instruct Hermes: *"Every night at 12 AM, push all changes from
   my local clone of AI-Autonomous-Agency-'s obsidian-vault folder to GitHub."* Note the
   n8n-brainstorm sync already runs at 12:00 AM America/Los_Angeles — stagger this job to avoid
   racing it (e.g. 12:15 AM).
4. **Local access:** point Hermes's working directory (`cwd`) at the local clone of
   `AI-Autonomous-Agency-`, specifically the `obsidian-vault/` subfolder, in `config.yaml`.

---

### Phase 4: Context & Identity Documents

Three files at the vault root act as the agent's "constitution." Unlike a fresh template, these
are pre-filled with DJ's actual context (compiled in Phase 0) so the agent doesn't start blank —
DJ should still read and correct them, especially anything marked "inferred — verify."

#### A. [[User]] (The "Who")
Role (dual-venture founder + active job-seeker), technical level, communication-style signal, and
personal context (Jenny's Study Guide, CIS155). Prevents re-explaining context every session.

#### B. [[Soul]] (The "Vibe")
Tone: part cofounder, part Chief of Staff. Direct, no hedging words, "challenge decisions with
love," protect the two ventures' brand voices and Untapped Market's investor-facing numbers.

#### C. [[Agent]] (The "Mission")
Works for **either** runtime:
- **Hermes path:** `hermes config set cwd <path-to-local-clone>/AI-Autonomous-Agency-/obsidian-vault`,
  then `hermes gateway` for mobile reachability.
- **Claude Code path:** this repo already has `.claude/` tooling; Claude Code sessions opened
  against `AI-Autonomous-Agency-` read this vault directly via the filesystem/GitHub MCP tools —
  no separate config needed, just point a session at this repo.

Scoped goals: Untapped Market dev/fundraising support, Yawn agency client/template work
(respecting the existing n8n-brainstorm auto-sync — don't restructure `n8n-templates/`), and
lower-priority personal-project support (Jenny's Study Guide, CIS155 site).

---

### Phase 5: Maintenance & The Self-Improving Loop

- **Daily pruning:** nightly cron (11:00 PM) — read notes added that day, find orphan notes,
  consolidate duplicates, update Maps of Content (MOC). Skip `n8n-templates/` — it's
  machine-managed by its own workflow, don't merge pruning logic into it.
- **Skill creation:** after a complex task (e.g. "sort these PDFs by date"), tell Hermes: *"Save
  this workflow as a permanent skill called 'file-organizer.'"* It becomes a reusable command.
- **Context management:** if the agent gets verbose or off-tone, edit [[Soul]] directly. If it
  forgets a project fact, update [[Agent]]. If a fact in Phase 0 turns out wrong, fix it there
  first — that table is the source both [[User]] and [[Agent]] were drafted from.
