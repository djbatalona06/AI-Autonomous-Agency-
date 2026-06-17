# Yawn — AI Automation Agency

**Automate the Boring. Wake Up Your Business.**

A self-contained, full-stack [Kinetic Brutalism](#design-system) automation platform: AI image
generation, web crawling with competitive intelligence, a site-wide AI chat agent, and per-user
project history. **Runs anywhere with zero setup** — no external database, no third-party auth, and
AI features fall back to deterministic mocks so every feature works offline.

```bash
npm install
npm run dev
# → client  http://localhost:5173
# → server  http://localhost:3001
```

Open http://localhost:5173, click **Get Started** to sign in as the demo user, and explore.

---

## Scripts

| Command            | What it does                                              |
| ------------------ | -------------------------------------------------------- |
| `npm run dev`      | Vite client (5173) + Express/tRPC server (3001), proxied |
| `npm run build`    | Production client build → `dist/`                         |
| `npm start`        | Serves the built client + API on a single port (3001)    |
| `npm run preview`  | `build` then `start`                                      |
| `npm run typecheck`| `tsc --noEmit`                                            |

## Tech stack

- **Client:** React 19, Vite 6, Tailwind CSS 4, wouter, framer-motion
- **Server:** Express 4, tRPC 11, zod
- **Storage:** zero-config JSON store (`server/.data/`); Drizzle/Postgres schema included for scaling
- **AI:** pluggable providers (Anthropic / OpenAI / Firecrawl) with built-in mock fallbacks

## Configuration

Everything works with **no configuration**. To enable live providers, copy `.env.example` to `.env`
and set keys:

```bash
cp .env.example .env
```

| Variable             | Effect                                                      |
| -------------------- | ---------------------------------------------------------- |
| `ANTHROPIC_API_KEY`  | Use Claude for crawler intelligence + chat (else mock)      |
| `OPENAI_API_KEY`     | Use OpenAI for LLM **and** real image generation           |
| `FIRECRAWL_API_KEY`  | Route web scraping through Firecrawl (else native fetch)    |
| `SESSION_SECRET`     | Signs the session cookie — **change in production**         |
| `PORT`               | Server port (default `3001`)                               |

## How it runs off GitHub

The app has no hard external dependencies, so a fresh clone runs immediately:

- **Auth** — a self-contained signed-cookie session (`GET /api/auth/login` signs in the demo user).
  Replace `server/_core/auth.ts` with a real OAuth provider when ready; the rest of the app only
  relies on the signed `yawn_session` cookie.
- **Database** — a JSON file at `server/.data/store.json`. To graduate to Postgres/Supabase, wire
  Drizzle to the schema in `server/schema.ts`.
- **AI** — image gen returns branded brutalist SVGs and the LLM returns structured intelligence when
  no API keys are present.

### Deploy

`npm run build && npm start` serves the whole app (client + API) from one Node process — deployable
to any Node host (Render, Railway, Fly, a VM, etc.). For Vercel, host the API as a serverless/Node
function and the client as static output.

## Project structure

```
src/                 React client
  pages/             Home, Dashboard, ImageStudio, WebCrawler, ProjectHistory, Settings, Help
  components/        DashboardLayout, ChatAgent, RequireAuth, ui/*
  _core/hooks/       useAuth
server/              Express + tRPC API
  _core/             auth, cookies, env, llm, imageGeneration, scrape, systemRouter
  routers.ts         tRPC app router
  db.ts              JSON store
  schema.ts          Drizzle reference schema (Postgres)
shared/              constants shared by client + server
```

## Design system

| Token        | Value                          |
| ------------ | ------------------------------ |
| Primary      | `#B666D2` rich lilac           |
| Secondary    | `#B9A3D9` light pastel purple  |
| Background   | `#ECDAF2` pale purple          |
| Ink / border | `#2D1B3D` near-black purple    |
| Typography   | Inter (400–900)                |
| Radius       | `0px` (hard edges)             |
| Borders      | `2px` solid                    |
| Signature    | `scale(0.97)` on `:active`     |

Built with accessibility in mind: visible focus rings, `prefers-reduced-motion` support, semantic
landmarks, and alt text throughout.
