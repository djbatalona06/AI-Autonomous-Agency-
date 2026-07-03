#!/usr/bin/env node
/**
 * test-backup-restore.mjs — automated backup/restore self-test.
 *
 * Evidence for the "backup and restore testing" control. Exercises the full
 * round trip on a throwaway temp store, both unencrypted and AES-256-GCM
 * encrypted:
 *
 *   1. write a sample store
 *   2. back it up
 *   3. delete the original
 *   4. restore from the backup
 *   5. assert deep-equality with the original sample
 *
 * Exits non-zero on any failure so CI fails loudly. No third-party deps.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { backupStore } from "./backup-store.mjs";
import { restoreStore } from "./restore-store.mjs";

const SAMPLE = {
  users: [
    { id: 1, openId: "open-abc", name: "Test User", email: "test@example.com", role: "admin" },
  ],
  imageGenerations: [
    {
      id: 1,
      userId: 1,
      prompt: "a brutalist poster",
      imageUrl: "https://example.com/i.png",
      imageKey: "i.png",
      metadata: { w: 1024, h: 1024 },
      createdAt: "2026-01-01T00:00:00.000Z",
    },
  ],
  webScrapes: [],
  counters: { user: 1, image: 1, scrape: 0 },
};

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "yawn-backup-test-"));
}

function runCase({ label, encryptionKey }) {
  const tmp = makeTempDir();
  const prevKey = process.env.BACKUP_ENCRYPTION_KEY;
  try {
    const storePath = path.join(tmp, ".data", "store.json");
    const backupDir = path.join(tmp, "backups");

    // 1. write sample store
    fs.mkdirSync(path.dirname(storePath), { recursive: true });
    fs.writeFileSync(storePath, JSON.stringify(SAMPLE, null, 2));

    // Toggle encryption for this case.
    if (encryptionKey) process.env.BACKUP_ENCRYPTION_KEY = encryptionKey;
    else delete process.env.BACKUP_ENCRYPTION_KEY;

    // 2. back up
    const { backupPath, encrypted, checksum } = backupStore({ storePath, outDir: backupDir });
    assert.ok(fs.existsSync(backupPath), `${label}: backup file should exist`);
    assert.ok(fs.existsSync(`${backupPath}.sha256`), `${label}: checksum sidecar should exist`);
    assert.equal(encrypted, Boolean(encryptionKey), `${label}: encryption flag mismatch`);
    assert.match(checksum, /^[0-9a-f]{64}$/, `${label}: checksum should be 64 hex chars`);

    // 3. delete the original
    fs.rmSync(storePath);
    assert.ok(!fs.existsSync(storePath), `${label}: original store should be gone`);

    // 4. restore (force, since destination is absent anyway)
    const { storePath: restoredPath } = restoreStore({
      backupFile: backupPath,
      storePath,
      force: true,
    });
    assert.ok(fs.existsSync(restoredPath), `${label}: restored store should exist`);

    // 5. assert deep-equality
    const restored = JSON.parse(fs.readFileSync(restoredPath, "utf8"));
    assert.deepEqual(restored, SAMPLE, `${label}: restored data should match original`);

    console.log(`  PASS  ${label}`);
  } finally {
    if (prevKey === undefined) delete process.env.BACKUP_ENCRYPTION_KEY;
    else process.env.BACKUP_ENCRYPTION_KEY = prevKey;
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

function main() {
  console.log("[self-test] backup/restore round trip");
  runCase({ label: "plain (gzip)", encryptionKey: null });
  runCase({ label: "encrypted (AES-256-GCM)", encryptionKey: "test-passphrase-do-not-use-in-prod" });

  // Negative check: encrypted backup must fail to restore without the key.
  const tmp = makeTempDir();
  const prevKey = process.env.BACKUP_ENCRYPTION_KEY;
  try {
    const storePath = path.join(tmp, ".data", "store.json");
    const backupDir = path.join(tmp, "backups");
    fs.mkdirSync(path.dirname(storePath), { recursive: true });
    fs.writeFileSync(storePath, JSON.stringify(SAMPLE, null, 2));

    process.env.BACKUP_ENCRYPTION_KEY = "another-secret";
    const { backupPath } = backupStore({ storePath, outDir: backupDir });
    fs.rmSync(storePath);

    delete process.env.BACKUP_ENCRYPTION_KEY;
    let threw = false;
    try {
      restoreStore({ backupFile: backupPath, storePath, force: true });
    } catch {
      threw = true;
    }
    assert.ok(threw, "restoring an encrypted backup without a key should throw");
    console.log("  PASS  encrypted restore without key is rejected");
  } finally {
    if (prevKey === undefined) delete process.env.BACKUP_ENCRYPTION_KEY;
    else process.env.BACKUP_ENCRYPTION_KEY = prevKey;
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  console.log("[self-test] ALL CHECKS PASSED");
}

try {
  main();
} catch (err) {
  console.error(`[self-test] FAILED: ${err.message}`);
  process.exit(1);
}
