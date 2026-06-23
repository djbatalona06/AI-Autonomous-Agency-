import crypto from "node:crypto";
import { argon2id, argon2Verify } from "hash-wasm";

/**
 * Password hashing with Argon2id via `hash-wasm` (pure WASM — no native
 * bindings, so it bundles cleanly into the single Vercel function). Output is
 * the standard encoded `$argon2id$...` string, so verification is
 * self-contained (the salt + params live inside the hash).
 *
 * Parameters follow the OWASP Password Storage Cheat Sheet for Argon2id.
 */
const ARGON2_PARAMS = {
  parallelism: 1,
  iterations: 3,
  memorySize: 19456, // KiB (~19 MiB)
  hashLength: 32,
} as const;

export async function hashPassword(plain: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  return argon2id({
    password: plain,
    salt,
    parallelism: ARGON2_PARAMS.parallelism,
    iterations: ARGON2_PARAMS.iterations,
    memorySize: ARGON2_PARAMS.memorySize,
    hashLength: ARGON2_PARAMS.hashLength,
    outputType: "encoded",
  });
}

export async function verifyPassword(encoded: string, plain: string): Promise<boolean> {
  if (!encoded) return false;
  try {
    return await argon2Verify({ password: plain, hash: encoded });
  } catch {
    return false;
  }
}

/** A tiny blocklist of the most abused passwords / obvious patterns. */
const COMMON_PASSWORDS = new Set([
  "password",
  "password1",
  "password123",
  "passw0rd",
  "qwerty",
  "qwerty123",
  "123456",
  "12345678",
  "123456789",
  "1234567890",
  "111111",
  "letmein",
  "iloveyou",
  "admin",
  "admin123",
  "welcome",
  "welcome1",
  "monkey",
  "dragon",
  "abc123",
  "changeme",
  "secret",
  "p@ssw0rd",
  "yawn",
  "yawn123",
]);

export interface PasswordStrengthResult {
  ok: boolean;
  errors: string[];
}

export function validatePasswordStrength(pw: string): PasswordStrengthResult {
  const errors: string[] = [];

  if (typeof pw !== "string" || pw.length < 12) {
    errors.push("Password must be at least 12 characters long.");
  }
  if (!/[a-z]/.test(pw)) errors.push("Password must contain a lowercase letter.");
  if (!/[A-Z]/.test(pw)) errors.push("Password must contain an uppercase letter.");
  if (!/[0-9]/.test(pw)) errors.push("Password must contain a number.");
  if (!/[^A-Za-z0-9]/.test(pw)) errors.push("Password must contain a symbol.");
  if (COMMON_PASSWORDS.has(pw.toLowerCase())) {
    errors.push("This password is too common. Choose something less guessable.");
  }

  return { ok: errors.length === 0, errors };
}
