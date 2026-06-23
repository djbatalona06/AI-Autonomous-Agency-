# Data Classification

_Last updated: 2026-06-22 · Owner: Security Officer (CISO)_

Every piece of data Yawn handles is assigned one of four tiers. The tier
dictates how it is stored, who can access it, and how it is logged.

## Tiers

| Tier | Definition | Examples in Yawn |
| --- | --- | --- |
| **Restricted** | Compromise causes severe harm; secrets and credentials. | `password_hash` (Argon2id), `mfa_secret`, `mfa_recovery_hashes`, reset `token_hash`, `SESSION_SECRET`, provider API keys, Supabase service-role key |
| **Confidential** | Private user data; compromise harms a user. | User email, account profile, image generations, web-scrape content & competitive intelligence, audit log |
| **Internal** | Operational data not meant for the public. | Server request logs (metadata), CI logs, infrastructure config |
| **Public** | Safe to disclose. | Marketing copy, published security policies, this documentation |

## Handling rules

| Control | Restricted | Confidential | Internal | Public |
| --- | --- | --- | --- | --- |
| Encrypt in transit (TLS) | ✅ | ✅ | ✅ | ✅ |
| Encrypt at rest | ✅ | ✅ | ✅ | — |
| Never logged | ✅ | bodies excluded | — | — |
| Never returned to client | ✅ | owner-only | — | public |
| DB access | service-role only | owner via RLS | — | — |
| Hashing/one-way where possible | ✅ (passwords, codes, tokens) | — | — | — |

## Implementation notes

- **Restricted** columns live on `public.users` and the service-role-only tables
  (`password_reset_tokens`, `auth_audit_log`). They have **no** client RLS
  policies (`supabase/migrations/0002`) and are **redacted** before being written
  to the audit log (`supabase/migrations/0004`).
- The API returns a **public-safe** user object that omits all Restricted fields
  (`safeUser` in `server/routers.ts`).
- Logs capture request **metadata only** — never bodies, cookies, passwords, or
  tokens (`server/_core/logging.ts`).
- Secrets are stored in the Vercel secrets manager, never in source; gitleaks
  scans block accidental commits.

## Retention

Retention per tier is defined in the
[Data Retention Policy](../../src/content/security/data-retention-policy.md) and
enforced by `run_data_retention()` (`supabase/migrations/0004`).
