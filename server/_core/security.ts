import type { Request, Response, NextFunction } from "express";
import { ENV } from "./env";

/**
 * Security headers middleware (no extra dependency — set by hand so it bundles
 * cleanly). The CSP is intentionally compatible with the existing Vite/React/
 * framer-motion client:
 *   - `style-src 'unsafe-inline'`     framer-motion + injected styles set inline styles.
 *   - `img-src data: blob:`           SVG placeholder images + generated data URLs (QR codes).
 *   - `connect-src 'self' https:`     tRPC calls (same-origin) + any https provider.
 * Vite emits hashed external scripts (no inline <script>), so `script-src 'self'`
 * is safe in the built app. HSTS is only emitted in production (over HTTPS).
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https:",
  "font-src 'self' data:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("Content-Security-Policy", CSP);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("X-DNS-Prefetch-Control", "off");

  if (ENV.isProd) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  next();
}
