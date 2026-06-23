# Asset Inventory

_Last updated: 2026-06-22 · Owner: Security Officer (CISO)_

The systems, data stores, and key dependencies that make up Yawn. Reviewed at
least quarterly alongside the [access review](access-review-template.md).

## Application & infrastructure

| Asset | Description | Hosted by | Data class | Notes |
| --- | --- | --- | --- | --- |
| Yawn web app | React client + Express/tRPC API | Vercel | Confidential | Serverless function `api/index.js` (esbuild bundle) |
| Database | Postgres (target) / JSON store (current) | Supabase / Vercel `/tmp` | Restricted/Confidential | Migrating to Supabase; see `supabase/README.md` |
| Source repository | Code, CI/CD, IaC | GitHub | Internal | Branch protection + required checks |
| Secrets | Session secret, API keys, DB creds | Vercel env vars | Restricted | Per-environment; never in source |
| Backups | Encrypted DB backups + store snapshots | Supabase PITR / `scripts/` | Restricted/Confidential | AES-256-GCM option; restore-tested weekly |

## Data stores

| Store | Contents | Classification |
| --- | --- | --- |
| `users` | Accounts, password hash, MFA secret/recovery, lockout state | Restricted + Confidential |
| `image_generations` | Prompts, image URLs/keys, metadata | Confidential |
| `web_scrapes` | URLs, scraped content, intelligence | Confidential |
| `password_reset_tokens` | Hashed single-use tokens | Restricted |
| `auth_audit_log` | Redacted security event trail | Confidential |
| Server logs | Request metadata | Internal |

## Third-party services

See the [Vendor Register](vendor-register.md) for the authoritative list of
subprocessors (Vercel, Supabase, GitHub, Anthropic, OpenAI, Firecrawl).

## Key software dependencies (security-relevant)

| Dependency | Role |
| --- | --- |
| `hash-wasm` | Argon2id password hashing (pure WASM) |
| `otplib` | TOTP MFA |
| `express-rate-limit` | Request rate limiting |
| `@trpc/*`, `express` | API surface |
| `drizzle-orm` | Reference schema (target DB) |

Dependencies are monitored by Dependabot, dependency-review, and `npm audit`
(`.github/workflows/`).

## Ownership

All assets are owned operationally by Engineering and governed by the Security
Officer. Decommissioning an asset includes revoking its credentials and updating
this inventory.
