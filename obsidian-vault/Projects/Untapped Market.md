---
tags: [project, venture, cannabis]
---

# Untapped Market

**Repo:** `djbatalona06/untapped-market`
**What it is:** PNW cannabis strain/dispensary discovery app, positioned as **"Letterboxd for
cannabis"** — not a delivery/commerce app. Tagline: "State-of-the-art Pacific Northwest cannabis
discovery."

## Product

- v2.0, Vite + React 18 + TypeScript + Zustand + Leaflet/react-leaflet + Supabase. Legacy v1 was a
  single self-contained `untapped-market-v1.html` file, kept as design reference.
- Deployed on Cloudflare Pages (`untapped-market.pages.dev`). CI: daily strain-data collector +
  daily CodeQL/npm-audit/secret-tripwire security review.
- Visual identity: forest/biophilic dark theme (`#07090A` bg), DM Serif Display + Outfit + DM Mono.
- Features: AI Strain Match quiz (4-step terpene-aware recommender), live inventory/restock
  alerts, personal strain "library," per-batch COA (lab test) data, tiered plans.
- Data: 30 cultivars with Type I–IV chemotype/terpene data, 100+ verified Seattle-area
  dispensaries geocoded on the map.

## Business model (from `INVESTORS.md`)

1. B2C subscriptions — Free / $7 Premium / $19 Pro (proposed).
2. Dispensary lead-gen/affiliate — CPC $0.50–2, CPL $5–20, 3–8% rev-share.
3. Dispensary B2B SaaS dashboard — $199–$799/mo tiers.
4. Data licensing to cultivators/brands/labs — $2K–60K+ reports/subscriptions.

3-year illustrative ARR: ~$140K (Y1) → ~$916K (Y2) → ~$4.16M (Y3).

## Fundraising

Full ladder: pre-seed $300–500K → seed $1.5–3M → Series A $8–15M. See
[[Companies/Untapped Market Investor Targets]] for the named target list. Also has an investor
teaser deck (`Untapped-Market-Teaser-Deck.pptx`), a metrics one-pager template, and a dispensary
LOI legal template.

## Role Claude/Hermes should play here

Per `untapped-market/CLAUDE.md`: full-stack dev, marketer, UI/UX designer, website
generator/auditor, and investor/lead researcher — the goal is revenue and continued deployment,
not just code correctness.
