import express, { type Express } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./context";
import { ENV } from "./_core/env";
import { corsMiddleware, rateLimit, securityHeaders } from "./_core/security";

/**
 * Builds the API Express app (no `listen`, no static serving) so it can be
 * shared by the local server (`server/index.ts`) and the Vercel serverless
 * entrypoint (`api/index.ts`). Mounts only the API surface: `/trpc`. Static
 * client assets are served by the host (Vite locally, Vercel static output in
 * production).
 *
 * Authentication is Supabase-only: the browser sends the user's JWT as
 * `Authorization: Bearer <token>` and `server/context.ts` verifies it. There is
 * no server-issued session cookie.
 */

// `chat.send` is the only unauthenticated procedure that spends money (it
// proxies an LLM call), so it gets its own tighter budget ahead of the general
// API limiter. Built once at module scope so the bucket map survives across
// requests on a warm instance.
const chatLimiter = rateLimit({
  windowMs: ENV.rateLimitWindowMs,
  max: ENV.rateLimitChatMax,
  keyPrefix: "chat",
});

export function createApp(): Express {
  const app = express();

  // Trust the platform proxy so `req.ip` reflects the real client address.
  // (Rate-limit keying does not rely on this — see `clientIp` in security.ts.)
  app.set("trust proxy", true);
  // Don't advertise the server stack.
  app.disable("x-powered-by");

  // ── Edge hardening (defense in depth) ──
  // See docs/security/security-controls-matrix.md and compliance-framework.md.
  app.use(securityHeaders());
  app.use(corsMiddleware());

  // Bound request bodies to blunt trivial memory-exhaustion payloads.
  app.use(express.json({ limit: "100kb" }));

  // Per-IP rate limits. (In-memory / per-instance — see security.ts caveat.)
  app.use(
    "/trpc",
    // tRPC puts the procedure name in the path (`/trpc/chat.send`) and batches
    // requests as a comma-joined list, so match on the substring rather than a
    // path prefix — a batch containing a chat call spends the chat budget.
    (req, res, next) => (req.path.includes("chat.") ? chatLimiter(req, res, next) : next()),
    rateLimit({ windowMs: ENV.rateLimitWindowMs, max: ENV.rateLimitApiMax, keyPrefix: "trpc" }),
    createExpressMiddleware({ router: appRouter, createContext }),
  );

  return app;
}
