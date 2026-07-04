import { createClient } from "@supabase/supabase-js";

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || "https://odibvergwcllhsbzbgwa.supabase.co";
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** True once a real anon key is configured; auth calls no-op-fail without it. */
export const supabaseConfigured = Boolean(anonKey);

if (!anonKey) {
  // Non-empty placeholder keeps createClient from throwing (which would white-
  // screen the app); real auth stays disabled until the anon key is set.
  console.warn(
    "[supabase] Missing VITE_SUPABASE_ANON_KEY — auth is disabled. " +
      "Copy .env.example to .env and fill the anon key.",
  );
}

/** Browser Supabase client — persists the session and auto-refreshes tokens. */
export const supabase = createClient(url, anonKey || "anon-key-not-configured", {
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
