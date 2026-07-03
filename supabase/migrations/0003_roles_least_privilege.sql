-- =============================================================================
-- 0003_roles_least_privilege.sql
-- Yawn AI Agency — least-privilege database roles & grants
-- -----------------------------------------------------------------------------
-- Principle: default-deny. We REVOKE everything PUBLIC gets implicitly, then
-- grant the application role ONLY the table-level privileges it actually uses.
-- The app role can never run DDL, cannot touch the RESTRICTED tables, and is
-- subject to RLS (it is NOT a superuser and does NOT bypass RLS).
--
-- TWO PRIVILEGE PLANES (document + enforce the split):
--
--   1. service-role plane  — the backend's PRIVILEGED operations: user
--      registration, login bookkeeping (failed_attempts, locked_until,
--      last_signed_in), password resets, writing the audit log, retention
--      jobs. On Supabase this is the built-in `service_role` (reached via the
--      SERVICE_ROLE key / a service-role DB connection). It BYPASSES RLS, so
--      keep its key server-side ONLY — never ship it to the browser.
--
--   2. app-role plane (`yawn_app`) — per-request data access for ordinary
--      users. It is SUBJECT to RLS and only sees rows allowed by the GUCs set
--      in 0002. Use this connection for normal CRUD on image_generations /
--      web_scrapes and self-reads on users. It CANNOT read
--      password_reset_tokens or auth_audit_log at all.
--
-- On a self-hosted/plain Postgres the `yawn_app` role below is the connection
-- the app uses. On Supabase you may instead route ordinary traffic through the
-- built-in `authenticated` role; grants for that path are shown (commented) at
-- the end so RLS still applies. Either way the RESTRICTED tables stay
-- service-role only.
-- =============================================================================

set search_path = public;

-- -----------------------------------------------------------------------------
-- 0. Default-deny on the schema: strip implicit PUBLIC privileges.
-- -----------------------------------------------------------------------------
revoke all on schema public from public;
revoke all on all tables    in schema public from public;
revoke all on all sequences in schema public from public;
revoke all on all functions in schema public from public;

-- -----------------------------------------------------------------------------
-- 1. Create the least-privilege application login role (idempotent).
--    NOTE: set a real password out-of-band:
--        ALTER ROLE yawn_app WITH PASSWORD '<strong-secret-from-vault>';
--    NOSUPERUSER / NOCREATEDB / NOCREATEROLE / NOBYPASSRLS are explicit so the
--    role can never escalate, run DDL, or skip RLS.
-- -----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'yawn_app') then
    create role yawn_app with
      login
      nosuperuser
      nocreatedb
      nocreaterole
      noinherit
      nobypassrls
      password null;  -- set out-of-band; never commit a real password
  end if;
end
$$;

comment on role yawn_app is 'Least-privilege application role. Subject to RLS. No DDL, no superuser, no RLS bypass. Cannot read RESTRICTED tables (password_reset_tokens, auth_audit_log).';

-- Let the role connect and resolve objects in the schema (but not create).
grant usage on schema public to yawn_app;

-- -----------------------------------------------------------------------------
-- 2. Table grants for yawn_app — ONLY what the app needs.
-- -----------------------------------------------------------------------------

