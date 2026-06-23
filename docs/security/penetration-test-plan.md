# Penetration Test Plan

_Last updated: 2026-06-22 · Owner: Security Officer (CISO)_

Defines how Yawn conducts security testing of its application and
infrastructure, supporting the
[Vulnerability Management Policy](../../src/content/security/vulnerability-management-policy.md).

## 1. Objectives

- Identify exploitable vulnerabilities before adversaries do.
- Validate that the controls in the
  [controls matrix](security-controls-matrix.md) work in practice (authn/authz,
  RLS, rate limiting, input handling).
- Produce prioritized, actionable findings with remediation guidance.

## 2. Cadence

- **Annually** at minimum, and after any **major** change to authentication,
  the data model, or the hosting architecture.
- Continuous automated testing runs every PR/push (CodeQL SAST, dependency
  review, `npm audit`, secret scanning).

## 3. Scope

**In scope**

- The web application: Express/tRPC API (`/trpc`, `/api/auth`) and React client.
- Authentication & session management: registration, login, MFA, password reset,
  lockout, cookie handling.
- Authorization: tRPC `protectedProcedure` and database **RLS** (attempt
  cross-tenant access).
- Database migrations and role/grant configuration (`supabase/`).
- Common web risks (see methodology).

**Out of scope**

- Denial-of-service / volumetric load testing.
- Third-party platforms themselves (Vercel, Supabase, GitHub, AI providers) —
  governed by their own programs; coordinate before testing.
- Social engineering and physical security (unless separately agreed).

## 4. Methodology

Aligned to the **OWASP Web Security Testing Guide** and **OWASP Top 10**,
covering at least:

1. Broken access control & IDOR (verify RLS + ownership checks).
2. Authentication & session flaws (brute force vs. lockout/rate limits, MFA
   bypass, reset-token handling, cookie flags & expiry, fixation).
3. Injection (SQLi/argument injection, prompt injection into LLM flows, SSRF via
   the crawler — verify URL handling).
4. Cryptographic failures (TLS config, password hashing parameters, secret
   storage).
5. Security misconfiguration (headers/CSP, error verbosity, CORS).
6. Vulnerable & outdated components.
7. SSRF / unsafe outbound requests from the scraper.
8. Logging integrity & sensitive-data exposure in logs/responses.

Testing combines automated tooling with manual verification. A safe,
non-production (preview) environment with seeded test data is preferred.

## 5. Rules of Engagement

- Authorized, scheduled window agreed with the operator in writing.
- No destructive actions, no DoS, no access to real user data beyond what is
  necessary to prove a finding; stop and report critical findings immediately.
- All testing from identified source IPs/accounts where feasible.
- Findings handled confidentially under coordinated disclosure (`SECURITY.md`).

## 6. Reporting & Remediation

- Each finding: title, severity (CVSS), affected component, reproduction,
  impact, and remediation.
- Remediation SLAs follow the Vulnerability Management Policy (e.g., Critical
  ≤7 days, High ≤30 days).
- A retest confirms fixes; results and residual risk are recorded and reviewed
  by the Security Officer.
