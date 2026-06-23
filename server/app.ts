import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./context";
import { authRouter } from "./_core/auth";
import { ENV } from "./_core/env";
import { securityHeaders } from "./_core/security";
import { requestLogger, logger } from "./_core/logging";

/**
 * Builds the API Express app (no `listen`, no static serving) so it can be
 * shared by the local server (`server/index.ts`) and the Vercel serverless
 * entrypoint (`api/index.ts`). Mounts only the API surface: `/api/auth` and
 * `/trpc`. Static client assets are served by the host (Vite locally, Vercel
 * static output in production).
 */
export function createApp(): Express {
  const app = express();

  // Trust the platform proxy so `req.ip` (used by rate limits + audit log) is
  // the real client IP on Vercel rather than the proxy's address.
  app.set("trust proxy", 1);

  app.use(securityHeaders);
  app.use(requestLogger);
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  /**
   * Rate limiting. NOTE: these limiters are IN-MEMORY and therefore scoped to a
   * single serverless instance — on Vercel each cold start / concurrent
   * instance has its own counters, so limits are best-effort, not global. For
   * durable, cross-instance limits back the store with Upstash Redis (or
   * Supabase) via a `express-rate-limit` store adapter.
   */
  const authLimiter = rateLimit({
    windowMs: ENV.rateLimitWindowMs,
    max: ENV.rateLimitAuthMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests. Please try again later." },
  });
  const globalLimiter = rateLimit({
    windowMs: ENV.rateLimitWindowMs,
    max: ENV.rateLimitGlobalMax,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use("/api/auth", authLimiter, authRouter);
  app.use(
    "/trpc",
    globalLimiter,
    createExpressMiddleware({ router: appRouter, createContext }),
  );

  // Error handler for the Express (`/api/auth`) routes. tRPC has its own
  // errorFormatter. No stack leak in production.
  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    const requestId = (req as Request & { requestId?: string }).requestId;
    logger.error("express_error", {
      requestId,
      path: req.path,
      message: err instanceof Error ? err.message : String(err),
    });
    if (res.headersSent) return;
    res.status(500).json({
      error: ENV.isProd ? "An unexpected error occurred." : String(err),
    });
  });

  return app;
}
