---
tags: [claude-context, repo-map]
repo: djbatalona06/untapped-market
synced: 2026-10-11
---
# untapped-market — file map
Head: 9c545bc 2026-06-15 untapped market buisness upgrade
Tracked files: 200

## Top-level layout
```
.agents/ (4 files)
.claude/ (1 files)
.env.example
.github/ (4 files)
.gitignore
CLAUDE.md
CLAUDE_AI_GENERATION_WORKFLOW.md
INVESTORS.md
New Text Document.txt
README.md
SECURITY.md
Untapped Market Image .zip
Untapped Market v2.0 Implementaion Plan.zip
Untapped-Market-Teaser-Deck.pptx
Untapped-market/ (62 files)
data/ (3 files)
docs/ (3 files)
index.html
job-finder/ (4 files)
legacy/ (2 files)
package-lock.json
package.json
pptx-slides/ (10 files)
public/ (15 files)
schema.sql
scripts/ (17 files)
src/ (45 files)
strains.ts
tsconfig.json
tsconfig.node.json
untapped market map v1.0.png
untapped-market-v1.html
untapped-market.lnk
unzipped-plan/ (8 files)
vite.config.ts
```

## Full file list (path | bytes)
```
.agents/workflows/dispacthing-parralel-agents.md | 22
.agents/workflows/dispensary-sync/daily-menu-sync.md | 2802
.agents/workflows/dispensary-sync/qr-code-task-manager.md | 3413
.agents/workflows/dispensary-sync/wa-or-compliance-checklist.md | 5110
.claude/settings.local.json | 728
.env.example | 1054
.github/workflows/ci.yml | 721
.github/workflows/collect-strains.yml | 2207
.github/workflows/deploy.yml | 1205
.github/workflows/security-review.yml | 5084
.gitignore | 519
CLAUDE.md | 375
CLAUDE_AI_GENERATION_WORKFLOW.md | 9581
INVESTORS.md | 39867
New Text Document.txt | 0
README.md | 2234
SECURITY.md | 510
Untapped Market Image .zip | 497489
Untapped Market v2.0 Implementaion Plan.zip | 552277
Untapped-Market-Teaser-Deck.pptx | 50735
Untapped-market/.env.example | 284
Untapped-market/.gitignore | 234
Untapped-market/.mcp.json | 2756
Untapped-market/.mcp.json.example | 2756
Untapped-market/DESIGN-REVIEW.md | 8344
Untapped-market/MCP_INTEGRATION.md | 9939
Untapped-market/README.md | 4181
Untapped-market/UNTAPPED_MARKET_PROJECT_PROJECTION.md | 21670
Untapped-market/Untapped Market - Investor Brief (offline).html | 1039309
Untapped-market/content/behind-the-app-story.md | 5239
Untapped-market/content/cMNGgLl3XImJO0keHRFK4g@2k.webp | 87728
Untapped-market/content/terpene-tuesday-01-myrcene.md | 5255
Untapped-market/implementation_plan.md | 4208
Untapped-market/index.html | 911
Untapped-market/investors.md | 3168
Untapped-market/package-lock.json | 99350
Untapped-market/package.json | 908
Untapped-market/postcss.config.js | 80
Untapped-market/public/img/hero-hands.jpg | 172318
Untapped-market/public/img/hero-macro.jpg | 184292
Untapped-market/public/img/hero-product.jpg | 76764
Untapped-market/public/img/hero-smoke.jpg | 63505
Untapped-market/src/App.tsx | 2678
Untapped-market/src/components/DispensaryMap.tsx | 2895
Untapped-market/src/components/EmptyState.tsx | 394
Untapped-market/src/components/LabCertCard.tsx | 1416
Untapped-market/src/components/LineageTree.tsx | 1021
Untapped-market/src/components/Nav.tsx | 1164
Untapped-market/src/components/Skeleton.tsx | 1110
Untapped-market/src/components/StrainCard.tsx | 5019
Untapped-market/src/components/TerpeneBar.tsx | 1027
Untapped-market/src/data/dispensary-client-list.json | 11822
Untapped-market/src/data/strains.ts | 30000
Untapped-market/src/index.css | 51834
Untapped-market/src/lib/scrollEngine.ts | 3069
Untapped-market/src/lib/supabase.ts | 835
Untapped-market/src/lib/utils.ts | 198
Untapped-market/src/main.tsx | 423
Untapped-market/src/pages/AdminPage.tsx | 3216
Untapped-market/src/pages/CatalogPage.tsx | 7036
Untapped-market/src/pages/ExplorePage.tsx | 6869
Untapped-market/src/pages/FinderPage.tsx | 3690
Untapped-market/src/pages/HomePage.tsx | 20048
Untapped-market/src/pages/LibraryPage.tsx | 5449
Untapped-market/src/pages/NotFoundPage.tsx | 474
Untapped-market/src/pages/PremiumPage.tsx | 6192
Untapped-market/src/pages/StrainDetailPage.tsx | 15759
Untapped-market/src/scripts/agent-data-ingest.ts | 4737
Untapped-market/src/store/index.ts | 354
Untapped-market/src/store/mockData.ts | 38417
Untapped-market/src/store/types.ts | 2039
Untapped-market/src/store/useStore.ts | 2387
Untapped-market/strains-kushy_api.2017-11-14.csv | 1709296
Untapped-market/supabase/README.md | 907
Untapped-market/supabase/schema.sql | 11448
Untapped-market/supabase/seed.sql | 8660
Untapped-market/tailwind.config.js | 725
Untapped-market/tsconfig.app.json | 597
Untapped-market/tsconfig.json | 119
Untapped-market/tsconfig.node.json | 338
Untapped-market/untapped-market-investor.html | 52059
Untapped-market/vite.config.ts | 301
data/cannabis-market-scan-leafly-weedmaps.json | 1326
data/sources/kushy-strains.20171114.csv | 1709296
data/strain-image-manifest.example.json | 2363
docs/IMAGE_SOURCING_WORKFLOW.md | 9454
docs/LAUNCH.md | 3377
docs/superpowers/specs/2026-06-09-personal-ai-job-finder-design.md | 4012
index.html | 1032
job-finder/resumes/DJ-Batalona-Resume-Ops.docx | 10231
job-finder/resumes/DJ-Batalona-Resume-Ops.pdf | 53568
job-finder/resumes/DJ-Batalona-Resume-Tech.docx | 10529
job-finder/resumes/DJ-Batalona-Resume-Tech.pdf | 56284
legacy/README.md | 573
legacy/archive/untapped-market-v1.html | 88576
package-lock.json | 65142
package.json | 1178
pptx-slides/ppt/slides/slide1.xml | 7198
pptx-slides/ppt/slides/slide10.xml | 20316
pptx-slides/ppt/slides/slide2.xml | 13192
pptx-slides/ppt/slides/slide3.xml | 16549
pptx-slides/ppt/slides/slide4.xml | 15845
pptx-slides/ppt/slides/slide5.xml | 18156
pptx-slides/ppt/slides/slide6.xml | 16910
pptx-slides/ppt/slides/slide7.xml | 24465
pptx-slides/ppt/slides/slide8.xml | 14048
pptx-slides/ppt/slides/slide9.xml | 20569
public/_redirects | 24
public/img/hero-hands.jpg | 172318
public/img/hero-macro.jpg | 184292
public/img/hero-product.jpg | 76764
public/img/hero-smoke.jpg | 63505
public/img/strains/ballard-blueberry.png | 810395
public/img/strains/capitol-hill-lemon.png | 863037
public/img/strains/cascadia-haze.png | 834245
public/img/strains/emerald-city-diesel.png | 871364
public/img/strains/fremont-fire.png | 789066
public/img/strains/hood-river-haze.png | 752505
public/img/strains/olympic-fog.png | 885390
public/img/strains/puget-sound-cbd.png | 712807
public/img/strains/rainier-kush.png | 962980
public/img/strains/willamette-valley-og.png | 890125
schema.sql | 15349
scripts/apply-image-manifest.mjs | 13260
scripts/collect.mjs | 6918
scripts/dev/extract-data.mjs | 4256
scripts/generate-strain-images.mjs | 21933
scripts/import-kushy.mjs | 6126
scripts/lib/counties.mjs | 4711
scripts/lib/geocode.mjs | 7013
scripts/lib/pnw.mjs | 1711
scripts/lib/schema.mjs | 4285
scripts/setup/provision-cloudflare.sh | 1938
scripts/sources/kushy-strains.mjs | 8574
scripts/sources/or-olcc.mjs | 1537
scripts/sources/product-images.mjs | 29769
scripts/sources/strains-seed.mjs | 5206
scripts/sources/wa-lcb.mjs | 1724
scripts/validate-data.mjs | 1261
scripts/validate-pnw.mjs | 1254
src/App.tsx | 2619
src/components/BottomDrawer.tsx | 730
src/components/DispensaryMap.tsx | 5502
src/components/EtherealLinks.tsx | 1163
src/components/Nav.tsx | 4049
src/components/NotificationCenter.tsx | 2106
src/components/StrainCard.tsx | 3937
src/components/Toast.tsx | 371
src/components/auth/AdminGate.tsx | 1964
src/components/auth/AuthModal.tsx | 2590
src/components/auth/LogInForm.tsx | 2568
src/components/auth/SignUpForm.tsx | 3333
src/components/social/FeedPost.tsx | 10857
src/components/social/SocialFeed.tsx | 1730
src/components/social/StoriesRow.tsx | 1017
src/components/tweaks/TweaksPanel.tsx | 3763
src/components/tweaks/useTweaks.ts | 2116
src/data/dispensaries.json | 117689
src/data/dispensaries.ts | 559
src/data/mockData.ts | 5954
src/data/socialFeed.ts | 9940
src/data/strains.json | 820244
src/data/strains.ts | 219
src/index.css | 69255
src/lib/auth.ts | 4266
src/lib/counties.ts | 2809
src/lib/media.ts | 6538
src/lib/recommender.ts | 3682
src/lib/scrollEngine.ts | 3069
src/lib/supabase.ts | 2096
src/main.tsx | 275
src/pages/AccountPage.tsx | 4178
src/pages/AdminPage.tsx | 8155
src/pages/CatalogPage.tsx | 7621
src/pages/ExplorePage.tsx | 710
src/pages/FinderPage.tsx | 5605
src/pages/HomePage.tsx | 10385
src/pages/LibraryPage.tsx | 7765
src/pages/PremiumPage.tsx | 5008
src/pages/QuizPage.tsx | 5981
src/pages/StrainDetailPage.tsx | 11693
src/scripts/ai-photo-prompts.ts | 3921
src/store/useStore.ts | 8051
src/types.ts | 4450
src/vite-env.d.ts | 597
strains.ts | 16360
tsconfig.json | 640
tsconfig.node.json | 233
untapped market map v1.0.png | 29451
untapped-market-v1.html | 88576
untapped-market.lnk | 996
unzipped-plan/design_handoff_untapped_market_v2_2/CODEBASE_NOTES.md | 6824
unzipped-plan/design_handoff_untapped_market_v2_2/README.md | 22579
unzipped-plan/design_handoff_untapped_market_v2_2/Untapped Market.html | 154380
unzipped-plan/design_handoff_untapped_market_v2_2/img/hero-hands.jpg | 172318
unzipped-plan/design_handoff_untapped_market_v2_2/img/hero-macro.jpg | 184292
unzipped-plan/design_handoff_untapped_market_v2_2/img/hero-product.jpg | 76764
unzipped-plan/design_handoff_untapped_market_v2_2/img/hero-smoke.jpg | 63505
unzipped-plan/design_handoff_untapped_market_v2_2/tweaks-panel.jsx | 23873
vite.config.ts | 162
```

