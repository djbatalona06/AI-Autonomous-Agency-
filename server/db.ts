import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { ENV } from "./_core/env";

/**
 * Per-user persistence backed by Supabase Postgres.
 *
 * Every call is made with the *caller's own* access token, so PostgREST runs
 * under that user's `authenticated` role and the RLS policies in
 * `supabase/migrations/20260703120100_project_data.sql` are what actually
 * enforce ownership — the `user_id` filters below are belt-and-braces, not the
 * security boundary. No service-role key exists anywhere in this codebase.
 *
 * This replaces an on-disk JSON store that could not work in production:
 * Vercel's function filesystem is read-only, so every write was silently
 * discarded and all history was lost between invocations.
 */

export interface ImageGeneration {
  id: number;
  userId: string;
  prompt: string;
  imageUrl: string;
  imageKey: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface WebScrape {
  id: number;
  userId: string;
  url: string;
  rawContent: string;
  markdownSummary: string;
  competitiveIntelligence: Record<string, unknown>;
  automationTemplate: string;
  createdAt: string;
}

/** Raised when persistence is unreachable or refuses a write. */
export class StoreError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "StoreError";
  }
}

/**
 * Supabase client scoped to one request's user. Mirrors the pattern in
 * `server/context.ts` — anon key for the connection, the user's JWT for
 * authorization.
 */
export function userClient(accessToken: string | null): SupabaseClient {
  if (!ENV.supabaseUrl || !ENV.supabaseAnonKey) {
    throw new StoreError("Supabase is not configured — set SUPABASE_URL and SUPABASE_ANON_KEY.");
  }
  if (!accessToken) {
    throw new StoreError("Missing access token for a per-user database call.");
  }
  return createClient(ENV.supabaseUrl, ENV.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

// ── Row mappers (snake_case columns → camelCase app shapes) ─────────────────
type ImageRow = {
  id: number;
  user_id: string;
  prompt: string;
  image_url: string;
  image_key: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

type ScrapeRow = {
  id: number;
  user_id: string;
  url: string;
  raw_content: string | null;
  markdown_summary: string | null;
  competitive_intelligence: Record<string, unknown> | null;
  automation_template: string | null;
  created_at: string;
};

const toImage = (r: ImageRow): ImageGeneration => ({
  id: r.id,
  userId: r.user_id,
  prompt: r.prompt,
  imageUrl: r.image_url,
  imageKey: r.image_key,
  metadata: r.metadata ?? {},
  createdAt: r.created_at,
});

const toScrape = (r: ScrapeRow): WebScrape => ({
  id: r.id,
  userId: r.user_id,
  url: r.url,
  rawContent: r.raw_content ?? "",
  markdownSummary: r.markdown_summary ?? "",
  competitiveIntelligence: r.competitive_intelligence ?? {},
  automationTemplate: r.automation_template ?? "",
  createdAt: r.created_at,
});

// ── Image generations ───────────────────────────────────────────────────────
export async function saveImageGeneration(
  accessToken: string | null,
  userId: string,
  prompt: string,
  imageUrl: string,
  imageKey: string,
  metadata?: Record<string, unknown>,
): Promise<ImageGeneration> {
  const { data, error } = await userClient(accessToken)
    .from("image_generations")
    .insert({
      user_id: userId,
      prompt,
      image_url: imageUrl,
      image_key: imageKey,
      metadata: metadata ?? {},
    })
    .select()
    .single();
  if (error) {
    throw new StoreError(`Could not save the image generation: ${error.message}`, { cause: error });
  }
  return toImage(data as ImageRow);
}

export async function getImageGenerationsByUserId(
  accessToken: string | null,
  userId: string,
  limit = 20,
): Promise<ImageGeneration[]> {
  const { data, error } = await userClient(accessToken)
    .from("image_generations")
    .select()
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    throw new StoreError(`Could not load image history: ${error.message}`, { cause: error });
  }
  return (data as ImageRow[]).map(toImage);
}

// ── Web scrapes ─────────────────────────────────────────────────────────────
export async function saveWebScrape(
  accessToken: string | null,
  userId: string,
  url: string,
  rawContent: string,
  markdownSummary: string,
  competitiveIntelligence?: Record<string, unknown>,
  automationTemplate?: string,
): Promise<WebScrape> {
  const { data, error } = await userClient(accessToken)
    .from("web_scrapes")
    .insert({
      user_id: userId,
      url,
      raw_content: rawContent,
      markdown_summary: markdownSummary,
      competitive_intelligence: competitiveIntelligence ?? {},
      automation_template: automationTemplate ?? "",
    })
    .select()
    .single();
  if (error) {
    throw new StoreError(`Could not save the scrape: ${error.message}`, { cause: error });
  }
  return toScrape(data as ScrapeRow);
}

export async function getWebScrapesByUserId(
  accessToken: string | null,
  userId: string,
  limit = 20,
): Promise<WebScrape[]> {
  const { data, error } = await userClient(accessToken)
    .from("web_scrapes")
    .select()
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    throw new StoreError(`Could not load scrape history: ${error.message}`, { cause: error });
  }
  return (data as ScrapeRow[]).map(toScrape);
}
