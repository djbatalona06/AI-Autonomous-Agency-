---
tags: [claude-context, repo-map]
repo: djbatalona06/AI-Autonomous-Agency-
synced: 2026-10-11
---
# AI-Autonomous-Agency- — file map
Head: 9fada5f 2026-07-29 n8n brainstorm: daily scrape 2026-07-25 (B10 x5 verticals) + fix Action failure (#42)
Tracked files: 219

## Top-level layout
```
.agents/ (2 files)
.claude/ (5 files)
.codex/ (5 files)
.env.example
.github/ (10 files)
.gitignore
.gitleaks.toml
README.md
SECURITY.md
api/ (1 files)
assets/ (1 files)
docs/ (25 files)
index.html
n8n-workflows/ (9 files)
obsidian-vault/ (56 files)
package-lock.json
package.json
public/ (6 files)
scripts/ (6 files)
server/ (16 files)
shared/ (1 files)
src/ (54 files)
supabase/ (11 files)
tsconfig.json
vercel.json
vite.config.ts
```

## Full file list (path | bytes)
```
.agents/skills/AI-Autonomous-Agency-/SKILL.md | 1764
.agents/skills/AI-Autonomous-Agency-/agents/openai.yaml | 306
.claude/ecc-tools.json | 7642
.claude/homunculus/instincts/inherited/AI-Autonomous-Agency--instincts.yaml | 6743
.claude/identity.json | 311
.claude/launch.json | 190
.claude/skills/AI-Autonomous-Agency-/SKILL.md | 1764
.codex/AGENTS.md | 929
.codex/agents/docs-researcher.toml | 316
.codex/agents/explorer.toml | 314
.codex/agents/reviewer.toml | 295
.codex/config.toml | 1247
.env.example | 2675
.github/codeql/codeql-config.yml | 441
.github/dependabot.yml | 851
.github/workflows/backup-restore-test.yml | 1277
.github/workflows/ci.yml | 697
.github/workflows/codeql.yml | 872
.github/workflows/dependency-review.yml | 1684
.github/workflows/n8n-brainstorm-scrape.yml | 5665
.github/workflows/n8n-workflow-scout.yml | 2447
.github/workflows/npm-audit.yml | 2669
.github/workflows/secret-scan.yml | 919
.gitignore | 159
.gitleaks.toml | 1167
README.md | 8740
SECURITY.md | 2658
api/index.js | 2277435
assets/images/YawnAgencyBackground.png | 1352592
docs/brainstorming/n8n-workflow-scout/2026-07-17.md | 16957
docs/brainstorming/n8n-workflow-scout/README.md | 2265
docs/n8n-brainstorm/README.md | 3195
docs/n8n-brainstorm/ecommerce.md | 7858
docs/n8n-brainstorm/productivity.md | 8388
docs/n8n-brainstorm/sales.md | 7977
docs/n8n-brainstorm/small-business.md | 7617
docs/n8n-brainstorm/wholesaling-rei.md | 8713
docs/n8n-brainstorming/2026-07-15.md | 11122
docs/n8n-brainstorming/2026-07-22.md | 5363
docs/n8n-brainstorming/README.md | 3428
docs/n8n-brainstorming/latest.md | 5363
docs/security/README.md | 2354
docs/security/access-review-template.md | 2232
docs/security/asset-inventory.md | 2287
docs/security/compliance-calendar.md | 4078
docs/security/compliance-framework.md | 9808
docs/security/data-classification.md | 2263
docs/security/incident-response-runbook.md | 3648
docs/security/penetration-test-plan.md | 3185
docs/security/security-awareness-training.md | 2038
docs/security/security-controls-matrix.md | 5777
docs/security/soc2-readiness.md | 3216
docs/security/vendor-register.md | 1934
docs/superpowers/specs/2026-07-03-yawn-upgrade-design.md | 14022
index.html | 1381
n8n-workflows/README.md | 3908
n8n-workflows/_inbox/2026-07-20-scrape-log.md | 4476
n8n-workflows/_inbox/2026-07-22-scrape-log.md | 5761
n8n-workflows/_index.md | 2277
n8n-workflows/ecommerce/README.md | 4688
n8n-workflows/productivity/README.md | 5068
n8n-workflows/sales/README.md | 5585
n8n-workflows/small-business/README.md | 4635
n8n-workflows/wholesaling-rei/README.md | 5929
obsidian-vault/n8n-templates/Ecommerce/2026-07-19-ECM-B01-AI-Abandoned-Checkout-Recovery.md | 668
obsidian-vault/n8n-templates/Ecommerce/2026-07-19-ECM-B02-Post-Purchase-Review-UGC-Funnel.md | 627
obsidian-vault/n8n-templates/Ecommerce/2026-07-19-ECM-B03-Low-Stock-Restock-Waitlist-Blast.md | 649
obsidian-vault/n8n-templates/Ecommerce/2026-07-19-ECM-B04-Competitor-Price-Intelligence-Monitor.md | 630
obsidian-vault/n8n-templates/Ecommerce/2026-07-19-ECM-B05-AI-Win-Back-Reactivation-Sequence.md | 633
obsidian-vault/n8n-templates/Ecommerce/2026-07-21-ECM-B06-AI-Customer-Support-Chatbot-with-Order-Memory.md | 874
obsidian-vault/n8n-templates/Ecommerce/2026-07-22-ECM-B07-AI-Seasonal-Product-Photo-Restyler.md | 1123
obsidian-vault/n8n-templates/Ecommerce/2026-07-23-ECM-B08-Auto-Segment-Customers-by-Purchase-Behavior.md | 996
obsidian-vault/n8n-templates/Ecommerce/2026-07-24-ECM-B09-Brand-Impersonation-Deepfake-Threat-Hunter.md | 1270
obsidian-vault/n8n-templates/Ecommerce/2026-07-25-ECM-B10-Order-Confirmation-Team-Notification-Starter.md | 1139
obsidian-vault/n8n-templates/Ecommerce/Ecommerce Index.md | 1258
obsidian-vault/n8n-templates/Productivity/2026-07-19-PRD-B01-AI-Email-Triage-Draft-Replies.md | 794
obsidian-vault/n8n-templates/Productivity/2026-07-19-PRD-B02-Meeting-Transcript-Action-Items-Tasks.md | 841
obsidian-vault/n8n-templates/Productivity/2026-07-19-PRD-B03-7-AM-AI-Daily-Brief-hardening-ideas.md | 809
obsidian-vault/n8n-templates/Productivity/2026-07-19-PRD-B04-Doc-Report-Generator-on-Schedule.md | 619
obsidian-vault/n8n-templates/Productivity/2026-07-19-PRD-B05-Inbound-File-Structured-Data-Sheet.md | 701
obsidian-vault/n8n-templates/Productivity/2026-07-21-PRD-B06-Voice-Memo-Structured-Brief-Task-Capture.md | 853
obsidian-vault/n8n-templates/Productivity/2026-07-22-PRD-B07-Notion-Workspace-Dedup-Audit-Bot.md | 959
obsidian-vault/n8n-templates/Productivity/2026-07-23-PRD-B08-Notion-AI-Assistant-via-MCP-for-Task-Content-Management.md | 1390
obsidian-vault/n8n-templates/Productivity/2026-07-24-PRD-B09-n8n-Workflow-Backup-Sync-to-GitHub-Semantic-SHAs.md | 1198
obsidian-vault/n8n-templates/Productivity/2026-07-25-PRD-B10-Cost-Optimized-Email-Triage-Groq-Llama-3.3-variant.md | 1118
obsidian-vault/n8n-templates/Productivity/Productivity Index.md | 1292
obsidian-vault/n8n-templates/README.md | 1056
obsidian-vault/n8n-templates/Sales/2026-07-19-SAL-B01-AI-Lead-Enrichment-CRM-Router.md | 677
obsidian-vault/n8n-templates/Sales/2026-07-19-SAL-B02-Cold-Outreach-Multichannel-Sequencer.md | 653
obsidian-vault/n8n-templates/Sales/2026-07-19-SAL-B03-AI-Proposal-Quote-Generator.md | 628
obsidian-vault/n8n-templates/Sales/2026-07-19-SAL-B04-Meeting-Booked-CRM-AI-Call-Prep.md | 647
obsidian-vault/n8n-templates/Sales/2026-07-19-SAL-B05-Stale-Deal-Pipeline-Rot-Digest.md | 577
obsidian-vault/n8n-templates/Sales/2026-07-21-SAL-B06-AI-Reply-Tracking-Follow-Up-Nudger.md | 824
obsidian-vault/n8n-templates/Sales/2026-07-22-SAL-B07-AI-LinkedIn-Enrichment-Personalized-Outreach-Generator.md | 1430
obsidian-vault/n8n-templates/Sales/2026-07-23-SAL-B08-Real-Time-Sales-Pipeline-Analytics-Stalled-Deal-Alerts.md | 981
obsidian-vault/n8n-templates/Sales/2026-07-24-SAL-B09-Google-Maps-Local-Business-Enrichment-Territory-Prospecting-List.md | 1127
obsidian-vault/n8n-templates/Sales/2026-07-25-SAL-B10-Full-Lead-to-Meeting-AI-Pipeline.md | 1309
obsidian-vault/n8n-templates/Sales/Sales Index.md | 1261
obsidian-vault/n8n-templates/Small-Business/2026-07-19-SMB-B01-Client-Intake-Booking-Confirmation.md | 659
obsidian-vault/n8n-templates/Small-Business/2026-07-19-SMB-B02-Invoice-Payment-Auto-Follow-Up.md | 612
obsidian-vault/n8n-templates/Small-Business/2026-07-19-SMB-B03-New-Hire-Onboarding-Orchestration.md | 625
obsidian-vault/n8n-templates/Small-Business/2026-07-19-SMB-B04-Review-Reputation-Engine.md | 712
obsidian-vault/n8n-templates/Small-Business/2026-07-19-SMB-B05-Appointment-No-Show-Reducer.md | 655
obsidian-vault/n8n-templates/Small-Business/2026-07-21-SMB-B06-WhatsApp-AI-Customer-Support-Autoresponder.md | 876
obsidian-vault/n8n-templates/Small-Business/2026-07-22-SMB-B07-Inbound-Vendor-Invoice-OCR-AP-Auto-Entry.md | 1354
obsidian-vault/n8n-templates/Small-Business/2026-07-23-SMB-B08-AI-Request-to-Quote-PDF-Generator.md | 1196
obsidian-vault/n8n-templates/Small-Business/2026-07-24-SMB-B09-Contractor-Vendor-License-Verification-for-Lead-Lists.md | 1156
obsidian-vault/n8n-templates/Small-Business/2026-07-25-SMB-B10-Insurance-Quote-Lead-Routing.md | 1154
obsidian-vault/n8n-templates/Small-Business/Small Business Index.md | 1193
obsidian-vault/n8n-templates/Wholesaling-REI/2026-07-19-WHL-B01-Skip-Trace-Lead-Scoring-Intake.md | 853
obsidian-vault/n8n-templates/Wholesaling-REI/2026-07-19-WHL-B02-Cash-Buyer-Dispo-Match-Blast.md | 655
obsidian-vault/n8n-templates/Wholesaling-REI/2026-07-19-WHL-B03-County-Motivated-List-Ingestion-Dedupe.md | 692
obsidian-vault/n8n-templates/Wholesaling-REI/2026-07-19-WHL-B04-Deal-Analyzer-Intake-ARV-MAO-Brief.md | 667
obsidian-vault/n8n-templates/Wholesaling-REI/2026-07-19-WHL-B05-Open-House-Inbound-Call-7-Day-AI-Follow-Up.md | 737
obsidian-vault/n8n-templates/Wholesaling-REI/2026-07-21-WHL-B06-Inbound-Lead-Auto-Router-by-Intent-Rent-Sell-Buy-AI-Personalization.md | 883
obsidian-vault/n8n-templates/Wholesaling-REI/2026-07-22-WHL-B07-Post-Closing-Testimonial-Reputation-Engine.md | 1326
obsidian-vault/n8n-templates/Wholesaling-REI/2026-07-23-WHL-B08-SMS-Based-AI-Real-Estate-Lead-Qualifier.md | 1075
obsidian-vault/n8n-templates/Wholesaling-REI/2026-07-24-WHL-B09-Automated-Off-Market-Property-Lead-Generation-BatchData-CRM.md | 1528
obsidian-vault/n8n-templates/Wholesaling-REI/2026-07-25-WHL-B10-Property-Lead-Scoring-Engine-BatchData.md | 1271
obsidian-vault/n8n-templates/Wholesaling-REI/Wholesaling REI Index.md | 1352
package-lock.json | 229708
package.json | 1868
public/animations/yawn-koala/assets/fonts/montserrat-300.woff2 | 18708
public/animations/yawn-koala/assets/fonts/oswald-700.woff2 | 12672
public/animations/yawn-koala/index.html | 40155
public/robots.txt | 265
public/sitemap.xml | 982
public/yawn-koala.png | 1999107
scripts/backup-store.mjs | 5659
scripts/build-api.mjs | 728
scripts/generate-sitemap.ts | 1520
scripts/n8n-workflow-scout.mjs | 8233
scripts/restore-store.mjs | 4700
scripts/test-backup-restore.mjs | 4686
server/_core/auth.ts | 1109
server/_core/cookies.ts | 1231
server/_core/env.ts | 1624
server/_core/imageGeneration.ts | 3504
server/_core/llm.ts | 6511
server/_core/scrape.ts | 6074
server/_core/security.ts | 5525
server/_core/systemRouter.ts | 460
server/app.ts | 1844
server/context.ts | 2085
server/db.ts | 5088
server/index.ts | 1453
server/routers.ts | 6325
server/schema.ts | 1859
server/trpc.ts | 548
server/vercelEntry.ts | 601
shared/const.ts | 209
src/App.tsx | 2798
src/_core/hooks/useAuth.ts | 358
src/components/AboutOwner.tsx | 4006
src/components/AuthModal.tsx | 9395
src/components/BorderGlow.tsx | 2500
src/components/ChatAgent.tsx | 4262
src/components/DashboardLayout.tsx | 4937
src/components/ErrorBoundary.tsx | 1328
src/components/HeroKoala.tsx | 4410
src/components/HeroMetrics.tsx | 4394
src/components/OptionWheel.tsx | 4669
src/components/ParticleField.tsx | 6549
src/components/RequireAuth.tsx | 897
src/components/Seo.tsx | 2008
src/components/SiteChrome.tsx | 2857
src/components/ui/button.tsx | 1815
src/components/ui/input.tsx | 623
src/components/ui/markdown.tsx | 1482
src/components/ui/sonner.tsx | 387
src/components/ui/spinner.tsx | 321
src/components/ui/tooltip.tsx | 330
src/const.ts | 249
src/content/tutorials/automate-abandoned-cart-recovery.md | 2072
src/content/tutorials/automate-client-intake-service-business.md | 1861
src/content/tutorials/automate-email-triage-daily-brief.md | 1933
src/content/tutorials/automate-lead-capture-crm-sales.md | 1744
src/content/tutorials/automate-lead-follow-up-wholesalers.md | 2220
src/contexts/AuthContext.tsx | 3988
src/contexts/ThemeContext.tsx | 534
src/data/brainstormIdeas.ts | 15259
src/data/brand.ts | 958
src/data/n8nBrainstorm.ts | 35407
src/data/verticals.ts | 12931
src/index.css | 6420
src/lib/supabase.ts | 1222
src/lib/trpc.ts | 159
src/lib/tutorials.ts | 1375
src/lib/useReducedMotion.ts | 525
src/lib/utils.ts | 233
src/main.tsx | 1138
src/pages/Catalog.tsx | 6409
src/pages/CatalogVertical.tsx | 6071
src/pages/Dashboard.tsx | 2919
src/pages/Help.tsx | 1610
src/pages/Home.tsx | 8850
src/pages/ImageStudio.tsx | 4934
src/pages/NotFound.tsx | 592
src/pages/Pricing.tsx | 4771
src/pages/ProjectHistory.tsx | 2944
src/pages/Settings.tsx | 2379
src/pages/TutorialDetail.tsx | 4028
src/pages/Tutorials.tsx | 3236
src/pages/WebCrawler.tsx | 7270
src/vite-env.d.ts | 38
supabase/.gitignore | 72
supabase/README.md | 5814
supabase/config.toml | 15564
supabase/migrations/0001_init_schema.sql | 11054
supabase/migrations/0002_row_level_security.sql | 10594
supabase/migrations/0003_roles_least_privilege.sql | 8949
supabase/migrations/0004_audit_and_retention.sql | 7347
supabase/migrations/20260703120000_auth_and_rate_limit.sql | 4431
supabase/migrations/20260703120100_project_data.sql | 2731
supabase/migrations/20260716000000_n8n_workflow_ideas.sql | 2058
supabase/migrations/README.md | 2703
tsconfig.json | 631
vercel.json | 1335
vite.config.ts | 673
```

## Recent commits (last 15)
- 9fada5f 2026-07-29 n8n brainstorm: daily scrape 2026-07-25 (B10 x5 verticals) + fix Action failure (#42)
- 2571b99 2026-07-29 n8n brainstorm: daily scrape 2026-07-24 (B09 x5 verticals) (#41)
- 3237181 2026-07-29 n8n brainstorm: daily scrape 2026-07-23 (B08 x5 verticals) (#40)
- 732748b 2026-07-29 n8n brainstorm: daily scrape 2026-07-22 (B07 x5 verticals) (#39)
- 0edec59 2026-07-29 fix: n8n Template Brainstorm Scrape workflow missing id-token permission (#48)
- 1769320 2026-07-25 Merge pull request #35 from djbatalona06/dependabot/github_actions/actions-all-5a43fa71c1
- 45c9664 2026-07-25 Merge pull request #33 from djbatalona06/dependabot/npm_and_yarn/framer-motion-12.42.2
- 766d318 2026-07-21 Merge pull request #38 from djbatalona06/claude/funny-wright-3b478r
- 52a666a 2026-07-21 Merge pull request #37 from djbatalona06/claude/funny-wright-dp4g0f
- e974a58 2026-07-21 Merge branch 'main' into claude/funny-wright-dp4g0f
- 385b925 2026-07-21 chore(deps): Bump framer-motion from 11.18.2 to 12.42.2
- 8df5188 2026-07-21 Merge pull request #32 from djbatalona06/dependabot/npm_and_yarn/types/node-26.1.1
- bf5d86a 2026-07-21 Merge pull request #30 from djbatalona06/dependabot/npm_and_yarn/npm-minor-patch-11ece85c36
- 236e578 2026-07-21 n8n brainstorm: daily scrape 2026-07-21
- 7b84550 2026-07-20 Add n8n template library with node designs for all 5 verticals
