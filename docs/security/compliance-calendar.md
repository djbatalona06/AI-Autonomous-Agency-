# Compliance Calendar

_Last updated: 2026-07-15 · Owner: Security Officer (CISO) · Timezone: America/Los_Angeles (WA / Pacific)_

The single source of truth for **recurring** compliance obligations and their
**next due dates**. The nightly compliance agent (a scheduled Routine, see
["How the nightly agent uses this file"](#how-the-nightly-agent-uses-this-file))
reads this table each night at 00:00 Pacific and prepares anything due **the next
day**, so we stay ahead of every deadline.

> Dates below are initial placeholders anchored to 2026-07-15. Adjust each
> `Next due` to your real deadlines — the agent trusts this column.

## Obligations

| ID | Obligation | Cadence | Recurrence | Automatable | Owner | Next due |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-AUDIT | Dependency audit — run `npm audit`, triage Dependabot PRs | Weekly | every Mon | ✅ auto | Eng | 2026-07-20 |
| BACKUP-TEST | Backup/restore verification | Weekly | every Mon | ✅ auto (CI) | Eng | 2026-07-20 |
| PATCH-REVIEW | Security patch review + approved change log | Bi-weekly | every 2nd Tue | ⚙️ prep | Eng | 2026-07-21 |
| DATAFLOW-MAP | Refresh data-flow mapping / vendor register | Quarterly | Mar/Jun/Sep/Dec 30 | ⚙️ prep | CISO/Eng | 2026-09-30 |
| ACCESS-REVIEW | Least-privilege access review | Quarterly | Mar/Jun/Sep/Dec 30 | ⚙️ prep | CISO | 2026-09-30 |
| PRIVACY-REVIEW | Privacy Policy + ToS legal review | Annual | Oct 01 | ❌ human | CISO+Counsel | 2026-10-01 |
| VENDOR-RISK | Third-party/vendor risk assessment | Annual | Oct 15 | ⚙️ prep | CISO | 2026-10-15 |
| PENTEST | External penetration test | Annual | Nov 01 | ❌ human | CISO | 2026-11-01 |
| IR-TABLETOP | Incident-response tabletop exercise | Annual | Nov 15 | ❌ human | CISO | 2026-11-15 |
| SOC2-AUDIT | SOC 2 Type II (or equivalent) audit | Annual | Dec 01 | ❌ human | CISO | 2026-12-01 |
| SEC-TRAINING | Security-awareness training | Semi-annual | Jun/Dec 31 | ⚙️ prep | CISO | 2026-12-31 |

**Automatable legend:** ✅ auto = the agent can run it end-to-end and open a draft
PR; ⚙️ prep = the agent assembles the artifact/checklist for a human to finish;
❌ human = the agent only reminds and links the runbook (external party or
sign-off required).

## How the nightly agent uses this file

The scheduled Routine fires every day at **00:00 America/Los_Angeles**. On each
run it must:

1. **Compute the target date** = today (Pacific) **+ 1 day**.
2. **Read the table above** and select every row whose `Next due` equals the
   target date. If none, send **no** notification and exit quietly.
3. **For each due obligation**, act by its `Automatable` class:
   - **✅ auto** — perform the task: `npm ci` then `npm audit --json` (triage,
     draft remediation) for `DEP-AUDIT`; `npm run test:backup-restore`-equivalent
     verification for `BACKUP-TEST`. If it produces repo changes, open a **draft
     PR** on a new branch — **never merge, never push to `main`**.
   - **⚙️ prep** — generate the checklist/artifact (e.g., a refreshed data-flow
     table, an access-review sheet from current roles) and attach it to the
     notification; do not modify the repo unless trivially safe, in which case
     use a draft PR.
   - **❌ human** — do not touch the repo; produce a readiness reminder with the
     linked runbook and what the human must do.
4. **Notify** the owner (push + email) with: what is due tomorrow, what the agent
   already did (with the draft-PR link if any), and the human action items.
5. **Roll the date forward** by editing this file: set each completed row's
   `Next due` to the next occurrence per its `Recurrence`, and open that edit as
   part of the same draft PR so the change is reviewed, not silently committed.

**Guardrails for the agent:** read-only by default; the only writes permitted are
**draft** PRs on non-default branches; escalate to a human via the notification
for anything ambiguous, out of scope, or requiring an external party. This agent
prepares and reminds — it does not certify compliance.
