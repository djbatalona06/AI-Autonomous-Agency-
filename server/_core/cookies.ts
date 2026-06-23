import crypto from "node:crypto";
import { ENV } from "./env";

/**
 * Self-contained signed-session helper (HMAC-SHA256). The token carries a small
 * JSON payload `{ openId, iat, exp }` (base64url-encoded), signed with the
 * server secret. Verification is constant-time and rejects expired tokens.
 * The authoritative user record still lives in the store; the cookie only
 * asserts *which* user and *until when*.
 */

interface SessionPayload {
  openId: string;
  /** issued-at, epoch seconds */
  iat: number;
  /** expires-at, epoch seconds */
  exp: number;
}

const SESSION_TTL_SECONDS = ENV.sessionTtlDays * 24 * 60 * 60;

function sign(value: string): string {
  return crypto.createHmac("sha256", ENV.sessionSecret).update(value).digest("base64url");
}

export function createSessionToken(openId: string, ttlSeconds: number = SESSION_TTL_SECONDS): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = { openId, iat: now, exp: now + ttlSeconds };
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const idx = token.lastIndexOf(".");
  if (idx < 0) return null;

  const encoded = token.slice(0, idx);
  const mac = token.slice(idx + 1);
  const expectedMac = sign(encoded);

  const a = Buffer.from(mac);
  const b = Buffer.from(expectedMac);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    if (typeof payload.openId !== "string" || typeof payload.exp !== "number") return null;
    if (Math.floor(Date.now() / 1000) >= payload.exp) return null; // expired
    return payload.openId;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: ENV.isProd,
  path: "/",
  maxAge: SESSION_TTL_SECONDS * 1000,
};
