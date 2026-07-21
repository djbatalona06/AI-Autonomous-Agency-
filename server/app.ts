import express, { type Express } from "express";
import cookieParser from "cookie-parser";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./context";
import { authRouter } from "./_core/auth";
import { ENV } from "./_core/env";
import { corsMiddleware, rateLimit, securityHeaders } from "./_core/security";

/**
 * Builds the API Express app (no `listen`, no static serving) so it can be
 * shared by the local server (`server/index.ts`) and the Vercel serverless
 * entrypoint (`api/index.ts`). Mounts only the API surface: `/api/auth` and
 * `/trpc`. Static client assets are served by the host (Vite locally, Vercel
 * static output in production).
 */
export function createApp(): Express {
  const app = express();

  // Trust the platform proxy so `req.ip` / rate-limit keying use the real
  // client address from `x-forwarded-for` (Vercel / local dev proxy).
  app.set("trust proxy", true);

  // ── Edge hardening (defense in depth) ──
  // See docs/security/security-controls-matrix.md and compliance-framework.md.
  app.use(securityHeaders());
  app.use(corsMiddleware());

  // Bound request bodies to blunt trivial memory-exhaustion payloads.
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());

  // Per-IP rate limits. Auth is the most abuse-prone surface, so it gets the
  // tighter budget. (In-memory / per-instance — see security.ts caveat.)
  app.use(
    "/api/auth",
    rateLimit({ windowMs: ENV.rateLimitWindowMs, max: ENV.rateLimitAuthMax, keyPrefix: "auth" }),
    authRouter,
  );
  app.use(
    "/trpc",
    rateLimit({ windowMs: ENV.rateLimitWindowMs, max: ENV.rateLimitApiMax, keyPrefix: "trpc" }),
    createExpressMiddleware({ router: appRouter, createContext }),
  );

  return app;
}
