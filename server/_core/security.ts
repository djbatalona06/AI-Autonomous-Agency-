import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ENV } from "./env";

/**
 * HTTP edge hardening for the API. This is a dependency-free, defense-in-depth
 * layer that sits in front of `/api/auth` and `/trpc` (see `server/app.ts`):
 * security response headers, a default-deny CORS allow-list, and a lightweight
 * per-IP rate limiter.
 *
 * Note on scope: these headers protect API (JSON) responses. The security
 * headers and Content-Security-Policy that protect the *browser app* itself are
 * set on the static HTML/asset responses in `vercel.json`, because the SPA is
 * served by Vercel's static output, not by this Express app.
 */

/**
 * Sets baseline security response headers on every API response. Mirrors the
 * hardening a library like `helmet` would apply, tuned for a JSON API.
 */
export function securityHeaders(): RequestHandler {
  return (_req: Request, res: Response, next: NextFunction) => {
    // A JSON API never returns HTML, so lock the CSP all the way down.
    res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
    // Responses are per-user and authorized by a bearer token. Without this the
    // platform's default (`public, max-age=0, must-revalidate`) marks them
    // cacheable by shared caches, which must never hold one user's data.
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), interest-cohort=()",
    );
    res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    // HSTS only in production (localhost is plain HTTP in dev).
    if (ENV.isProd) {
      res.setHeader(
        "Strict-Transport-Security",
        "max-age=63072000; includeSubDomains; preload",
      );
    }
    next();
  };
}

/**
 * Default-deny CORS. Cross-origin requests are only granted when their `Origin`
 * is in the allow-list (`CORS_ALLOWED_ORIGINS`, plus localhost dev origins when
 * not in production). Same-origin requests (no `Origin` header) always pass.
 * Preflight `OPTIONS` requests are answered here.
 */
export function corsMiddleware(): RequestHandler {
  const devOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
  const allowed = new Set([
    ...ENV.corsAllowedOrigins,
    ...(ENV.isProd ? [] : devOrigins),
  ]);

  return (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    res.setHeader("Vary", "Origin");

    if (origin && allowed.has(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type,Authorization",
      );
      res.setHeader("Access-Control-Max-Age", "600");
    }

    // Answer preflight without hitting the route handlers. A disallowed
    // cross-origin preflight gets 204 with no ACAO header, so the browser
    // blocks the actual request.
    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.end();
      return;
    }
    next();
  };
}

type Bucket = { count: number; resetAt: number };

/**
 * Lightweight fixed-window, per-IP rate limiter.
 *
 * Caveat: state is in-memory and per-process. On Vercel's serverless runtime
 * each cold start begins with an empty map and instances do not share state, so
 * this bounds abuse on a warm instance and on the long-running local/self-hosted
 * server, but is not a global quota. Durable throttling comes from the Supabase
 * `record_login_attempt` / `login_status` RPCs (per-account lockout) and, in
 * production, the Vercel WAF. Layer, not sole line of defense.
 */
export function rateLimit(opts: {
  windowMs: number;
  max: number;
  keyPrefix: string;
}): RequestHandler {
  const { windowMs, max, keyPrefix } = opts;
  const buckets = new Map<string, Bucket>();

  // Opportunistic sweep of expired buckets to bound memory growth.
  function sweep(now: number) {
    if (buckets.size < 5000) return;
    for (const [key, b] of buckets) {
      if (b.resetAt <= now) buckets.delete(key);
    }
  }

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = `${keyPrefix}:${clientIp(req)}`;
    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
      sweep(now);
    }
    bucket.count += 1;

    const remaining = Math.max(0, max - bucket.count);
    const resetSecs = Math.ceil((bucket.resetAt - now) / 1000);
    res.setHeader("RateLimit-Limit", String(max));
    res.setHeader("RateLimit-Remaining", String(remaining));
    res.setHeader("RateLimit-Reset", String(resetSecs));

    if (bucket.count > max) {
      res.setHeader("Retry-After", String(resetSecs));
      res.status(429).json({
        error: "Too many requests. Please slow down and try again shortly.",
      });
      return;
    }
    next();
  };
}

/**
 * Client IP for rate-limit keying, chosen so a caller cannot pick their own key.
 *
 * `x-forwarded-for` is deliberately NOT consulted. It is append-only and
 * client-writable: a request can arrive with a forged value already in it, and
 * a proxy only appends. Reading the first hop hands the attacker the bucket key
 * outright — rotate it per request and the limit never fires. Reading the last
 * hop is only correct when a trusted proxy is guaranteed to be in front, which
 * we cannot know from here; run bare, the last hop is attacker-controlled too.
 * (Express's `req.ip` under `trust proxy` reads the *first* hop, so it is out
 * for the same reason.)
 *
 * Instead, in order:
 *   1. `x-vercel-forwarded-for` — set by Vercel's edge and stripped from client
 *      input, so it cannot be forged in production.
 *   2. `x-real-ip` — set by convention by a reverse proxy, and overwritten
 *      rather than appended. Set this if you self-host behind nginx/Caddy.
 *   3. the socket address — correct when nothing is in front.
 */
function clientIp(req: Request): string {
  const single = (name: string): string | null => {
    const v = req.headers[name];
    const s = Array.isArray(v) ? v[0] : v;
    return s && s.trim() ? s.trim() : null;
  };

  // Vercel sends a single address, but take the last entry defensively.
  const vercel = single("x-vercel-forwarded-for");
  if (vercel) return vercel.split(",").pop()!.trim();

  const real = single("x-real-ip");
  if (real) return real;

  return req.socket.remoteAddress ?? "unknown";
}
