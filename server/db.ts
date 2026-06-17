import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AppUser } from "./_core/env";

/**
 * Zero-config persistence: a JSON file on disk. No external database or native
 * modules required, so the app runs anywhere straight off GitHub. The Drizzle
 * schema in `server/schema.ts` mirrors these shapes for teams that want to
 * graduate to a real Postgres/Supabase instance later.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, ".data");
const DATA_FILE = path.join(DATA_DIR, "store.json");

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

interface Store {
  users: AppUser[];
  imageGenerations: ImageGeneration[];
  webScrapes: WebScrape[];
  counters: { user: number; image: number; scrape: number };
}

const empty: Store = {
  users: [],
  imageGenerations: [],
  webScrapes: [],
  counters: { user: 0, image: 0, scrape: 0 },
};

let store: Store | null = null;

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
    user = {
      id: ++s.counters.user,
      openId: input.openId,
      name: input.name ?? null,
      email: input.email ?? null,
      role: input.role ?? "user",
    };
    s.users.push(user);
  }
  persist();
  return user;
}

export async function getUserByOpenId(openId: string): Promise<AppUser | undefined> {
  return load().users.find((u) => u.openId === openId);
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
