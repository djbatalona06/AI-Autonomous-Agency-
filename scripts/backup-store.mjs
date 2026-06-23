#!/usr/bin/env node
/**
 * backup-store.mjs — create a gzipped, timestamped backup of the JSON store.
 *
 * Reads the store at `server/.data/store.json` (overridable) and writes a
 * compressed backup to `backups/` along with a SHA-256 checksum.
 *
 * On Vercel the only writable location is `/tmp`, so when `process.env.VERCEL`
 * is set the default store path and backup directory move under `/tmp`.
 *
 * Optional encryption: if `BACKUP_ENCRYPTION_KEY` is set, the gzipped payload
 * is additionally encrypted with AES-256-GCM ("encrypted backups"). The key is
 * accepted as 64 hex chars, a base64 string decoding to 32 bytes, or any
 * passphrase (derived to 32 bytes via SHA-256).
 *
 * Pure Node ESM — no third-party dependencies.
 *
 * Usage:
 *   node scripts/backup-store.mjs [--store <path>] [--out <dir>]
 *
 * Env:
 *   VERCEL                 - when set, default paths move under /tmp
 *   STORE_PATH             - overrides the store path
 *   BACKUP_DIR             - overrides the backup output directory
 *   BACKUP_ENCRYPTION_KEY  - when set, enables AES-256-GCM encryption
 */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

// Magic header so the restore script can tell encrypted from plain backups.
export const ENC_MAGIC = Buffer.from("YAWNENC1");

/** Resolve a 32-byte AES key from the supplied key material. */
export function deriveKey(material) {
  // 64 hex chars -> 32 bytes.
  if (/^[0-9a-fA-F]{64}$/.test(material)) {
    return Buffer.from(material, "hex");
  }
  // base64 decoding to exactly 32 bytes.
  try {
    const b64 = Buffer.from(material, "base64");
    if (b64.length === 32) return b64;
  } catch {
    /* fall through to passphrase derivation */
  }
  // Otherwise treat as a passphrase: SHA-256 -> 32 bytes.
  return crypto.createHash("sha256").update(material, "utf8").digest();
}

/**
 * Encrypt a buffer with AES-256-GCM.
 * Layout: MAGIC(8) | iv(12) | authTag(16) | ciphertext.
 */
export function encrypt(buf, keyMaterial) {
  const key = deriveKey(keyMaterial);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(buf), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([ENC_MAGIC, iv, authTag, ciphertext]);
}

export function defaultStorePath() {
  if (process.env.STORE_PATH) return path.resolve(process.env.STORE_PATH);
  if (process.env.VERCEL) return "/tmp/.data/store.json";
  return path.join(repoRoot, "server", ".data", "store.json");
}

export function defaultBackupDir() {
  if (process.env.BACKUP_DIR) return path.resolve(process.env.BACKUP_DIR);
  if (process.env.VERCEL) return "/tmp/backups";
  return path.join(repoRoot, "backups");
}

function parseArgs(argv) {
  const args = { store: null, out: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--store") args.store = argv[++i];
    else if (a === "--out") args.out = argv[++i];
    else if (a === "--help" || a === "-h") args.help = true;
  }
  return args;
}

/** Core backup routine. Returns { backupPath, checksum, encrypted, bytes }. */
export function backupStore({ storePath, outDir } = {}) {
  const src = storePath ?? defaultStorePath();
  const dir = outDir ?? defaultBackupDir();

  if (!fs.existsSync(src)) {
    throw new Error(`Store file not found: ${src}`);
  }

  const raw = fs.readFileSync(src);
  let payload = zlib.gzipSync(raw);

  const encKey = process.env.BACKUP_ENCRYPTION_KEY;
  let encrypted = false;
  if (encKey && encKey.length > 0) {
    payload = encrypt(payload, encKey);
    encrypted = true;
  }

  fs.mkdirSync(dir, { recursive: true });

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const ext = encrypted ? "json.gz.enc" : "json.gz";
  const backupPath = path.join(dir, `store-${stamp}.${ext}`);
  fs.writeFileSync(backupPath, payload);

  const checksum = crypto.createHash("sha256").update(payload).digest("hex");
  // Write a sidecar checksum file for later verification.
  fs.writeFileSync(`${backupPath}.sha256`, `${checksum}  ${path.basename(backupPath)}\n`);

  return { backupPath, checksum, encrypted, bytes: payload.length };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(
      "Usage: node scripts/backup-store.mjs [--store <path>] [--out <dir>]\n" +
        "Env: VERCEL, STORE_PATH, BACKUP_DIR, BACKUP_ENCRYPTION_KEY",
    );
    return;
  }

  const result = backupStore({ storePath: args.store, outDir: args.out });
  console.log("[backup] store backed up successfully");
  console.log(`[backup] file:      ${result.backupPath}`);
  console.log(`[backup] encrypted: ${result.encrypted ? "yes (AES-256-GCM)" : "no"}`);
  console.log(`[backup] size:      ${result.bytes} bytes`);
  console.log(`[backup] sha256:    ${result.checksum}`);
}

// Run only when invoked directly (not when imported by the self-test).
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    main();
  } catch (err) {
    console.error(`[backup] FAILED: ${err.message}`);
    process.exit(1);
  }
}
