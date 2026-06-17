/**
 * Reference Drizzle schema (Postgres / Supabase).
 *
 * The app ships with a zero-config JSON store (see `db.ts`) so it runs anywhere
 * with no database. When you're ready to scale, point Drizzle at a real Postgres
 * instance and swap the `db.ts` queries for these tables — the row shapes match.
 */
import {
  pgEnum,
  pgTable,
  serial,
  integer,
  text,
  varchar,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("open_id", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in").defaultNow().notNull(),
});

export const imageGenerations = pgTable("image_generations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  prompt: text("prompt").notNull(),
  imageUrl: varchar("image_url", { length: 2048 }),
  imageKey: varchar("image_key", { length: 2048 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const webScrapes = pgTable("web_scrapes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  url: varchar("url", { length: 2048 }).notNull(),
  rawContent: text("raw_content"),
  markdownSummary: text("markdown_summary"),
  competitiveIntelligence: jsonb("competitive_intelligence"),
  automationTemplate: text("automation_template"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type ImageGeneration = typeof imageGenerations.$inferSelect;
export type WebScrape = typeof webScrapes.$inferSelect;
