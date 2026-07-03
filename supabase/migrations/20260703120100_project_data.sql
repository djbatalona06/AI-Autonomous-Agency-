-- ============================================================================
-- Yawn — Project data (image generations + web scrapes), per-user with RLS.
-- Replaces the ephemeral JSON store (server/.data/store.json), which does NOT
-- survive Vercel serverless. Idempotent. Best practices: subquery-wrapped
-- auth.uid() RLS, composite index leads with the FK column (covers FK + the
-- common "my rows, newest first" query), append-only (no update/delete policy).
-- ============================================================================

-- ---------- image_generations ------------------------------------------------
create table if not exists public.image_generations (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  prompt text not null,
  image_url text not null,
  image_key text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists image_generations_user_created_idx
  on public.image_generations (user_id, created_at desc);

alter table public.image_generations enable row level security;

drop policy if exists "image_generations_select_own" on public.image_generations;
create policy "image_generations_select_own" on public.image_generations
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "image_generations_insert_own" on public.image_generations;
create policy "image_generations_insert_own" on public.image_generations
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- ---------- web_scrapes ------------------------------------------------------
create table if not exists public.web_scrapes (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  url text not null,
  raw_content text not null default '',
  markdown_summary text not null default '',
  competitive_intelligence jsonb not null default '{}'::jsonb,
  automation_template text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists web_scrapes_user_created_idx
  on public.web_scrapes (user_id, created_at desc);

alter table public.web_scrapes enable row level security;

drop policy if exists "web_scrapes_select_own" on public.web_scrapes;
create policy "web_scrapes_select_own" on public.web_scrapes
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "web_scrapes_insert_own" on public.web_scrapes;
create policy "web_scrapes_insert_own" on public.web_scrapes
  for insert to authenticated
  with check ((select auth.uid()) = user_id);
