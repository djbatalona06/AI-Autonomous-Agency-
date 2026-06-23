-- =============================================================================
-- 0004_audit_and_retention.sql
-- Yawn AI Agency — audit triggers + data-retention jobs
-- -----------------------------------------------------------------------------
-- Builds on 0001 (schema) / 0002 (RLS) / 0003 (roles). Two concerns:
--
--   1. AUDIT — a trigger writes an append-only trail of security-relevant row
--      changes (role changes, lockouts, MFA toggles, credential resets) into
--      public.auth_audit_log. RESTRICTED columns (password_hash, mfa_secret,
--      mfa_recovery_hashes, token_hash) are REDACTED before they are recorded,
--      so the audit log never becomes a secondary leak of secrets.
--
--   2. RETENTION — a function purges data past its retention window, aligning
--      the database with the Data Retention Policy:
--        * auth_audit_log      → 90 days   (configurable)
--        * web_scrapes         → 12 months (configurable)
--        * password_reset_tokens → expired/used rows purged promptly
--
-- The audit + retention functions run as SECURITY DEFINER (owner privileges)
-- so they can write/clean the service-role-only tables even though yawn_app
-- cannot. They are owned by the migration/admin role.
--
-- Idempotent: CREATE OR REPLACE + guarded trigger drops.
-- =============================================================================

set search_path = public;

-- -----------------------------------------------------------------------------
-- 1. Audit trigger function. Redacts RESTRICTED columns, then records a compact
--    old/new diff. SECURITY DEFINER so it can insert into the service-role-only
--    auth_audit_log regardless of the caller's privileges.
-- -----------------------------------------------------------------------------
create or replace function public.audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old   jsonb;
  v_new   jsonb;
  v_user  bigint;
  -- Columns that must NEVER be copied into the audit trail.
  v_redact text[] := array[
    'password_hash', 'mfa_secret', 'mfa_recovery_hashes', 'token_hash'
  ];
  k text;
begin
  if (tg_op = 'DELETE') then
    v_new := '{}'::jsonb;
    v_old := to_jsonb(old);
    v_user := (old).user_id;
  elsif (tg_op = 'UPDATE') then
    v_new := to_jsonb(new);
    v_old := to_jsonb(old);
    v_user := coalesce((new).user_id, (old).user_id);
  else -- INSERT
    v_new := to_jsonb(new);
    v_old := '{}'::jsonb;
    v_user := (new).user_id;
  end if;

  -- Redact restricted keys from both sides.
  foreach k in array v_redact loop
    v_old := v_old - k;
    v_new := v_new - k;
  end loop;

  -- On the users table, user_id IS the id column.
  if tg_table_name = 'users' then
    v_user := coalesce(
      case when tg_op = 'DELETE' then (old).id else (new).id end,
      v_user
    );
  end if;

  insert into public.auth_audit_log (user_id, event_type, target_table, actor, detail)
  values (
    v_user,
    lower(tg_op) || '_' || tg_table_name,   -- e.g. update_users
    tg_table_name,
    current_user,
    jsonb_strip_nulls(jsonb_build_object('old', v_old, 'new', v_new))
  );

  return null; -- AFTER trigger; return value ignored.
end;
$$;

comment on function public.audit_row_change is 'AFTER trigger: append a REDACTED old/new diff to auth_audit_log. SECURITY DEFINER. Never records password_hash/mfa_secret/mfa_recovery_hashes/token_hash.';

-- -----------------------------------------------------------------------------
-- 2. Attach the audit trigger to the security-relevant tables.
--    users: catches role changes, lockouts, MFA toggles, credential changes.
--    password_reset_tokens: catches issuance/consumption (hash is redacted).
-- -----------------------------------------------------------------------------
drop trigger if exists users_audit on public.users;
create trigger users_audit
  after insert or update or delete on public.users
  for each row execute function public.audit_row_change();

drop trigger if exists password_reset_tokens_audit on public.password_reset_tokens;
create trigger password_reset_tokens_audit
  after insert or update or delete on public.password_reset_tokens
  for each row execute function public.audit_row_change();

-- -----------------------------------------------------------------------------
-- 3. Retention routine. Returns the number of rows removed per table so the
--    scheduled job can be observed. SECURITY DEFINER to clean service-role
--    tables. Windows are parameters so they can match the policy without a
--    schema change.
-- -----------------------------------------------------------------------------
create or replace function public.run_data_retention(
  p_log_retention    interval default interval '90 days',
  p_scrape_retention interval default interval '12 months'
)
returns table (purged_audit_log bigint, purged_web_scrapes bigint, purged_reset_tokens bigint)
language plpgsql
security definer
set search_path = public
as $$
declare
  n_log    bigint;
  n_scrape bigint;
  n_token  bigint;
begin
  delete from public.auth_audit_log
   where created_at < now() - p_log_retention;
  get diagnostics n_log = row_count;

  delete from public.web_scrapes
   where created_at < now() - p_scrape_retention;
  get diagnostics n_scrape = row_count;

  -- Expired OR already-used reset tokens have no further use.
  delete from public.password_reset_tokens
   where expires_at < now() or used_at is not null;
  get diagnostics n_token = row_count;

  -- Record the cleanup itself in the audit trail.
  insert into public.auth_audit_log (event_type, target_table, actor, detail)
  values (
    'data_retention_run', null, current_user,
    jsonb_build_object(
      'purged_audit_log', n_log,
      'purged_web_scrapes', n_scrape,
      'purged_reset_tokens', n_token,
      'log_retention', p_log_retention::text,
      'scrape_retention', p_scrape_retention::text
    )
  );

  return query select n_log, n_scrape, n_token;
end;
$$;

comment on function public.run_data_retention is 'Purge data past its retention window (audit log 90d, web_scrapes 12mo, expired/used reset tokens). SECURITY DEFINER; intended for scheduled (pg_cron) execution.';

-- Only the privileged plane may run retention; never the app role.
revoke all on function public.run_data_retention(interval, interval) from public;

-- -----------------------------------------------------------------------------
-- 4. Schedule retention with pg_cron (OPTIONAL — Supabase: enable the pg_cron
--    extension under Database → Extensions first). Commented so this migration
--    applies cleanly even when pg_cron is unavailable.
-- -----------------------------------------------------------------------------
-- create extension if not exists pg_cron;
--
-- -- Daily at 03:30 UTC. unschedule first so re-running is idempotent.
-- select cron.unschedule('yawn-data-retention')
--   where exists (select 1 from cron.job where jobname = 'yawn-data-retention');
-- select cron.schedule(
--   'yawn-data-retention',
--   '30 3 * * *',
--   $$ select public.run_data_retention(); $$
-- );

-- =============================================================================
-- End of 0004_audit_and_retention.sql
-- =============================================================================
