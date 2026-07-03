# Yawn Agency App — Stackgrid Upgrade & Content Merge

**Design doc** · 2026-07-03 · Author: DJ + Claude (brainstorming)
**Repo:** `C:\Users\batal\AI-Autonomous-Agency-` (GitHub `djbatalona06/AI-Autonomous-Agency-`, branch `main`)
**Live:** `ai-autonomous-agency.vercel.app`

---

## 1. Context & what's actually here

The app is a self-contained full-stack React app: **React 19 + Vite 6 + Express/tRPC + Wouter + Tailwind CSS 4 + framer-motion 11**, deployed to Vercel as a serverless function (`api/index.js` bundled from `server/vercelEntry.ts`).

A prior planning handoff assumed a set of files that are **not in this repo**. Reconciliation (verified 2026-07-03):

| Asset | Reality |
|---|---|
| `site/` marketing site | Exists only in a **sibling folder** of a *different local clone*: `…\Downloads\AI Projects\AI-Automation-Agency\site\` (its own git repo). Never committed to this repo. |
| `KoalaShowcase.tsx`, `public/animations/yawn-koala/` | Exist only in a **buried nested copy** at `…\AI-Autonomous-Agency-\.git\hooks\AI-Autonomous-Agency-\`. Not in the committed tree. |
| `Yawn Koala image.png` | `…\Downloads\AI Projects\AI-Automation-Agency\site\assets\Yawn Koala image.png` |
| Supabase | **Not wired in.** Data persists to a JSON file (`server/.data/store.json`). `server/schema.ts` has a Drizzle schema as a "graduate later" stub only. |
| Auth | **Fake demo.** `GET /api/auth/login?email=` signs anyone in with a signed cookie — no password. |
| Theme | `src/index.css` is a **purple "Kinetic Brutalism"** theme (`#ecdaf2` pale-purple bg, hard black borders, 0px radius), `ThemeProvider defaultTheme="light"`. This purple light theme is the reported "white header." |
| Brand | App = **"Yawn"** / "Automate the Boring." Site content = **"theWRENCH"** / "Automations worth talking about." |

**Source of truth for imported content:** `…\Downloads\AI Projects\AI-Automation-Agency\site\` — `assets/content.js` (5 verticals, 25 templates), `assets/config.js` (Supabase URL, empty anon key, lockout config), `assets/app.js` (bubble grid + auth + lockout logic), `index.html` (section structure + dark palette + auth modal), `supabase/migrations/0001_auth_and_rate_limit.sql` (profiles, login_attempts, `login_status`/`record_login_attempt` RPCs).

## 2. Confirmed decisions

1. **Home background** — mouse-tracking **particle field** (constellation of drifting nodes, orange/yellow accents, lines connect near cursor, repel/attract on hover). Canvas-based.
2. **Auth** — **full migration to Supabase Auth** as the single source of truth. Retire the fake demo cookie login. Reuse the already-written `profiles` + `login_attempts` tables and the `login_status` / `record_login_attempt` RPCs for the 3-attempts / 15-minute lockout.
3. **Koala** — **redesign natively with framer-motion** (scroll-triggered reveal, spring float, glow), using the real PNG. Retire the 32s GSAP iframe entirely.
4. **Working directory** — build in the primary cwd `C:\Users\batal\AI-Autonomous-Agency-`; **import** `site/` content, koala PNG, and the migration from the Downloads tree, then commit.
5. **Sequencing** — **foundation-first**, 4 phases (below).
6. **Branding** — unify under **Yawn** + the koala mascot; port theWRENCH's catalog/pricing/copy, lightly rewritten into Yawn's voice.
7. **Palette** — replace the purple Kinetic Brutalism tokens with the **dark Yawn palette** (`#0a0b0d` bg · `#ff5c35` orange · `#ffd23f` yellow, soft `#23272f` lines, rounded radii), and apply **Stackgrid** patterns (bracket nav `[Link]`, crosshair `+` corner markers, dashed-border grid sections, editorial serif headings, dark pill badges).

## 3. Design language (Stackgrid, dark Yawn)

Adopted from `site/index.html` + the Framer Stackgrid reference, in dark mode:

- **Palette (new `@theme` tokens in `src/index.css`):** `background #0a0b0d`, `bg2 #101216`, `card/panel #14171c`, `foreground #f4f5f7`, `muted-foreground #9aa3af`, `faint #6b7280`, `primary #ff5c35` (fg `#1a0a04`), `accent2/yellow #ffd23f`, `border #23272f`, `good #39d98a`, `bad #ff5470`. Hero background gets the radial warm glow `radial-gradient(1200px 600px at 70% -10%, #1a1410, transparent 60%)`.
- **Radius shift:** current app forces `0px` (brutalist). Move to Stackgrid's **rounded** scale — `sm 10px · md 14px · lg 18px · pill 999px`. *(This is a deliberate departure from the hard 0px brutalist frame; flagged in §7.)*
- **Type:** keep `Inter` for body; add an **editorial serif display** face for headings (e.g. a variable serif) for the Stackgrid look. Load via `@font-face` or a self-hosted woff2.
- **Motifs:** bracket nav links `[ Verticals ]`; `+` crosshair markers at section corners; dashed-border 2×2 grid section wrappers; dark pill section badges; hub-and-spoke diagram for "how it works."
- **Motion:** framer-motion throughout — staggered reveals (existing `container`/`item` variants in `Home.tsx` are a good base), `whileInView` scroll reveals, spring physics for the koala. All gated by `usePrefersReducedMotion()` (already present).