-- users: read + update self (RLS narrows this to the user's own row).
-- INSERT/DELETE deliberately withheld — registration & deletion are
-- service-role operations.
grant select, update on public.users to yawn_app;

-- image_generations & web_scrapes: full per-row CRUD (RLS scopes to owner).
grant select, insert, update, delete on public.image_generations to yawn_app;
grant select, insert, update, delete on public.web_scrapes        to yawn_app;

-- Sequences behind IDENTITY columns: the app needs USAGE to INSERT.
grant usage, select on all sequences in schema public to yawn_app;

-- RESTRICTED tables: NO grants to yawn_app. (password_reset_tokens,
-- auth_audit_log are service-role only.) Stated explicitly for auditors:
revoke all on public.password_reset_tokens from yawn_app;
revoke all on public.auth_audit_log        from yawn_app;

-- RLS helper functions used inside policies must be executable by the app role.
grant execute on function public.current_app_user_id()  to yawn_app;
grant execute on function public.current_app_user_role() to yawn_app;
grant execute on function public.current_app_is_admin()  to yawn_app;

-- -----------------------------------------------------------------------------
-- 3. Allow the app role to set ONLY the two RLS GUCs (defense in depth).
--    Postgres lets any role SET a non-reserved custom GUC, but we make the
--    intent explicit and tighten it where the platform supports it.
--    (On managed Supabase, GRANT SET ON PARAMETER may be restricted; the GUCs
--    are session/transaction-local regardless, so this is best-effort.)
-- -----------------------------------------------------------------------------
do $$
begin
  begin
    execute 'grant set on parameter app.current_user_id   to yawn_app';
    execute 'grant set on parameter app.current_user_role to yawn_app';
  exception
    when others then
      raise notice 'Skipping GRANT SET ON PARAMETER (not supported / insufficient privilege): %', sqlerrm;
  end;
end
$$;

-- -----------------------------------------------------------------------------
-- 4. Future-proof defaults: anything created later in `public` should also
--    deny PUBLIC by default. (Run as the object-creating role.)
-- -----------------------------------------------------------------------------
alter default privileges in schema public revoke all on tables    from public;
alter default privileges in schema public revoke all on sequences from public;
alter default privileges in schema public revoke all on functions from public;

-- =============================================================================
-- 5. SUPABASE BUILT-IN ROLES (anon / authenticated / service_role)
-- -----------------------------------------------------------------------------
-- Keep Supabase's roles in mind. Default posture:
--   * anon          — UNAUTHENTICATED public traffic. Grant NOTHING here.
--   * authenticated — logged-in Supabase Auth users (FUTURE model). Grants
--                     below are COMMENTED until the app migrates to Supabase
--                     Auth and the auth.uid() policies in 0002 are enabled.
--   * service_role  — privileged backend. Bypasses RLS; keep its key secret.
--
-- Lock down anon explicitly (no data access for unauthenticated callers):
revoke all on all tables    in schema public from anon;
revoke all on all sequences in schema public from anon;

-- GUC MODEL note: if you route the GUC-based app traffic through Supabase's
-- `authenticated` role (instead of a dedicated yawn_app login), mirror the
-- yawn_app grants onto `authenticated` and DO NOT grant the RESTRICTED tables:
--
--   grant usage on schema public to authenticated;
--   grant select, update on public.users to authenticated;
--   grant select, insert, update, delete on public.image_generations to authenticated;
--   grant select, insert, update, delete on public.web_scrapes        to authenticated;
--   grant usage, select on all sequences in schema public to authenticated;
--   revoke all on public.password_reset_tokens from authenticated;
--   revoke all on public.auth_audit_log        from authenticated;
--
-- SUPABASE AUTH MODEL (commented — enable WITH the auth.uid() policies in 0002):
--
--   grant usage on schema public to authenticated;
--   grant select, update on public.users to authenticated;
--   grant select, insert, update, delete on public.image_generations to authenticated;
--   grant select, insert, update, delete on public.web_scrapes        to authenticated;
--   grant usage, select on all sequences in schema public to authenticated;
--   -- RESTRICTED tables remain service-role only:
--   revoke all on public.password_reset_tokens from authenticated, anon;
--   revoke all on public.auth_audit_log        from authenticated, anon;
--
-- service_role needs no extra grants for the app tables (it bypasses RLS and,
-- on Supabase, is already a privileged member). On plain Postgres, your
-- migration/admin superuser owns the tables and performs the privileged work.
-- =============================================================================

-- =============================================================================
-- End of 0003_roles_least_privilege.sql
-- =============================================================================
