# Supabase Database Security

Apply-ready PostgreSQL migrations that make a Supabase database for Yawn
**secure by default**: a typed schema, deny-by-default Row-Level Security (RLS),
least-privilege roles, and an audit + retention layer.

> **Status:** the running app currently persists to a JSON file store
> (`server/db.ts`). These migrations describe the target Supabase database and
> the steps to migrate onto it. They do not change the running app on their own.

## Files (apply in numeric order)

| File | Purpose |
| --- | --- |
| `migrations/0001_init_schema.sql` | Tables, types, indexes, FKs, `updated_at` triggers. Mirrors `server/schema.ts` plus the auth columns/tables (password hash, MFA, lockout, reset tokens, audit log). |
| `migrations/0002_row_level_security.sql` | Enables RLS (deny-by-default) and per-owner policies. RESTRICTED tables get **no** client policies. |
| `migrations/0003_roles_least_privilege.sql` | `revoke ... from public`, a least-privilege `yawn_app` login role, and Supabase `anon`/`authenticated`/`service_role` posture. |
| `migrations/0004_audit_and_retention.sql` | Audit trigger (RESTRICTED columns redacted) + `run_data_retention()` and a commented `pg_cron` schedule. |

## How to apply

**Option A — Supabase CLI**

```bash
supabase link --project-ref <your-project-ref>
supabase db push        # applies migrations/ in order
```

**Option B — SQL editor**

Paste each file's contents into the Supabase SQL editor and run them
**in order** (`0001` → `0004`). The DDL is idempotent where reasonable
(`IF NOT EXISTS` / `CREATE OR REPLACE`), so re-running is safe.

After applying `0003`, set a real password for the app role out-of-band (never
commit it):

```sql
ALTER ROLE yawn_app WITH PASSWORD '<strong-secret-from-vault>';
```

## The RLS identity model (important)

Yawn authenticates with its **own signed session cookie**, not Supabase Auth, so
`auth.uid()` is meaningless in policies today. Instead RLS reads two
**transaction-local GUCs** that the backend sets before each query:

```sql
begin;
  select set_config('app.current_user_id',   '<users.id>', true);  -- true = tx-local
  select set_config('app.current_user_role', '<user|admin>', true);
  -- ... your query; RLS now scopes rows to this user ...
commit;
```

If the GUCs are unset (or malformed), the helper functions return `NULL`/`false`
and **every policy denies access** — fail closed. Transaction-local (`true`) is
required so a pooled connection (PgBouncer / Supabase pooler) never leaks a GUC
across requests.

`password_reset_tokens` and `auth_audit_log` have RLS enabled with **zero
policies**, so only `service_role` / the table owner (which bypass RLS) can read
them — i.e. the backend's privileged path and the audit/retention jobs.

When you later adopt Supabase Auth, switch to the `auth.uid()` policy variants
included (commented) in `0002`/`0003` and add a `public.users.auth_user_id uuid`
column linked to `auth.users.id`.

## Wiring the app to Supabase (migrating off the JSON store)

1. Add `SUPABASE_DB_URL` (and the keys below) to the server environment.
2. Add a Postgres client (e.g. `postgres` / `pg`) and point Drizzle at it,
   reusing the table shapes in `server/schema.ts`.
3. Re-implement the functions in `server/db.ts` against Postgres. For each
   request, open a transaction and set the GUCs **before** running queries:

   ```ts
   await sql.begin(async (tx) => {
     await tx`select set_config('app.current_user_id',   ${String(user.id)}, true)`;
     await tx`select set_config('app.current_user_role', ${user.role},        true)`;
     // ... ordinary CRUD via the yawn_app connection (RLS applies) ...
   });
   ```

4. Use the **service-role** connection only for privileged operations
   (registration, login bookkeeping, password resets, audit writes) — never
   expose the service-role key to the browser.

The rest of the app is unaffected: the tRPC `auth` router and `authService`
already work table-agnostically through the `server/db.ts` interface.

## Backups & recovery

- Enable **Point-in-Time Recovery (PITR)** and **daily encrypted backups** in
  the Supabase dashboard (Database → Backups). Backups are encrypted at rest.
- The repo also ships application-level backup tooling for the JSON store
  (`npm run backup` / `npm run restore`, AES-256-GCM optional) with an automated
  round-trip test (`npm run test:backup`, also run weekly in CI).
- Recovery objectives and testing cadence are defined in
  [`../src/content/security/backup-recovery-policy.md`](../src/content/security/backup-recovery-policy.md).

## Required environment variables

| Variable | Used for |
| --- | --- |
| `SUPABASE_URL` | Project URL (REST/realtime/storage). |
| `SUPABASE_ANON_KEY` | Public client key — anon role, RLS-restricted. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret.** Server-only privileged access (bypasses RLS). Never ship to the browser. |
| `SUPABASE_DB_URL` | Direct Postgres connection string used by the backend (`yawn_app` for app traffic; a service-role/admin connection for privileged work). |

## Security model summary

Defense in depth across four layers: **schema** (typed, constrained, FKs) →
**RLS** (deny-by-default, per-owner, GUC-driven) → **roles** (least privilege,
no RLS bypass for the app role, RESTRICTED tables off-limits) →
**audit + retention** (redacted append-only trail, scheduled purges). Even if
the application authorization layer is bypassed, the database refuses to return
or mutate rows that don't belong to the requesting user, and secrets never reach
the audit log.

**Caveat:** the GUC-based RLS is only effective if the backend reliably sets
`app.current_user_id` / `app.current_user_role` within each query transaction.
Make that part of the shared DB helper, not individual call sites.