## 4. Phased implementation

### Phase 1 — Dark theme + particle background (foundation, visible) ✅ DONE (2026-07-03)
> Implemented + verified: dark Yawn tokens in `index.css`, `ParticleField.tsx` (mouse-reactive constellation, reduced-motion + tab-hidden safe), `Home.tsx` restyled (Stackgrid hero, serif headline, bracket nav, crosshair cards), pill buttons, dark toast/chat/theme-default. `typecheck` + `build` pass; hero + features screenshot-confirmed. All purple remnants removed.

- **`src/index.css`** — replace the purple `@theme` block with the dark Yawn tokens + rounded radii + serif display font. Update the hero glow. Keep the marquee + reduced-motion backstops.
- **`src/contexts/ThemeContext.tsx`** — verify how it applies themes (`.dark` class vs token swap). Make **dark the default** (app is dark-only for now). Confirm no component hard-codes the old purple.
- **`src/components/ParticleField.tsx`** (new) — canvas constellation. Responsive node count, DPR-capped, `requestAnimationFrame`, pauses on tab hidden / when offscreen. Nodes in `foreground/faint`; accent nodes + near-cursor connector lines in `primary`/`accent2`. Mouse repel/attract. Reduced-motion → static sparse field. Mount fixed behind the hero (`z-0`), content `z-10`.
- **`src/pages/Home.tsx`** — restyle hero with Stackgrid motifs (bracket nav, eyebrow, serif headline, crosshair corners), particle bg behind hero, dark tokens. Keep the automation-feed marquee (restyle).
- **Exit:** home renders dark with a live particle hero; `npm run build` + `typecheck` pass; no purple remnants.

### Phase 2 — Supabase Auth foundation (replaces fake login)
- **Deps/env** — add `@supabase/supabase-js`. Env: `VITE_SUPABASE_URL` (`https://ijtqhysxbjloagmfzrtu.supabase.co`), `VITE_SUPABASE_ANON_KEY` *(currently empty — **must be supplied**, see §7)*, and server-side `SUPABASE_SERVICE_ROLE_KEY` + JWT verification secret. Add to `.env.example` and Vercel.
- **`src/lib/supabase.ts`** (new) — browser client from the `VITE_` env vars.
- **Migration** — run `0001_auth_and_rate_limit.sql` in the Supabase project (via Supabase MCP `apply_migration` **iff** the MCP is bound to project `ijtqhysxbjloagmfzrtu`; otherwise user runs it in the SQL editor). Then promote `batalona06@gmail.com` to `admin` in `profiles`.
- **`src/_core/hooks/useAuth.ts`** — rewrite over Supabase: `getSession` + `onAuthStateChange`; expose `user`, `role` (from `profiles`), `isAuthenticated`, `isLoading`, `signIn`, `signUp`, `signOut`. Remove the tRPC `auth.me`/`getLoginUrl` path.
- **Auth UI** — real email/password sign-in / sign-up (modal or `/login` route) modeled on `site/`'s `authModal`: tabs, min-8 password, error/ok/info states. Lockout: call `login_status` RPC before attempting; on result call `signInWithPassword`; record via `record_login_attempt`. Show retry-after countdown.
- **`src/components/RequireAuth.tsx`** — works largely unchanged once `useAuth` is Supabase-backed. Add an admin-gated variant for the admin console.
- **Server bridge (highest-risk item)** — the tRPC procedures (image gen, scrape, history) currently trust the signed cookie. Rework `server/context.ts` to verify the **Supabase access token** (`Authorization: Bearer`) sent from the client and resolve the user, replacing `server/_core/auth.ts`. Client `src/lib/trpc.ts` attaches the token.
- **Exit:** real accounts sign in/up with working lockout; protected routes + tRPC procedures authorize via Supabase; admin sees admin console.

### Phase 3 — Catalog, pricing, koala content ✅ DONE (2026-07-03)
> Implemented + verified: `data/verticals.ts` (5 verticals × 25 templates, typed, lucide icons), `pages/Catalog.tsx` (bubble grid + mouse-glow + login bubble), `pages/CatalogVertical.tsx` (`/catalog/:code` detail w/ status+price), `pages/Pricing.tsx` (3 rungs, featured), `components/KoalaShowcase.tsx` (framer-motion, real PNG at `public/yawn-koala.png`, GSAP iframe retired), `components/SiteChrome.tsx` (shared nav/footer), routes wired in `App.tsx`. Emoji verticals → lucide icons. `typecheck` + `build` pass; all screens screenshot-confirmed. NOTE: koala PNG has a baked light-gray background — a transparent cutout would integrate better (optional polish).

