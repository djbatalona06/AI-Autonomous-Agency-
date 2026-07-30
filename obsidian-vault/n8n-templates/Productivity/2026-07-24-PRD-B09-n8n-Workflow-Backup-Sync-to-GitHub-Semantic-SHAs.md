---
id: PRD-B09
title: "n8n Workflow Backup & Sync to GitHub (Semantic SHAs)"
vertical: Productivity
new_candidate: true
date_added: 2026-07-24
tags: [n8n-brainstorm, vertical/prd, new-candidate, agency-ops]
---

# n8n Workflow Backup & Sync to GitHub (Semantic SHAs)

[[Productivity Index]] · vertical `PRD`

**Source:** [Back up and sync workflow JSONs with GitHub using semantic SHAs](https://n8n.io/workflows/17352-back-up-and-sync-workflow-jsons-with-github-using-semantic-shas/)

**Summary:** No card yet — proposed PRD-09. Meta: this is Yawn's own ops-tooling gap, not
just a client vertical card — every build this agency ships lives only in the client's n8n
instance until someone manually exports it. Candidate to run against Yawn's own delivery
instance first, then resell as a "workflow version control" retainer add-on.

## Node design

1. Schedule/Manual Trigger
2. n8n API — list all workflows
3. Filter — drop archived
4. Code — deterministic SHA-256 per workflow (nodes/connections/settings)
5. GitHub — check target repo exists; create it if not
6. GitHub — list existing backup files, diff against current SHAs
7. GitHub — create/update files, delete stale ones
