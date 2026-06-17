import crypto from "node:crypto";
import { ENV } from "./env";

/**
 * Tiny self-contained signed-cookie helper (HMAC-SHA256). The cookie payload is
 * just the user's openId; the authoritative user record lives in the store.
 */
function sign(value: string): string {
  const mac = crypto
    .createHmac("sha256", ENV.sessionSecret)
    .update(value)
    .digest("base64url");
  return `${value}.${mac}`;
}

export function createSessionToken(openId: string): string {
  const payload = Buffer.from(openId, "utf8").toString("base64url");
  return sign(payload);
}

export function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const idx = token.lastIndexOf(".");
  if (idx < 0) return null;
  const payload = token.slice(0, idx);
  const expected = sign(payload);
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    return Buffer.from(payload, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: ENV.isProd,
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
};
