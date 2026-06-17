import { Router } from "express";
import { COOKIE_NAME } from "../../shared/const";
import { createSessionToken, sessionCookieOptions } from "./cookies";
import { upsertUser } from "../db";

/**
 * Self-contained demo auth. Replaces Manus OAuth so the app runs anywhere.
 * `GET /api/auth/login` signs a user in (optionally `?name=&email=`) and
 * redirects to the dashboard. Swap this module for a real OAuth provider
 * (the rest of the app only depends on the signed `COOKIE_NAME` cookie).
 */
export const authRouter = Router();

authRouter.get("/login", async (req, res) => {
  const name = (req.query.name as string)?.trim() || "Alex Visionary";
  const email = (req.query.email as string)?.trim() || "alex@yawn.dev";
  const openId = email.toLowerCase();

  const user = await upsertUser({ openId, name, email });
  const token = createSessionToken(user.openId);
  res.cookie(COOKIE_NAME, token, sessionCookieOptions);
  res.redirect("/dashboard");
});

authRouter.get("/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME, { ...sessionCookieOptions, maxAge: undefined });
  res.redirect("/");
});
