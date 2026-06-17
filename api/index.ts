import { createApp } from "../server/app";

/**
 * Vercel serverless entrypoint. Vercel's Node runtime accepts an Express app
 * as the default export and invokes it as the request handler. `vercel.json`
 * rewrites every `/trpc/*` and `/api/auth/*` request here; Express then routes
 * by the original (preserved) path. The static client is served separately
 * from the `dist` build output.
 *
 * Note: the bundled JSON store (`server/.data`) is NOT durable on Vercel's
 * ephemeral filesystem — wire the Drizzle/Postgres schema (e.g. Supabase) for
 * persistence in production. AI features still fall back to mocks without keys.
 */
export default createApp();
