-- =============================================================================
-- 0002_row_level_security.sql
-- Yawn AI Agency — Row-Level Security (deny-by-default + per-owner policies)
-- -----------------------------------------------------------------------------
-- Defense in depth: even if the application authorization layer (tRPC
-- protectedProcedure) is bypassed, the database itself refuses to return or
-- mutate rows that don't belong to the requesting user.
--
-- IDENTITY MODEL (current app):
--   The app authenticates with its OWN signed session cookie, NOT Supabase
--   Auth. So auth.uid() is meaningless here. Instead the backend MUST set two
--   per-connection/transaction GUCs before issuing queries:
--
--       SELECT set_config('app.current_user_id',   '<users.id>', true);
--       SELECT set_config('app.current_user_role', '<user|admin>', true);
--
--   The `true` makes them transaction-local (reset at COMMIT/ROLLBACK), which
--   is the safe choice with connection pools (PgBouncer/Supabase pooler) so a
--   GUC never leaks across requests. Run them inside the same transaction as
--   the query (see supabase/README.md).
--
--   If the GUC is unset, the helper functions return NULL / false, so every
--   policy evaluates to "no access" — deny-by-default.
--
-- FUTURE MODEL (Supabase Auth):
--   When the app migrates to Supabase Auth, switch the policies to the
--   auth.uid() variants provided (commented) at the bottom of each section.
--   That requires storing the Supabase auth user id on public.users (e.g. an
--   `auth_user_id uuid` column) — see the migration note in the README.
--
-- ENABLE RLS first (deny-by-default), THEN add policies. A table with RLS
-- enabled and no matching policy denies all access to non-owner roles.
-- service_role / table owner BYPASS RLS by design (used by the backend's
-- privileged path and by the audit/retention jobs in 0004).
-- =============================================================================

set search_path = public;

-- -----------------------------------------------------------------------------
-- Helper functions: read the GUCs set by the backend, fail closed.
-- SECURITY: STABLE + marked so they can be used in policy expressions.
-- -----------------------------------------------------------------------------

-- Current app user id from the GUC, or NULL when unset/blank/invalid.
create or replace function public.current_app_user_id()
returns bigint
language plpgsql
stable
as $$
declare
  raw text := current_setting('app.current_user_id', true);
begin
  if raw is null or raw = '' then
    return null;
  end if;
  return raw::bigint;
exception
  when others then
    -- Malformed GUC must never widen access.
    return null;
end;
$$;

-- Current app user role from the GUC, defaulting to 'user' when unset.
create or replace function public.current_app_user_role()
returns text
language sql
stable
as $$
  select coalesce(nullif(current_setting('app.current_user_role', true), ''), 'user');
$$;

-- True only when the GUC role is exactly 'admin'.
create or replace function public.current_app_is_admin()
returns boolean
language sql
stable
as $$
  select public.current_app_user_role() = 'admin';
$$;

comment on function public.current_app_user_id  is 'RLS helper: app user id from GUC app.current_user_id; NULL (=> no access) when unset/invalid.';
comment on function public.current_app_is_admin is 'RLS helper: true when GUC app.current_user_role = admin.';

-- =============================================================================
-- Enable RLS on EVERY table (deny-by-default). FORCE so even the table owner
-- is subject to policies except where it connects as service_role/superuser
-- (which bypass RLS) — this prevents accidental owner-level data leaks.
-- =============================================================================
alter table public.users                 enable row level security;
alter table public.image_generations      enable row level security;
alter table public.web_scrapes            enable row level security;
alter table public.password_reset_tokens  enable row level security;
alter table public.auth_audit_log         enable row level security;

alter table public.users                 force row level security;
alter table public.image_generations      force row level security;
alter table public.web_scrapes            force row level security;
alter table public.password_reset_tokens  force row level security;
alter table public.auth_audit_log         force row level security;

-- =============================================================================
-- users — a user may read/update only their OWN row; admins may read all.
--          No client INSERT/DELETE (registration & deletion go through the
--          service-role/backend path which bypasses RLS).
-- =============================================================================
drop policy if exists users_select_self      on public.users;
drop policy if exists users_select_admin_all  on public.users;
drop policy if exists users_update_self       on public.users;

-- GUC MODEL (active) ----------------------------------------------------------
create policy users_select_self on public.users
  for select
  using ( id = public.current_app_user_id() );

