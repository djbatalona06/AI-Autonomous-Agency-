# Security Policy

We take the security of Yawn and its users seriously. Thank you for helping keep
the project and its community safe.

## Supported versions

Security fixes are applied to the latest `main` (the deployed version). Older
commits are not separately patched.

## Reporting a vulnerability

**Please do not open a public issue for security vulnerabilities.**

Report privately, by either:

- **GitHub Security Advisories** — use *Security → Report a vulnerability* on
  this repository (preferred; keeps the report private and tracked), or
- **Email** — <batalona06@gmail.com> with the subject line
  `SECURITY: <short summary>`.

Please include enough detail to reproduce:

- A description of the issue and its impact.
- Steps to reproduce, a proof-of-concept, or affected endpoint/file.
- Affected version/commit, and any suggested remediation.

If you'd like, include a name/handle for credit in the fix.

## Our commitment (response targets)

| Stage | Target |
| --- | --- |
| Acknowledge your report | within **3 business days** |
| Initial assessment & severity | within **7 business days** |
| Fix or mitigation for critical issues | as soon as practical, typically within **30 days** |
| Public disclosure | coordinated with you, after a fix is available |

We follow **coordinated disclosure**: please give us a reasonable window to
remediate before any public disclosure.

## Scope

In scope:

- The application code in this repository (Express/tRPC API, React client,
  authentication, database migrations under `supabase/`).
- The deployed application.

Out of scope (please do not test):

- Denial-of-service / volumetric attacks, brute-forcing, or load testing.
- Social engineering, phishing, or physical attacks.
- Findings in third-party services (Vercel, Supabase, GitHub, Anthropic,
  OpenAI, Firecrawl) — report those to the respective vendor.
- Automated scanner output without a demonstrated, exploitable impact.

## Safe harbor

We will not pursue or support legal action against researchers who:

- Make a good-faith effort to comply with this policy,
- Avoid privacy violations, data destruction, and service disruption, and
- Do not access, modify, or retain data beyond what is necessary to demonstrate
  the vulnerability.

If in doubt about whether an action is acceptable, contact us first at the email
above.

## Where our controls live

The full security program — access control, password/MFA, incident response,
vulnerability management, data retention, and the controls matrix — is
documented in [`docs/security/`](docs/security/) and surfaced in-app under the
**Security Center** (`/security`).
