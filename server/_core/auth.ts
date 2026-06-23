import { Router } from "express";
import { COOKIE_NAME } from "../../shared/const";
import { createSessionToken, sessionCookieOptions } from "./cookies";
import { ENV } from "./env";
import { upsertUser, recordAuthEvent } from "../db";

/**
 * Express auth routes. Real auth is implemented in the tRPC `auth` router
 * (register/login/MFA/reset). This module keeps:
 *   - GET /api/auth/logout  — clears the session cookie (always available).
 *   - GET /api/auth/login   — a passwordless DEV-ONLY convenience that signs
 *                             anyone in. It is disabled in production (404) so
 *                             it can never be used as an auth bypass.
 */
export const authRouter = Router();

if (!ENV.isProd) {
  authRouter.get("/login", async (req, res) => {
    const name = (req.query.name as string)?.trim() || "Alex Visionary";
    const email = (req.query.email as string)?.trim() || "alex@yawn.dev";
    const openId = email.toLowerCase();

    const user = await upsertUser({ openId, name, email });
    const token = createSessionToken(user.openId);
    res.cookie(COOKIE_NAME, token, sessionCookieOptions);
    await recordAuthEvent({ userId: user.id, type: "login", ip: req.ip ?? null });
    res.redirect("/dashboard");
  });
} else {
  // Explicitly 404 the dev login in production rather than leaving it mounted.
  authRouter.get("/login", (_req, res) => {
    res.status(404).json({ error: "Not found" });
  });
}

authRouter.get("/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME, { ...sessionCookieOptions, maxAge: undefined });
  res.redirect("/");
});