## Recent commits (last 15)
- 9c545bc 2026-06-15 untapped market buisness upgrade
- 367a631 2026-06-03 Merge branch 'main' of https://github.com/djbatalona06/untapped-market
- 28973dc 2026-06-03 Add dispensary sync workflows, client list, and design assets
- 20bc43c 2026-06-02 Initial commit — Untapped Market v1 full project snapshot
- 429d247 2026-06-01 Merge pull request #10 from djbatalona06/claude/hopeful-allen-D4YQj
- 1a090d5 2026-06-01 feat: expand catalog from CSV, add social feed, image pipelines
- 1e4d05f 2026-06-01 Add batalona06@gmail.com as admin in schema bootstrap
- f37e181 2026-06-01 Set Supabase URL, anon key, and admin emails
- bcd4f49 2026-06-01 Merge pull request #8 from djbatalona06/claude/gifted-galileo-haWas
- d4cc9cf 2026-06-01 Fix CI: commit src/vite-env.d.ts (was swallowed by .gitignore)
- d9fc3c3 2026-06-01 ci: re-trigger build (transient npm install flake on prior run)
- 51088e0 2026-06-01 Phase A+B: Supabase auth + strain media pipeline
- dbff708 2026-06-01 Merge pull request #7 from djbatalona06/claude/loving-cori-ey5Sy
- a191727 2026-06-01 Complete data agent, PNW availability, security review, bundle Leaflet CSS
- 3a2cea5 2026-05-30 Infra + data pipeline for public launch (no visual changes)
