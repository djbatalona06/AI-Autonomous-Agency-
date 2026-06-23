# Information Security Policy

_Last updated: 2026-06-22 · Owner: Security Officer (CISO)_

This policy sets the baseline for how Yawn AI Agency ("Yawn") protects the confidentiality, integrity, and availability of the data we and our customers entrust to the platform. It applies to everyone who builds, operates, or has privileged access to the Yawn application, its source repository (`djbatalona06/AI-Autonomous-Agency-`), and its hosting environment (Vercel + Supabase).

Yawn is a small team, so this policy is deliberately lean: every control listed here is one we actually run or can run today, not aspirational boilerplate.

## 1. Security Roles

We keep the responsibility map small and explicit.

| Role | Held by | Responsibilities |
| --- | --- | --- |
| Security Officer (CISO) | Founder / acting CISO | Owns this policy set, approves exceptions, runs access reviews, leads incident response. |
| Engineering | All committers | Secure coding, dependency hygiene, responding to CodeQL/Dependabot alerts, peer review of every PR. |
| Operations / Release | Engineering (rotating) | Production deploys, Vercel/Supabase configuration, backup and restore verification. |
| Data Protection contact | `batalona06@gmail.com` | Handles privacy requests (GDPR/CCPA), data deletion, and external security reports. |

For a single-operator or two-person team the same person may hold several roles, but the CISO role is never delegated to an automated process.

## 2. Asset Inventory

We maintain a living inventory of the assets that matter to security. The authoritative copy lives in [`docs/security/asset-inventory.md`](../../docs/security/asset-inventory.md) and covers:

- **Code & config** — the GitHub repository, GitHub Actions workflows, environment variables / secrets.
- **Compute & hosting** — Vercel project (serverless API + static frontend), Supabase project (Postgres).
- **Data stores** — today a JSON file (`server/db.ts`, `server/.data/store.json`); migrating to Supabase Postgres (`supabase/migrations`).
- **Third-party services / subprocessors** — Vercel, GitHub, Supabase, Anthropic, OpenAI, Firecrawl (see [`docs/security/vendor-register.md`](../../docs/security/vendor-register.md)).
- **Identities & secrets** — user accounts, admin accounts, API keys, the session signing secret.

The inventory is reviewed at least quarterly and whenever a new service or data type is introduced.

## 3. Data Classification

All data handled by Yawn is classified into one of four tiers. The full scheme with app-specific examples is in [`docs/security/data-classification.md`](../../docs/security/data-classification.md).

| Tier | Examples in Yawn | Handling |
| --- | --- | --- |
| Public | Marketing pages, this published policy set | No restriction. |
| Internal | Aggregated usage metrics, non-sensitive logs | Staff only. |
| Confidential | User email/name, generated images, scraped URLs and content | Encrypted in transit and at rest; access on a need-to-know basis. |
| Restricted | Password hashes, MFA secrets, API keys, session secret, backups | Never logged; secrets manager only; strict least privilege. |

Engineers must classify any new data type before it ships and store it according to its tier.

## 4. Security Review Process

Security review is built into the normal delivery flow rather than bolted on:

- **Per change** — every code change goes through a pull request. No direct pushes to `main`. PRs run CI (typecheck + build), CodeQL static analysis, dependency review, and npm audit before merge. A human reviewer signs off (see [`change-management-policy.md`](change-management-policy.md)).
- **Continuous** — Dependabot (weekly) and CodeQL (on push + weekly schedule) surface vulnerable dependencies and code-level issues automatically. Secret scanning blocks committed credentials.
- **Periodic** — quarterly access reviews ([`access-control-policy.md`](access-control-policy.md)), quarterly asset/vendor inventory review, and an annual penetration test ([`docs/security/penetration-test-plan.md`](../../docs/security/penetration-test-plan.md)).
- **Event-driven** — any security incident triggers the [`incident-response-policy.md`](incident-response-policy.md) and a postmortem feeds fixes back into these policies.

## 5. Exceptions & Enforcement

Any deviation from this policy must be documented and approved by the CISO with a remediation date. Repeated or willful non-compliance is grounds for revoking access. This policy is reviewed at least annually and after any major incident or architecture change.
