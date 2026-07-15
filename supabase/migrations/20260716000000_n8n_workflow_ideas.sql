-- ============================================================================
-- Yawn — n8n Workflow Scout: daily brainstorming feed for the automation
-- pipeline. Populated by scripts/n8n-workflow-scout.mjs via the
-- n8n-workflow-scout GitHub Action (docs/n8n-brainstorming/README.md).
-- Idempotent. RLS on: readable by admins only, writable only by the
-- service_role key the CI script uses (no client insert/update policy, same
-- "RLS on, no policies" pattern as login_attempts).
-- ============================================================================

create table if not exists public.n8n_workflow_ideas (
  id bigint generated always as identity primary key,
  run_date date not null,
  vertical text not null check (
    vertical in ('sales', 'ecommerce', 'wholesaling_rei', 'productivity', 'small_business')
  ),
  title text not null,
  node_chain text not null,
  nodes jsonb not null default '[]'::jsonb,
  complexity text not null check (complexity in ('simple', 'medium', 'complex')),
  template_fit text,
  source_url text,
  source_title text,
  notes text,
  created_at timestamptz not null default now()
);

-- Composite index leads with the common filter (run_date, vertical) — covers
-- "today's brief" and "everything we've ever suggested for vertical X".
create index if not exists n8n_workflow_ideas_run_date_vertical_idx
  on public.n8n_workflow_ideas (run_date desc, vertical);

alter table public.n8n_workflow_ideas enable row level security;

-- Admin-only read (this is DJ's internal brainstorming feed, not client-facing).
drop policy if exists "n8n_workflow_ideas_select_admin" on public.n8n_workflow_ideas;
create policy "n8n_workflow_ideas_select_admin" on public.n8n_workflow_ideas
  for select to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
  );

-- No insert/update/delete policy for anon/authenticated: only the
-- service_role key (used by the CI scout script, which bypasses RLS) writes
-- to this table.
