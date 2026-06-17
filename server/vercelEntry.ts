import { createApp } from "./app";

/**
 * Vercel serverless entry. This file is bundled by `scripts/build-api.mjs`
 * (esbuild) into a single self-contained CommonJS file at `api/index.js`, so
 * the deployed function has no external relative imports to resolve at runtime
 * (which previously caused ERR_MODULE_NOT_FOUND under Node's ESM loader).
 *
 * Vercel's Node runtime invokes the default export as the request handler; an
 * Express app is a `(req, res)` handler, so it works directly. `vercel.json`
 * rewrites every `/trpc/*` and `/api/auth/*` request here.
 */
export default createApp();
