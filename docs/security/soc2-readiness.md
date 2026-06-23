# SOC 2 Readiness

_Last updated: 2026-06-22 · Owner: Security Officer (CISO)_

A self-assessment of Yawn's controls against the SOC 2 **Trust Services
Criteria (TSC)**, focused on **Security** (the common criteria) with notes on
Availability and Confidentiality. This is a readiness map, not an attestation —
a SOC 2 report requires an independent auditor over an observation period.

## Status legend

✅ In place · 🟡 Partial / in progress · ⬜ Not started

## Common Criteria (Security)

| TSC | Criterion | Status | Evidence |
| --- | --- | --- | --- |
| CC1 | Control environment, governance | 🟡 | Security program in `docs/security/`; CISO ownership; policies need annual sign-off cadence |
| CC2 | Communication of policies | ✅ | Policies published in-app (`/security`) and in repo |
| CC3 | Risk assessment | 🟡 | Asset inventory, data classification, vendor risk ratings done; formal risk register pending |
| CC4 | Monitoring of controls | 🟡 | CI gates, audit log, access-review template; continuous monitoring tooling pending |
| CC5 | Control activities | ✅ | Change management, code review, CI checks |
| CC6 | Logical & physical access | ✅ | Argon2id + MFA, RLS, least-privilege DB roles, secrets manager, session controls |
| CC6.1 | Encryption | ✅ | TLS in transit (Vercel), encryption at rest (Supabase), hashed credentials |
| CC6.6 | Boundary protection | 🟡 | Security headers, rate limiting in place; WAF planned |
| CC6.7 | Data in transit | ✅ | HTTPS everywhere + HSTS |
| CC7 | System operations / incident response | ✅ | [IR policy](../../src/content/security/incident-response-policy.md) + [runbook](incident-response-runbook.md); logging/audit trail |
| CC7.1 | Vulnerability management | ✅ | CodeQL, Dependabot, dependency-review, npm audit |
| CC8 | Change management | ✅ | [Policy](../../src/content/security/change-management-policy.md); PR review + CI + Vercel deploys |
| CC9 | Risk mitigation / vendors | ✅ | [Vendor management](../../src/content/security/vendor-management-policy.md) + [register](vendor-register.md) |

## Availability (A-series)

| Criterion | Status | Evidence |
| --- | --- | --- |
| Backups & recovery | ✅ | Supabase PITR + encrypted backups; restore tested weekly (`scripts/test-backup-restore.mjs`) |
| Capacity/resilience | 🟡 | Serverless auto-scales on Vercel; uptime monitoring/alerting pending |
| Incident handling | ✅ | IR runbook with severity levels |

## Confidentiality (C-series)

| Criterion | Status | Evidence |
| --- | --- | --- |
| Data classification | ✅ | [data-classification.md](data-classification.md) |
| Access restriction | ✅ | RLS + least-privilege roles; service-role-only Restricted tables |
| Retention & disposal | ✅ | Retention policy + `run_data_retention()` |

## Gaps to close before audit

1. Persist production data to Supabase (remove JSON-store dependency).
2. Stand up continuous monitoring + alerting and an external error tracker.
3. Enable/tune the WAF.
4. Operationalize recurring cadences: access reviews, security training, policy
   sign-off, and a formal risk register.
5. Engage an auditor and select the observation window once the above are
   steady-state.