- **`src/data/verticals.ts`** (new) — port `content.js` to typed data: 5 verticals (SAL, ECM, PRD, SMB, WHL★) × 5 cards (`id`, `title`, `status: spec|slot|built`, `outcome`, `price`, `flagship?`). Light Yawn-voice pass on blurbs/outcomes.
- **Routes** (Wouter, add to `src/App.tsx`): `/catalog` (bubble grid of 5 verticals, Stackgrid + mouse-glow hover, framer-motion), vertical detail via modal or `/catalog/:code` (the 5 cards + statuses + prices), `/pricing` (3 rungs, middle featured). "Why us" + "Trusted by" as Home sections. Nav gets bracket-style links.
- **Koala** — copy `Yawn Koala image.png` → `public/`. Rebuild **`src/components/KoalaShowcase.tsx`** natively: framer-motion scroll-reveal + spring float + glow, no iframe/GSAP. Place as a Home showcase section. `public/animations/yawn-koala/` is **not** carried over.
- **Exit:** catalog + pricing reachable and on-brand; koala animates on scroll; all data-driven.

### Phase 4 — Supabase data backup + polish
- **Persistence** — the JSON store **does not survive Vercel serverless** (ephemeral FS), so this both fulfills "back everything up to Supabase" and fixes a latent data-loss bug. Add `image_generations` + `web_scrapes` tables (user-scoped, RLS). Rewrite `server/db.ts` to read/write Supabase via a **service-role** client server-side. Migrate `saveImageGeneration` / `getImageGenerationsByUserId` / `saveWebScrape` / `getWebScrapesByUserId`.
- **Polish** — a11y (focus rings already good), reduced-motion audit for particles + koala, responsive breakpoints, final `typecheck` + `build`, Vercel env vars set, deploy check.
- **Exit:** data persists across serverless invocations; full app dark, animated, on-brand; deployed.

## 5. New / changed files (map)

**New:** `src/components/ParticleField.tsx`, `src/lib/supabase.ts`, `src/components/AuthModal.tsx` (or `src/pages/Login.tsx`), `src/data/verticals.ts`, `src/pages/Catalog.tsx`, `src/pages/Pricing.tsx`, `supabase/migrations/0001_auth_and_rate_limit.sql` (imported), `public/yawn-koala.png` (imported).
**Changed:** `src/index.css` (theme), `src/contexts/ThemeContext.tsx` (default dark), `src/pages/Home.tsx` (Stackgrid + particle + sections + koala), `src/_core/hooks/useAuth.ts` (Supabase), `src/components/RequireAuth.tsx` (+admin), `src/components/KoalaShowcase.tsx` (framer-motion rebuild), `src/App.tsx` (routes), `src/lib/trpc.ts` (auth header), `server/context.ts` (Supabase JWT), `server/db.ts` (Supabase), `.env.example` / Vercel env.
**Retired:** `server/_core/auth.ts` (fake login), `src/const.ts` `getLoginUrl` path.

## 6. Data / integration notes
- Supabase URL: `https://ijtqhysxbjloagmfzrtu.supabase.co`. Anon key is **public by design** (safe in client). Service-role key is **server-only** (never shipped to client).
- Lockout thresholds live server-side in the RPC (3 / 15 min); `config.js`'s `LOCK_MAX`/`LOCK_WINDOW_MIN` are client display only.
- `profiles.role` is server-assigned (`customer` default via trigger); admin is a manual DB promotion — never trust client role input.

## 7. Risks & open items
1. **Supabase anon key is empty + project may be paused** → live auth can't be tested until DJ pastes the anon key and un-pauses `ijtqhysxbjloagmfzrtu`. **Blocker for Phase 2 verification.**
2. **Supabase MCP project identity** — confirm the connected Supabase MCP server points at `ijtqhysxbjloagmfzrtu` before using `apply_migration`; else run SQL manually.
3. **tRPC ↔ Supabase JWT bridge** (Phase 2) is the trickiest integration; if it slips, protected tRPC procedures break. Mitigation: do it behind a small, tested context helper.
4. **Brutalist → rounded shift** — moving from 0px hard borders to Stackgrid's rounded soft-line look is a visible identity change. Assumed desired per "apply Stackgrid patterns"; confirm on Phase 1 preview.
5. **Vercel env vars** must be set for both build (`VITE_*`) and runtime (`SUPABASE_SERVICE_ROLE_KEY`) or deploy auth/data will fail.
6. **Serif font licensing/weight** — pick a self-hostable serif; keep payload small (subset woff2).

## 8. Out of scope (this pass)
- Migrating the broader `…\AI-Automation-Agency\` "agency OS" folders (catalog/legal/n8n-build-specs/verticals content trees).
- Real payment/booking backend (the "Book a call" CTA stays mailto/link).
- Cleaning up the duplicate local clones / buried `.git/hooks` copy (tracked separately if desired).
