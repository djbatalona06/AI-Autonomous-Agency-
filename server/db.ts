import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AppUser } from "./_core/env";
import { ENV } from "./_core/env";

/**
 * Zero-config persistence: a JSON file on disk. No external database or native
 * modules required, so the app runs anywhere straight off GitHub. The Drizzle
 * schema in `server/schema.ts` mirrors these shapes for teams that want to
 * graduate to a real Postgres/Supabase instance later.
 *
 * On Vercel the deployment filesystem is read-only except `/tmp`, so the store
 * is written there. NOTE: `/tmp` is ephemeral and per-instance — data does NOT
 * survive cold starts or span instances. For durable auth, migrate to the
 * Drizzle/Postgres schema (or Supabase/Upstash). See README / schema.ts.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = ENV.isVercel ? "/tmp" : path.join(__dirname, ".data");
const DATA_FILE = ENV.isVercel
  ? path.join(DATA_DIR, "yawn-store.json")
  : path.join(DATA_DIR, "store.json");

export interface ImageGeneration {
  id: number;
  userId: number;
  prompt: string;
  imageUrl: string;
  imageKey: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface WebScrape {
  id: number;
  userId: number;
  url: string;
  rawContent: string;
  markdownSummary: string;
  competitiveIntelligence: Record<string, unknown>;
  automationTemplate: string;
  createdAt: string;
}

/** A single-use password-reset token (only the SHA-256 hash is stored). */
export interface ResetToken {
  tokenHash: string;
  userId: number;
  expiresAt: string;
  consumed: boolean;
}

export type AuthEventType =
  | "register"
  | "login"
  | "login_failed"
  | "login_locked"
  | "logout"
  | "password_reset_requested"
  | "password_reset"
  | "password_changed"
  | "mfa_setup"
  | "mfa_enabled"
  | "mfa_disabled"
  | "mfa_challenge_failed";

export interface AuthAuditEntry {
  id: number;
  userId: number | null;
  type: AuthEventType;
  ip: string | null;
  ts: string;
}

interface Store {
  users: AppUser[];
  imageGenerations: ImageGeneration[];
  webScrapes: WebScrape[];
  resetTokens: ResetToken[];
  authAuditLog: AuthAuditEntry[];
  counters: { user: number; image: number; scrape: number; audit: number };
}

const empty: Store = {
  users: [],
  imageGenerations: [],
  webScrapes: [],
  resetTokens: [],
  authAuditLog: [],
  counters: { user: 0, image: 0, scrape: 0, audit: 0 },
};

let store: Store | null = null;

/** Backfill any fields missing from older persisted user records. */
function normaliseUser(u: Partial<AppUser> & Pick<AppUser, "id" | "openId">): AppUser {
  return {
    id: u.id,
    openId: u.openId,
    name: u.name ?? null,
    email: u.email ?? null,
    role: u.role ?? "user",
    passwordHash: u.passwordHash ?? "",
    mfaEnabled: u.mfaEnabled ?? false,
    mfaSecret: u.mfaSecret ?? null,
    mfaRecoveryHashes: u.mfaRecoveryHashes ?? [],
    failedAttempts: u.failedAttempts ?? 0,
    lockedUntil: u.lockedUntil ?? null,
    createdAt: u.createdAt ?? new Date().toISOString(),
    lastSignedIn: u.lastSignedIn ?? null,
  };
}

function load(): Store {
  if (store) return store;
  let loaded: Store;
  try {
    if (fs.existsSync(DATA_FILE)) {
      loaded = { ...structuredClone(empty), ...JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) };
    } else {
      loaded = structuredClone(empty);
    }
  } catch (error) {
    console.warn("[Store] Failed to read store, starting fresh:", error);
    loaded = structuredClone(empty);
  }
  // Ensure new collections/counters exist when loading an older store file.
  loaded.resetTokens ??= [];
  loaded.authAuditLog ??= [];
  // Backfill any counter missing from an older store file (the persisted JSON
  // may predate a counter, even though the type marks them all as present).
  const counters = (loaded.counters ?? {}) as Partial<Store["counters"]>;
  loaded.counters = {
    user: counters.user ?? 0,
    image: counters.image ?? 0,
    scrape: counters.scrape ?? 0,
    audit: counters.audit ?? 0,
  };
  loaded.users = (loaded.users ?? []).map(normaliseUser);
  store = loaded;
  return loaded;
}

function persist() {
  if (!store) return;
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
  } catch (error) {
    console.error("[Store] Failed to persist store:", error);
  }
}

// ── Users ──────────────────────────────────────────────────────────────────
export async function upsertUser(input: {
  openId: string;
  name?: string | null;
  email?: string | null;
  role?: "user" | "admin";
}): Promise<AppUser> {
  const s = load();
  let user = s.users.find((u) => u.openId === input.openId);
  if (user) {
    if (input.name !== undefined) user.name = input.name;
    if (input.email !== undefined) user.email = input.email;
    if (input.role !== undefined) user.role = input.role;
  } else {
    user = normaliseUser({
      id: ++s.counters.user,
      openId: input.openId,
      name: input.name ?? null,
      email: input.email ?? null,
      role: input.role ?? "user",
    });
    s.users.push(user);
  }
  persist();
  return user;
}

