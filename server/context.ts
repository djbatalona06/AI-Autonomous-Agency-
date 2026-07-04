import type { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import { upsertUser } from "./db";
import { ENV, type AppUser } from "./_core/env";

export interface Context {
  req: Request;
  res: Response;
  user: AppUser | null;
  /** The raw Supabase access token, for per-request RLS-scoped DB access. */
  accessToken: string | null;
}

/**
 * Resolves the request's user from a Supabase JWT sent as `Authorization:
 * Bearer <token>`. The token is validated against Supabase using the public
 * anon key (`auth.getUser`) — no service_role key is required. The Supabase
 * user is mirrored into the app's `AppUser` (keyed by the Supabase UUID as
 * `openId`), and the role is read from the `profiles` table under the user's
 * own RLS scope.
 */
export async function createContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<Context> {
  let user: AppUser | null = null;
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (token && ENV.supabaseUrl && ENV.supabaseAnonKey) {
    try {
      const supa = createClient(ENV.supabaseUrl, ENV.supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { headers: { Authorization: `Bearer ${token}` } },
      });
      const { data, error } = await supa.auth.getUser(token);
      if (!error && data.user) {
        const su = data.user;
        let role: "user" | "admin" = "user";
        const { data: prof } = await supa
          .from("profiles")
          .select("role")
          .eq("id", su.id)
          .maybeSingle();
        if (prof?.role === "admin") role = "admin";
        user = await upsertUser({
          openId: su.id,
          email: su.email ?? null,
          name: (su.user_metadata?.full_name as string | undefined) ?? su.email ?? null,
          role,
        });
      }
    } catch (err) {
      console.warn("[auth] Supabase token verification failed:", err);
    }
  }

  return { req, res, user, accessToken: token };
}
