---
tags: [knowledge, reference]
---

# Tech Stack — DJ's Recurring Tools

Reusable reference so project notes can link here instead of restating stack details.

## Frontend
React (18 & 19), TypeScript, Vite, Zustand (state), Tailwind CSS 4, wouter (routing),
framer-motion (animation), Leaflet/react-leaflet (maps), three.js/GLTF (3D).

## Backend
Node.js, Express 4, tRPC 11, zod (validation), Drizzle ORM.

## Data / infra
Supabase (Postgres + Auth), zero-config JSON-file fallbacks for local dev, Cloudflare Pages
(Untapped Market hosting), Vercel/Render/Railway/Fly (Yawn hosting options).

## AI / automation
Anthropic + OpenAI + Firecrawl as pluggable providers (with deterministic mock fallbacks), n8n
(agency's core automation product), Ollama (planned local Hermes Agent backend — see `plan.md`).

## CI/CD & security
GitHub Actions, CodeQL, gitleaks / secret-tripwire scanning — present across multiple repos,
indicating this is a standing practice, not a one-off.

## Also comfortable with
Vanilla ES5 JS, IndexedDB/localStorage, service workers/offline-first PWAs — used in
`jenny-s-study-guide` alongside the more modern React/TS stack used elsewhere.
