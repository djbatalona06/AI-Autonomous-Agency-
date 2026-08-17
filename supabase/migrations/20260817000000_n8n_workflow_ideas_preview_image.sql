-- ============================================================================
-- Yawn — n8n Workflow Scout: add a preview-image column so each brainstormed
-- idea can carry the template screenshot n8n.io publishes alongside it (the
-- "paired photo" requested for the daily brainstorming feed). Additive and
-- idempotent — safe to run against an existing table.
-- ============================================================================

alter table public.n8n_workflow_ideas
  add column if not exists preview_image_url text;

comment on column public.n8n_workflow_ideas.preview_image_url is
  'og:image / template screenshot URL from the source n8n.io workflow page, when scripts/n8n-workflow-scout.mjs was able to capture one (requires FIRECRAWL_API_KEY).';
