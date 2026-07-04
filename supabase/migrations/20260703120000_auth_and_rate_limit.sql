-- ============================================================================
-- Yawn — Auth profiles + brute-force lockout
-- Idempotent: safe to re-run. Applies best-practice RLS (subquery-wrapped
-- auth.uid(), see Supabase RLS performance) and hardened SECURITY DEFINER
-- functions (search_path = '', fully-qualified refs).
-- ============================================================================

-- ---------- profiles: one row per auth user, with role ----------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- RLS: (select auth.uid()) is evaluated once per query, not once per row.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Auto-create a profile when a new auth user signs up.
-- Role is ALWAYS server-assigned 'customer' here — never trust client input.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''), 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- login_attempts: server-side brute-force lockout -----------------
create table if not exists public.login_attempts (
  id bigint generated always as identity primary key,
  email text not null,
  success boolean not null default false,
  attempted_at timestamptz not null default now()
);
create index if not exists login_attempts_email_time_idx
  on public.login_attempts (lower(email), attempted_at desc);

-- RLS on, NO policies => no direct client read/write. Only the SECURITY
-- DEFINER functions below (running as owner) may touch this table.
alter table public.login_attempts enable row level security;

-- Returns lockout state: failed attempts in the last 15 min, locked flag, and
-- seconds until the window clears. Threshold = 3 failures / 15 minutes.
create or replace function public.login_status(p_email text)
returns table (locked boolean, fails int, retry_after_seconds int)
language plpgsql
security definer
set search_path = ''
as $$
declare
  window_start timestamptz := now() - interval '15 minutes';
  v_fails int;
  v_oldest timestamptz;
begin
  select count(*), min(attempted_at) into v_fails, v_oldest
  from public.login_attempts
  where lower(email) = lower(p_email) and success = false and attempted_at > window_start;

  return query select
    (coalesce(v_fails, 0) >= 3),
    coalesce(v_fails, 0),
    case when coalesce(v_fails, 0) >= 3
      then greatest(0, ceil(extract(epoch from (v_oldest + interval '15 minutes' - now())))::int)
      else 0 end;
end;
$$;

-- Records an attempt. On success, clears that email's failure window.
create or replace function public.record_login_attempt(p_email text, p_success boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.login_attempts (email, success) values (lower(p_email), p_success);
  if p_success then
    delete from public.login_attempts where lower(email) = lower(p_email) and success = false;
  end if;
end;
$$;

revoke all on function public.login_status(text) from public;
revoke all on function public.record_login_attempt(text, boolean) from public;
grant execute on function public.login_status(text) to anon, authenticated;
grant execute on function public.record_login_attempt(text, boolean) to anon, authenticated;

-- ---------- OPTIONAL: promote yourself to admin after first signup ----------
-- update public.profiles set role = 'admin' where email = 'batalona06@gmail.com';
