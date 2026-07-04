# Supabase migrations — Yawn (`odibvergwcllhsbzbgwa`)

Local migrations, applied in filename (timestamp) order. Conventions follow the
Supabase Postgres best-practices skill:

- **RLS** on every table; policies wrap `auth.uid()` as `(select auth.uid())`
  (evaluated once per query, not per row) and are scoped `to authenticated`.
- **FK columns are indexed** — composite indexes lead with the FK column so they
  cover both the foreign key and the common "my rows, newest first" query.
- **SECURITY DEFINER** functions use `set search_path = ''` with fully-qualified
  references, and `execute` is revoked from `public` then granted narrowly.
- Migrations are **idempotent** (`create ... if not exists`, `create or replace`,
  `drop policy if exists`) so they are safe to re-run.

## Files

| Migration | Purpose |
|---|---|
| `20260703120000_auth_and_rate_limit.sql` | `profiles` (+ auto-create trigger), `login_attempts`, and the `login_status` / `record_login_attempt` lockout RPCs (3 attempts / 15 min). |
| `20260703120100_project_data.sql` | `image_generations` + `web_scrapes` (per-user, RLS). Replaces the ephemeral JSON store, which does not survive Vercel serverless. |

## ⚠️ Remote history reconciliation (action needed)

The remote DB already reports a migration history of `0001`–`0004` that is **not
in this folder** (it was set up before this repo was linked). `supabase db push`
therefore refuses to run ("remote migration versions not found locally").

The original SQL for `0001`–`0004` isn't in the repo, and capturing it with
`supabase db pull` needs **Docker Desktop running** (it wasn't at setup time).

To reconcile, pick one:

1. **Recommended — baseline from remote (needs Docker):**
   ```bash
   # Start Docker Desktop, then:
   npx supabase db pull            # captures remote 0001-0004 as a local baseline
   npx supabase migration list     # confirm local == remote
   npx supabase db push            # applies the two migrations above
   ```
2. **If you know 0001–0004 are safe to forget** (e.g. they were throwaway):
   ```bash
   npx supabase migration repair --status reverted 0001 0002 0003 0004
   npx supabase db push
   ```
   Repair only edits the history table, not the schema. The two migrations above
   are idempotent, so re-creating any objects they share with 0001–0004 is a
   no-op.

After applying, promote the admin:
```sql
update public.profiles set role = 'admin' where email = 'batalona06@gmail.com';
```
