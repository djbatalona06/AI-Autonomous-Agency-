import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** True once a real project is configured; auth calls no-op-fail without it. */
export const supabaseConfigured = Boolean(url && anonKey);

if (!supabaseConfigured) {
  // No hardcoded fallback project: pointing a misconfigured build at someone
  // else's database is worse than having auth disabled.
  console.warn(
    "[supabase] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — auth is disabled. " +
      "Copy .env.example to .env and fill both.",
  );
}

/**
 * Browser Supabase client — persists the session and auto-refreshes tokens.
 * The placeholders keep `createClient` from throwing (which would white-screen
 * the app) when the project is unconfigured; `supabaseConfigured` is the flag
 * callers should branch on.
 */
export const supabase = createClient(url || "https://unconfigured.supabase.co", anonKey || "anon-key-not-configured", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/** Current access token (JWT) for authorizing tRPC / API calls, or null. */
export async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}
