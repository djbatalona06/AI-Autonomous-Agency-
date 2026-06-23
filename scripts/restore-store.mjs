#!/usr/bin/env node
/**
 * restore-store.mjs — restore a backup produced by backup-store.mjs.
 *
 * Reads a backup file (gzipped, optionally AES-256-GCM encrypted), decrypts and
 * decompresses it, and writes the result to the store path. Overwriting an
 * existing store requires an explicit confirmation: pass `--force` or set
 * `RESTORE_CONFIRM=yes`.
 *
 * Pure Node ESM — no third-party dependencies.
 *
 * Usage:
 *   node scripts/restore-store.mjs <backup-file> [--store <path>] [--force]
 *
 * Env:
 *   VERCEL                 - when set, default store path moves under /tmp
 *   STORE_PATH             - overrides the destination store path
 *   BACKUP_ENCRYPTION_KEY  - required to restore an encrypted (.enc) backup
 *   RESTORE_CONFIRM=yes    - allows overwriting an existing store
 */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import crypto from "node:crypto";
import { ENC_MAGIC, deriveKey, defaultStorePath } from "./backup-store.mjs";

/** Decrypt a buffer produced by backup-store.mjs encrypt(). */
export function decrypt(buf, keyMaterial) {
  const magic = buf.subarray(0, ENC_MAGIC.length);
  if (!magic.equals(ENC_MAGIC)) {
    throw new Error("Backup is not in the expected encrypted format.");
  }
  const key = deriveKey(keyMaterial);
  const iv = buf.subarray(ENC_MAGIC.length, ENC_MAGIC.length + 12);
  const authTag = buf.subarray(ENC_MAGIC.length + 12, ENC_MAGIC.length + 28);
  const ciphertext = buf.subarray(ENC_MAGIC.length + 28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

export function isEncrypted(buf) {
  return buf.length >= ENC_MAGIC.length && buf.subarray(0, ENC_MAGIC.length).equals(ENC_MAGIC);
}

function parseArgs(argv) {
  const args = { backup: null, store: null, force: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--store") args.store = argv[++i];
    else if (a === "--force") args.force = true;
    else if (a === "--help" || a === "-h") args.help = true;
    else if (!a.startsWith("-") && !args.backup) args.backup = a;
  }
  return args;
}

/** Core restore routine. Returns { storePath, encrypted, bytes }. */
export function restoreStore({ backupFile, storePath, force } = {}) {
  if (!backupFile) throw new Error("No backup file specified.");
  const src = path.resolve(backupFile);
  if (!fs.existsSync(src)) throw new Error(`Backup file not found: ${src}`);

  const dest = storePath ?? defaultStorePath();

  const confirmed = force || process.env.RESTORE_CONFIRM === "yes";
  if (fs.existsSync(dest) && !confirmed) {
    throw new Error(
      `Refusing to overwrite existing store at ${dest}. ` +
        "Re-run with --force or set RESTORE_CONFIRM=yes.",
    );
  }

  let payload = fs.readFileSync(src);
  const encrypted = isEncrypted(payload);
  if (encrypted) {
    const key = process.env.BACKUP_ENCRYPTION_KEY;
    if (!key) {
      throw new Error("Backup is encrypted but BACKUP_ENCRYPTION_KEY is not set.");
    }
    payload = decrypt(payload, key);
  }

  const restored = zlib.gunzipSync(payload);

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, restored);

  return { storePath: dest, encrypted, bytes: restored.length };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.backup) {
    console.log(
      "Usage: node scripts/restore-store.mjs <backup-file> [--store <path>] [--force]\n" +
        "Env: VERCEL, STORE_PATH, BACKUP_ENCRYPTION_KEY, RESTORE_CONFIRM=yes",
    );
    if (!args.backup) process.exitCode = 1;
    return;
  }

  const result = restoreStore({
    backupFile: args.backup,
    storePath: args.store,
    force: args.force,
  });
  console.log("[restore] store restored successfully");
  console.log(`[restore] store:     ${result.storePath}`);
  console.log(`[restore] encrypted: ${result.encrypted ? "yes (AES-256-GCM)" : "no"}`);
  console.log(`[restore] size:      ${result.bytes} bytes`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    main();
  } catch (err) {
    console.error(`[restore] FAILED: ${err.message}`);
    process.exit(1);
  }
}
