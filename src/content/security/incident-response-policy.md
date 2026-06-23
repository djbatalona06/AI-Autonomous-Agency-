# Incident Response Policy

_Last updated: 2026-06-22 · Owner: Security Officer (CISO)_

This policy defines how Yawn AI Agency detects, classifies, responds to, communicates about, and learns from security incidents. The hands-on, step-by-step procedures live in the [Incident Response Runbook](../../docs/security/incident-response-runbook.md); this document sets the framework and decisions.

## 1. What Counts as a Security Incident

A security incident is any actual or suspected event that threatens the confidentiality, integrity, or availability of Yawn systems or data. Examples specific to this app:

- Unauthorized access to user accounts, admin accounts, or the Supabase database.
- Exposure or suspected leak of a secret (API key, `SESSION_SECRET`, Supabase service key).
- Leak of Confidential data: user email/name, generated images, scraped content.
- Compromise of the GitHub repo, CI pipeline, or a maintainer's account.
- A vulnerable dependency being actively exploited (escalation from [`vulnerability-management-policy.md`](vulnerability-management-policy.md)).
- Sustained abuse: credential stuffing, brute force, or denial of service against the API.
- Loss/theft of a device with production access.

## 2. Severity Levels

| Severity | Definition | Examples |
| --- | --- | --- |
| **SEV-1 Critical** | Confirmed breach of Restricted/Confidential data, or production fully down. | Database exfiltration, leaked service key in use, total outage. |
| **SEV-2 High** | Likely compromise or major degradation; contained but serious. | Single admin account takeover, exposed API key (not yet abused), partial outage. |
| **SEV-3 Moderate** | Limited impact, no confirmed data loss. | Brute-force spike absorbed by lockout/rate limiting, low-severity vuln under active scanning. |
| **SEV-4 Low** | Minor or informational. | Single suspicious login blocked, misconfiguration with no exposure. |

## 3. Escalation Procedures

1. **Detect & report** — anyone who notices a potential incident reports it immediately to the CISO (`batalona06@gmail.com`). Sources include structured request logs (`server/_core/logging.ts`), error tracking, GitHub/CodeQL/Dependabot/secret-scanning alerts, and vendor notifications.
2. **Triage** — the CISO (Incident Commander by default) assigns a severity within the target timeframes: SEV-1 immediately, SEV-2 within 1 hour, SEV-3/4 within 1 business day.
3. **Contain** — execute the matching runbook play: rotate secrets, revoke sessions (rotate `SESSION_SECRET`), lock or disable affected accounts, tighten rate limits, or roll back a bad deploy (Vercel instant rollback / git revert).
4. **Eradicate & recover** — remove the root cause, patch, and restore service. For data loss, recover from Supabase PITR / encrypted backups per [`backup-recovery-policy.md`](backup-recovery-policy.md).
5. **Close** — confirm the threat is gone and monitoring is clean before declaring resolution.

## 4. Communication Plan

- **Internal** — a single incident channel/thread is opened at declaration; the Incident Commander posts status updates at a cadence matching severity (SEV-1: at least hourly).
- **Affected users** — if Confidential personal data is or may be compromised, affected users are notified without undue delay, describing what happened, what data was involved, and what they should do.
- **Regulators** — where a personal-data breach triggers legal obligations (e.g., GDPR's 72-hour notification), the Data Protection contact coordinates notification within the required window.
- **Vendors** — if the incident originates with or involves a subprocessor (Vercel, Supabase, Anthropic, OpenAI, Firecrawl), we engage their support/security channel and track it in the [vendor register](../../docs/security/vendor-register.md).
- All external statements are approved by the CISO; speculation is avoided.

## 5. Forensics Procedures

- **Preserve first** — before remediation alters state, capture evidence: relevant structured logs, Vercel runtime/build logs, Supabase audit/query logs, GitHub audit log, and timestamps.
- Snapshot the affected database state (PITR allows recovery to a point in time without destroying the compromised state for analysis).
- Maintain a chronological incident timeline (who/what/when) in the incident record.
- Restrict evidence access to the response team; treat collected logs as Confidential.

## 6. Postmortem Process

- Every SEV-1 and SEV-2 incident gets a written, **blameless** postmortem within 5 business days.
- It documents: timeline, root cause, impact, what worked, what didn't, and concrete action items with owners and due dates.
- Action items feed back into code, configuration, and these policies. The postmortem is reviewed in the next access/security review to confirm follow-through.
