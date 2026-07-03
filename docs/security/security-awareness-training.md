# Security Awareness Training

_Last updated: 2026-06-22 · Owner: Security Officer (CISO)_

Everyone who can access Yawn systems or data completes security awareness
training. Supports the
[Acceptable Use](../../src/content/security/acceptable-use-policy.md) and
[Access Control](../../src/content/security/access-control-policy.md) policies.

## Cadence

- **Onboarding** — before being granted production access.
- **Annually** — refresher for all team members.
- **Ad hoc** — after a relevant incident or a major threat-landscape change.

## Curriculum

1. **Phishing & social engineering** — recognizing and reporting suspicious
   messages; never approve unexpected MFA prompts; verify out-of-band.
2. **Credentials & MFA** — unique strong passwords, a password manager, MFA on
   every account (Vercel, Supabase, GitHub, Yawn).
3. **Secrets handling** — never commit secrets; use the secrets manager; what to
   do if a key leaks (rotate immediately, notify the Security Officer).
4. **Secure development** — code review, dependency hygiene, input validation,
   least privilege, avoiding logging of sensitive data; understanding the OWASP
   Top 10.
5. **Data handling** — the [data classification](data-classification.md) tiers
   and the rules for Restricted/Confidential data.
6. **Device & account hygiene** — screen lock, disk encryption, OS/app updates,
   no shared accounts.
7. **Incident reporting** — how and when to report; the
   [incident response runbook](incident-response-runbook.md); "if in doubt,
   report."

## Completion & tracking

| Person | Role | Onboarding | Last annual | Next due |
| --- | --- | --- | --- | --- |
| | | | | |

- Completion is recorded above; overdue training triggers an access review.
- New high-impact threats are shared with the team as short briefings between
  formal sessions.

## Effectiveness

- Periodic phishing simulations (planned) measure susceptibility and reinforce
  training.
- Lessons from incidents and postmortems feed back into the curriculum.
