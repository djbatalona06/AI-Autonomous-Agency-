# Security Controls Matrix

_Last updated: 2026-06-22 · Owner: Security Officer (CISO)_

The master mapping of security requirements to their implementation status,
evidence, and owner. Status legend:

- **✅ Implemented in code** — enforced by application/database code in this repo.
- **⚙️ Configured** — enforced by platform/CI configuration.
- **📄 Documented policy** — governed by a written policy/process.
- **🟡 Planned / External** — operational or third-party control, in progress.

## Must-Have controls

| # | Requirement | Status | Evidence | Owner |
| --- | --- | --- | --- | --- |
| 1 | HTTPS everywhere | ⚙️ Configured · ✅ | Vercel automatic TLS; HSTS in `server/_core/security.ts`; headers in `vercel.json` | Platform |
| 2 | MFA on all admin accounts | ✅ Implemented | TOTP + recovery codes `server/_core/mfa.ts`, `routers.ts` (`auth.mfa*`); UI `src/components/auth/MfaSetup.tsx`; required for admins per [password policy](../../src/content/security/password-policy.md) | Eng |
| 3 | Password hashing (Argon2/bcrypt) | ✅ Implemented | **Argon2id** `server/_core/password.ts` (OWASP params) | Eng |
| 4 | Encrypted database backups | ⚙️ Configured · ✅ | Supabase PITR + daily encrypted backups; app-store backups AES-256-GCM `scripts/backup-store.mjs` | Platform / Eng |
| 5 | Logging & monitoring | ✅ Implemented | Structured request logging `server/_core/logging.ts`; DB audit log `supabase/migrations/0004` | Eng |
| 6 | Error tracking | ✅ Implemented · 🟡 | Centralized tRPC/Express error handling, no prod leakage `server/trpc.ts`, `server/app.ts`; external error tracker (e.g., Sentry) planned | Eng |
| 7 | Rate limiting | ✅ Implemented | `express-rate-limit` on `/api/auth` + `/trpc` in `server/app.ts`; per-account lockout in `authService.ts` | Eng |
| 8 | Secrets manager | ⚙️ Configured | Vercel encrypted env vars; fail-closed `SESSION_SECRET` `server/_core/env.ts`; gitleaks `.github/workflows/secret-scan.yml` | Platform |
| 9 | Privacy Policy | 📄 Documented | [`privacy-policy.md`](../../src/content/security/privacy-policy.md), rendered at `/privacy` | CISO |
| 10 | Terms of Service | 📄 Documented | [`terms-of-service.md`](../../src/content/security/terms-of-service.md), rendered at `/terms` | CISO |
| 11 | Incident response document | 📄 Documented | [Policy](../../src/content/security/incident-response-policy.md) + [Runbook](incident-response-runbook.md) | CISO |
| 12 | Backup & restore testing | ✅ Implemented | `scripts/test-backup-restore.mjs`; weekly `.github/workflows/backup-restore-test.yml` | Eng |
| 13 | Dependency vulnerability scanning | ⚙️ Configured | Dependabot `.github/dependabot.yml`; `dependency-review.yml`; `npm-audit.yml` | Eng |
| 14 | Automated deployments | ⚙️ Configured | Vercel CI/CD; `.github/workflows/ci.yml` (typecheck + build gates) | Platform |
| 15 | Least-privilege access | ✅ Implemented | DB roles/grants `supabase/migrations/0003`; RLS `0002`; safe user shape (no hash leak) `routers.ts` | Eng |

## Strongly-recommended controls

| # | Requirement | Status | Evidence | Owner |
| --- | --- | --- | --- | --- |
| 16 | Web Application Firewall (WAF) | 🟡 Planned | Vercel Firewall / attack challenge available; rules to be enabled and tuned | Platform |
| 17 | Annual penetration test | 🟡 Planned | [penetration-test-plan.md](penetration-test-plan.md) | CISO |
| 18 | SOC 2 preparation | 🟡 In progress | [soc2-readiness.md](soc2-readiness.md) | CISO |
| 19 | Security awareness training | 📄 Documented · 🟡 | [security-awareness-training.md](security-awareness-training.md); to be operationalized | CISO |
| 20 | Data retention policy | ✅ Implemented · 📄 | [Policy](../../src/content/security/data-retention-policy.md); enforced by `run_data_retention()` `supabase/migrations/0004` | CISO / Eng |
| 21 | Vendor management process | 📄 Documented | [Policy](../../src/content/security/vendor-management-policy.md); [Vendor Register](vendor-register.md) | CISO |

## Additional implemented controls (defense in depth)

| Control | Evidence |
| --- | --- |
| Security headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) | `server/_core/security.ts` |
| Account lockout (5 attempts / 15 min) | `server/_core/authService.ts` |
| Tokenized password reset (1h expiry, no enumeration) | `server/_core/authService.ts` |
| Signed session cookies with expiry + constant-time verify | `server/_core/cookies.ts` |
| Row-Level Security (deny-by-default, per-owner) | `supabase/migrations/0002` |
| Redacted, append-only DB audit trail | `supabase/migrations/0004` |
| Static analysis (CodeQL) | `.github/workflows/codeql.yml` |
| Coordinated vulnerability disclosure | `SECURITY.md` |

## Known gaps / follow-ups

- Persist auth to Supabase (the running app still uses the JSON store; Vercel's
  filesystem is ephemeral). See `supabase/README.md`.
- Enable and tune the Vercel WAF rules.
- Wire an external error-tracking/alerting tool and uptime monitoring.
- Rotate any credentials that ever appeared in source control (see follow-ups in
  the PR description) and operationalize the training + access-review cadences.