export async function getUserByOpenId(openId: string): Promise<AppUser | undefined> {
  return load().users.find((u) => u.openId === openId);
}

export async function getUserByEmail(email: string): Promise<AppUser | undefined> {
  const target = email.trim().toLowerCase();
  return load().users.find((u) => (u.email ?? "").toLowerCase() === target);
}

export async function getUserById(id: number): Promise<AppUser | undefined> {
  return load().users.find((u) => u.id === id);
}

export async function createUser(input: {
  email: string;
  name?: string | null;
  passwordHash: string;
  role?: "user" | "admin";
}): Promise<AppUser> {
  const s = load();
  const user = normaliseUser({
    id: ++s.counters.user,
    openId: input.email.trim().toLowerCase(),
    name: input.name ?? null,
    email: input.email.trim(),
    role: input.role ?? "user",
    passwordHash: input.passwordHash,
    createdAt: new Date().toISOString(),
  });
  s.users.push(user);
  persist();
  return user;
}

/** Apply a partial update to a user by id and persist. Returns the updated row. */
export async function updateUser(
  id: number,
  patch: Partial<Omit<AppUser, "id" | "openId">>,
): Promise<AppUser | undefined> {
  const s = load();
  const user = s.users.find((u) => u.id === id);
  if (!user) return undefined;
  Object.assign(user, patch);
  persist();
  return user;
}

// ── Password-reset tokens ────────────────────────────────────────────────────
export async function setResetToken(
  userId: number,
  tokenHash: string,
  expiresAt: string,
): Promise<void> {
  const s = load();
  // Invalidate any prior outstanding tokens for this user.
  for (const t of s.resetTokens) {
    if (t.userId === userId && !t.consumed) t.consumed = true;
  }
  s.resetTokens.push({ tokenHash, userId, expiresAt, consumed: false });
  persist();
}

/**
 * Consume a reset token: returns the owning userId if the token is valid,
 * unconsumed and unexpired, then marks it consumed. Returns null otherwise.
 */
export async function consumeResetToken(tokenHash: string): Promise<number | null> {
  const s = load();
  const entry = s.resetTokens.find((t) => t.tokenHash === tokenHash);
  if (!entry || entry.consumed) return null;
  if (Date.now() >= new Date(entry.expiresAt).getTime()) {
    entry.consumed = true;
    persist();
    return null;
  }
  entry.consumed = true;
  persist();
  return entry.userId;
}

// ── Auth audit log ────────────────────────────────────────────────────────────
export async function recordAuthEvent(input: {
  userId: number | null;
  type: AuthEventType;
  ip?: string | null;
}): Promise<void> {
  const s = load();
  s.authAuditLog.push({
    id: ++s.counters.audit,
    userId: input.userId,
    type: input.type,
    ip: input.ip ?? null,
    ts: new Date().toISOString(),
  });
  // Cap the in-file log so it never grows unbounded.
  if (s.authAuditLog.length > 1000) s.authAuditLog.splice(0, s.authAuditLog.length - 1000);
  persist();
}

// ── Image generations ────────────────────────────────────────────────────────
export async function saveImageGeneration(
  userId: number,
  prompt: string,
  imageUrl: string,
  imageKey: string,
  metadata?: Record<string, unknown>,
): Promise<ImageGeneration> {
  const s = load();
  const row: ImageGeneration = {
    id: ++s.counters.image,
    userId,
    prompt,
    imageUrl,
    imageKey,
    metadata: metadata ?? {},
    createdAt: new Date().toISOString(),
  };
  s.imageGenerations.push(row);
  persist();
  return row;
}

export async function getImageGenerationsByUserId(
  userId: number,
  limit = 20,
): Promise<ImageGeneration[]> {
  return load()
    .imageGenerations.filter((g) => g.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)) // newest first
    .slice(0, limit);
}

// ── Web scrapes ──────────────────────────────────────────────────────────────
export async function saveWebScrape(
  userId: number,
  url: string,
  rawContent: string,
  markdownSummary: string,
  competitiveIntelligence?: Record<string, unknown>,
  automationTemplate?: string,
): Promise<WebScrape> {
  const s = load();
  const row: WebScrape = {
    id: ++s.counters.scrape,
    userId,
    url,
    rawContent,
    markdownSummary,
    competitiveIntelligence: competitiveIntelligence ?? {},
    automationTemplate: automationTemplate ?? "",
    createdAt: new Date().toISOString(),
  };
  s.webScrapes.push(row);
  persist();
  return row;
}

export async function getWebScrapesByUserId(
  userId: number,
  limit = 20,
): Promise<WebScrape[]> {
  return load()
    .webScrapes.filter((w) => w.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)) // newest first
    .slice(0, limit);
}
