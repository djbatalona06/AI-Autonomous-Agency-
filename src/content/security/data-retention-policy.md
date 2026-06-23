# Data Retention Policy

_Last updated: 2026-06-22 · Owner: Security Officer (CISO)_

This policy defines how long Yawn AI Agency keeps each type of data and how it is deleted. We keep data only as long as it serves the user or a legal obligation, then remove it. Data types map to the tables in `server/schema.ts` (users, image generations, web scrapes) and supporting systems (logs, backups).

## 1. Retention Periods by Data Type

| Data type | Where it lives | Retention | Rationale |
| --- | --- | --- | --- |
| **User account** (email, name, role, password hash, MFA secret) | `users` table | For the life of the account; deleted on account closure (or after **12 months** of inactivity with notice). | Needed to authenticate and operate the account. |
| **Image generations** (prompt, image URL/key, metadata) | `image_generations` table | While the account is active; user can delete individual items at any time. | User's own work product / history. |
| **Web scrapes** (URL, raw content, summary, intelligence) | `web_scrapes` table | While the account is active; user-deletable. | User's research history; raw scraped content is the largest footprint, so deletion is honored promptly. |
| **Application / request logs** (structured logs from `server/_core/logging.ts`) | Vercel logs / log store | **30 days** rolling, then purged. Logs exclude passwords and secrets by design. | Operational troubleshooting and security monitoring. |
| **Backups** (database) | Supabase PITR + encrypted backups | See [`backup-recovery-policy.md`](backup-recovery-policy.md) — PITR window plus periodic snapshots, then expired. | Recovery from failure or incident. |
| **Security / incident records & postmortems** | Internal docs | Retained **2 years**. | Audit trail and learning. |

LLM and scraping vendors (Anthropic, OpenAI, Firecrawl) process prompts/content transiently to fulfill a request; we do not direct them to retain it for training, and their handling is tracked in the [vendor register](../../docs/security/vendor-register.md) and disclosed in the [Privacy Policy](privacy-policy.md).

## 2. Data Deletion Procedures

- **User-initiated** — a user may delete individual image generations or web scrapes from their history, or request full account deletion via the app or `batalona06@gmail.com`.
- **Account deletion** — removes the user record and all associated `image_generations` and `web_scrapes` rows. Stored image assets keyed to the account are removed. Deletion is completed within **30 days** of a verified request.
- **Method** — deletions are hard deletes from the primary store. Data already written to backups ages out within the backup retention window (it is not separately surgically removed from immutable backups, but is purged when those backups expire).
- A deletion request that conflicts with an active legal hold (below) is paused until the hold lifts; the requester is informed of the delay where permitted.

## 3. Backup Retention

- Backup schedule, encryption, and recovery testing are defined in [`backup-recovery-policy.md`](backup-recovery-policy.md).
- Supabase Point-in-Time Recovery retains a continuous recovery window; periodic encrypted snapshots are retained on a rolling basis and then expired. Expired backups are unrecoverable, which is what allows deleted data to fully age out.

## 4. Legal Hold

- If Yawn becomes aware of litigation, an investigation, or a legal/regulatory obligation requiring preservation, the CISO places a **legal hold** on the relevant data.
- While a hold is active, the affected data is exempt from routine deletion and retention expiry, regardless of user requests.
- The hold is documented (scope, reason, date) and lifted in writing once the obligation ends, after which normal retention resumes.
