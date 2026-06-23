# Incident Response Runbook

_Last updated: 2026-06-22 · Owner: Security Officer (CISO)_

Operational, step-by-step companion to the
[Incident Response Policy](../../src/content/security/incident-response-policy.md).
When an incident is suspected, **act first to contain, then investigate** —
don't wait for certainty.

## Severity levels

| Sev | Definition | Examples | Target response |
| --- | --- | --- | --- |
| **SEV-1** | Critical: active breach / data exposure / full outage | Confirmed data leak, auth bypass exploited, DB compromise | Immediate, all-hands |
| **SEV-2** | High: serious risk, limited blast radius | Exploitable vuln in prod, partial outage, credential exposure | < 4 hours |
| **SEV-3** | Medium: contained or potential issue | Suspicious activity, single-account compromise | < 1 business day |
| **SEV-4** | Low: minor, no user impact | Non-exploitable finding, anomaly to watch | Next cycle |

## Roles

- **Incident Commander (IC)** — coordinates response and decisions.
- **Scribe** — maintains the timeline (actions, timestamps, evidence).
- **Comms** — internal/external/user communications.
- **Technical responders** — investigate and remediate.

(On a small team one person may hold several roles; the IC role must be explicit.)

## Phases

### 1. Detect & report
- Sources: monitoring/logs (`server/_core/logging.ts`), DB audit log
  (`auth_audit_log`), CI/security scans, user or researcher reports
  (`SECURITY.md`).
- Anyone who suspects an incident reports it to the Security Officer
  immediately. Assign a severity (escalate if unsure).

### 2. Contain
- **Account compromise:** lock the account; invalidate sessions.
- **Credential/secret exposure:** rotate the secret immediately (e.g.,
  `SESSION_SECRET` — rotating it invalidates **all** sessions; provider API
  keys; Supabase service-role key; `yawn_app` password).
- **Vulnerable deploy:** roll back via Vercel to the last known-good deployment
  and/or disable the affected feature.
- **DB compromise:** restrict access, consider read-only/maintenance mode,
  preserve a snapshot for forensics before changes.

### 3. Eradicate
- Identify and remove the root cause (patch the vuln, revoke access, remove
  malicious data/changes). Verify no persistence/backdoor remains.

### 4. Recover
- Restore from clean **backups** if needed (PITR / `npm run restore`); verify
  integrity with the restore self-test.
- Return to normal operation; monitor closely for recurrence.

### 5. Notify
- Determine legal/contractual obligations. For personal-data breaches, follow
  applicable law (e.g., **GDPR 72-hour** authority notification; user
  notification without undue delay).
- Coordinate user/customer comms via the Comms role; be factual and timely.
- For externally-reported issues, coordinate disclosure with the reporter.

### 6. Postmortem
- Within ~5 business days, produce a **blameless** postmortem: timeline, root
  cause, impact, what worked, what didn't, and concrete action items with owners
  and due dates.
- Feed lessons into controls, the [training curriculum](security-awareness-training.md),
  and the [controls matrix](security-controls-matrix.md).

## Forensics & evidence

- Preserve logs, the DB audit trail, and relevant snapshots **before**
  remediating where feasible.
- Keep a clear chain of custody; record who accessed what and when (the Scribe's
  timeline is the primary record).

## Key contacts & quick links

- **Security Officer / report:** batalona06@gmail.com
- Hosting/rollback: **Vercel** dashboard · Database/PITR: **Supabase** dashboard
  · Source/CI: **GitHub**
- Disclosure policy: `SECURITY.md`