create policy users_select_admin_all on public.users
  for select
  using ( public.current_app_is_admin() );

create policy users_update_self on public.users
  for update
  using      ( id = public.current_app_user_id() )
  with check ( id = public.current_app_user_id() );

-- SUPABASE AUTH MODEL (commented — enable after migrating to Supabase Auth;
-- assumes a public.users.auth_user_id uuid column linked to auth.users.id):
--
-- create policy users_select_self on public.users
--   for select using ( auth_user_id = auth.uid() );
-- create policy users_select_admin_all on public.users
--   for select using ( (auth.jwt() ->> 'role') = 'admin' );
-- create policy users_update_self on public.users
--   for update using      ( auth_user_id = auth.uid() )
--               with check ( auth_user_id = auth.uid() );

-- =============================================================================
-- image_generations — full CRUD, scoped to the owning user; admins read all.
-- =============================================================================
drop policy if exists image_generations_select_own      on public.image_generations;
drop policy if exists image_generations_select_admin    on public.image_generations;
drop policy if exists image_generations_insert_own       on public.image_generations;
drop policy if exists image_generations_update_own       on public.image_generations;
drop policy if exists image_generations_delete_own       on public.image_generations;

-- GUC MODEL (active) ----------------------------------------------------------
create policy image_generations_select_own on public.image_generations
  for select
  using ( user_id = public.current_app_user_id() );

create policy image_generations_select_admin on public.image_generations
  for select
  using ( public.current_app_is_admin() );

create policy image_generations_insert_own on public.image_generations
  for insert
  with check ( user_id = public.current_app_user_id() );

create policy image_generations_update_own on public.image_generations
  for update
  using      ( user_id = public.current_app_user_id() )
  with check ( user_id = public.current_app_user_id() );

create policy image_generations_delete_own on public.image_generations
  for delete
  using ( user_id = public.current_app_user_id() );

-- SUPABASE AUTH MODEL (commented — requires user_id to map to auth.uid(), e.g.
-- via a join to public.users.auth_user_id, or store auth_user_id directly):
--
-- create policy image_generations_rw_own on public.image_generations
--   for all
--   using      ( user_id in (select id from public.users where auth_user_id = auth.uid()) )
--   with check ( user_id in (select id from public.users where auth_user_id = auth.uid()) );

-- =============================================================================
-- web_scrapes — full CRUD, scoped to the owning user; admins read all.
-- =============================================================================
drop policy if exists web_scrapes_select_own    on public.web_scrapes;
drop policy if exists web_scrapes_select_admin   on public.web_scrapes;
drop policy if exists web_scrapes_insert_own      on public.web_scrapes;
drop policy if exists web_scrapes_update_own      on public.web_scrapes;
drop policy if exists web_scrapes_delete_own      on public.web_scrapes;

-- GUC MODEL (active) ----------------------------------------------------------
create policy web_scrapes_select_own on public.web_scrapes
  for select
  using ( user_id = public.current_app_user_id() );

create policy web_scrapes_select_admin on public.web_scrapes
  for select
  using ( public.current_app_is_admin() );

create policy web_scrapes_insert_own on public.web_scrapes
  for insert
  with check ( user_id = public.current_app_user_id() );

create policy web_scrapes_update_own on public.web_scrapes
  for update
  using      ( user_id = public.current_app_user_id() )
  with check ( user_id = public.current_app_user_id() );

create policy web_scrapes_delete_own on public.web_scrapes
  for delete
  using ( user_id = public.current_app_user_id() );

-- SUPABASE AUTH MODEL (commented):
--
-- create policy web_scrapes_rw_own on public.web_scrapes
--   for all
--   using      ( user_id in (select id from public.users where auth_user_id = auth.uid()) )
--   with check ( user_id in (select id from public.users where auth_user_id = auth.uid()) );

-- =============================================================================
-- password_reset_tokens & auth_audit_log — NO client access whatsoever.
-- -----------------------------------------------------------------------------
-- RLS is enabled with ZERO policies, so authenticated/anon/app roles get
-- nothing (deny-by-default). Only service_role / table owner (which BYPASS
-- RLS) can touch these tables — i.e. the backend's privileged path and the
-- audit/retention jobs in 0004. We add no policies here on purpose.
-- =============================================================================
-- (Intentionally left without policies.)

-- =============================================================================
-- End of 0002_row_level_security.sql
-- =============================================================================
