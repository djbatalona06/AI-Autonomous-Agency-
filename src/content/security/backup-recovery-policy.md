# Backup & Recovery Policy

_Last updated: 2026-06-22 · Owner: Security Officer (CISO)_

This policy ensures Yawn AI Agency can recover its data after accidental deletion, corruption, or a security incident. It is built on Supabase's managed backup capabilities and a repeatable restore test.

## 1. Backup Schedule

- **Point-in-Time Recovery (PITR)** is enabled on the Supabase Postgres database, providing continuous backup of write-ahead logs so the database can be restored to any moment within the retention window.
- **Periodic snapshots** are taken by Supabase on a daily cadence and retained on a rolling basis (then expired per [`data-retention-policy.md`](data-retention-policy.md)).
- During the legacy JSON-store phase (`server/db.ts`), the data file is included in repository/deploy backups; the Supabase migration makes managed PITR the primary mechanism going forward.
- Source code and configuration are versioned in GitHub, which serves as the backup for everything except runtime data and secrets (secrets are recreated from the password manager / secrets manager, never restored from a backup).

## 2. Backup Encryption

- Backups are **encrypted at rest** by Supabase, and all transfer is over TLS.
- Backups inherit the Restricted classification (they contain password hashes and MFA secrets); access to restore is limited to operators with the appropriate Supabase role under [`access-control-policy.md`](access-control-policy.md).
- Encryption keys are managed by the platform provider; we do not store backup encryption keys in the repository.

## 3. RPO / RTO Objectives

| Objective | Target | Basis |
| --- | --- | --- |
| **RPO** (Recovery Point Objective — max acceptable data loss) | **≤ 5 minutes** | Supabase PITR replays WAL to near-current state. |
| **RTO** (Recovery Time Objective — max acceptable downtime to restore) | **≤ 4 hours** | Time to provision a restore target and cut over for a small dataset. |

These targets are sized for a small AI agency; they are reviewed if data volume or availability requirements change.

## 4. Recovery Testing

- A **backup/restore test** is run on a defined cadence (at least **quarterly**) using the project's restore test script (e.g., `scripts/backup-restore` test).
- The test restores a backup into an isolated target, verifies row counts and key integrity, and confirms the app can read the restored data — proving backups are not just present but usable.
- Each test is logged with date, backup point restored, result, and any issues. A failed test triggers a fix before the next release.
- Restore procedures and contacts are detailed in the [Incident Response Runbook](../../docs/security/incident-response-runbook.md) so recovery can be executed under pressure.

## 5. Roles

- The Operations/Release role owns backup configuration and runs the restore tests.
- The CISO reviews test results quarterly and signs off on the RPO/RTO targets annually.
