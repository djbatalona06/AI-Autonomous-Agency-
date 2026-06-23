import crypto from "node:crypto";
import type { AppUser } from "./env";
import { hashPassword, verifyPassword, validatePasswordStrength } from "./password";
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  setResetToken,
  consumeResetToken,
} from "../db";

/**
 * Authentication service layered over the JSON store. Encapsulates registration,
 * login (with account lockout), password reset and password change. Callers
 * (the tRPC auth router) get small, intention-revealing results and never touch
 * raw hashes.
 */

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export type RegisterResult =
  | { ok: true; user: AppUser }
  | { ok: false; error: string };

export type VerifyLoginResult =
  | { ok: true; user: AppUser }
  | { ok: false; reason: "invalid" | "locked"; lockedUntil?: string };

function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isLocked(user: AppUser): boolean {
  return !!user.lockedUntil && Date.now() < new Date(user.lockedUntil).getTime();
}

export async function register(
  email: string,
  password: string,
  name?: string | null,
): Promise<RegisterResult> {
  const normalised = normaliseEmail(email);
  if (!normalised || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalised)) {
    return { ok: false, error: "Please provide a valid email address." };
  }

  const strength = validatePasswordStrength(password);
  if (!strength.ok) return { ok: false, error: strength.errors.join(" ") };

  const existing = await getUserByEmail(normalised);
  if (existing) return { ok: false, error: "An account with this email already exists." };

  const passwordHash = await hashPassword(password);
  const user = await createUser({ email: normalised, name: name ?? null, passwordHash });
  await updateUser(user.id, { lastSignedIn: new Date().toISOString() });
  return { ok: true, user };
}

export async function verifyLogin(email: string, password: string): Promise<VerifyLoginResult> {
  const user = await getUserByEmail(normaliseEmail(email));

  // Run a verify against a dummy hash even when the user is missing, to keep
  // timing roughly uniform and avoid leaking which emails are registered.
  if (!user || !user.passwordHash) {
    await verifyPassword(
      "$argon2id$v=19$m=19456,t=3,p=1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      password,
    );
    return { ok: false, reason: "invalid" };
  }

  if (isLocked(user)) {
    return { ok: false, reason: "locked", lockedUntil: user.lockedUntil ?? undefined };
  }

  const valid = await verifyPassword(user.passwordHash, password);
  if (!valid) {
    const failedAttempts = user.failedAttempts + 1;
    const patch: Partial<AppUser> = { failedAttempts };
    if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
      patch.lockedUntil = new Date(Date.now() + LOCKOUT_MS).toISOString();
      patch.failedAttempts = 0; // reset counter once locked
    }
    await updateUser(user.id, patch);
    if (patch.lockedUntil) {
      return { ok: false, reason: "locked", lockedUntil: patch.lockedUntil };
    }
    return { ok: false, reason: "invalid" };
  }

  // Success: reset lockout state and stamp last sign-in.
  await updateUser(user.id, {
    failedAttempts: 0,
    lockedUntil: null,
    lastSignedIn: new Date().toISOString(),
  });
  const fresh = (await getUserById(user.id)) ?? user;
  return { ok: true, user: fresh };
}

/**
 * Issue a password-reset token. To avoid account enumeration the caller should
 * always respond identically regardless of whether the email exists; this
 * returns the raw token only when an account is found (so it can be emailed).
 */
export async function requestPasswordReset(email: string): Promise<{ token: string } | null> {
  const user = await getUserByEmail(normaliseEmail(email));
  if (!user) return null;
  const token = crypto.randomBytes(32).toString("base64url");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  await setResetToken(user.id, tokenHash, new Date(Date.now() + RESET_TOKEN_TTL_MS).toISOString());
  return { token };
}

export type ResetPasswordResult = { ok: true; user: AppUser } | { ok: false; error: string };

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<ResetPasswordResult> {
  const strength = validatePasswordStrength(newPassword);
  if (!strength.ok) return { ok: false, error: strength.errors.join(" ") };

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const userId = await consumeResetToken(tokenHash);
  if (userId === null) return { ok: false, error: "This reset link is invalid or has expired." };

  const passwordHash = await hashPassword(newPassword);
  const user = await updateUser(userId, {
    passwordHash,
    failedAttempts: 0,
    lockedUntil: null,
  });
  if (!user) return { ok: false, error: "Account not found." };
  return { ok: true, user };
}

export type ChangePasswordResult = { ok: true } | { ok: false; error: string };

export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string,
): Promise<ChangePasswordResult> {
  const user = await getUserById(userId);
  if (!user) return { ok: false, error: "Account not found." };

  if (!user.passwordHash || !(await verifyPassword(user.passwordHash, currentPassword))) {
    return { ok: false, error: "Your current password is incorrect." };
  }

  const strength = validatePasswordStrength(newPassword);
  if (!strength.ok) return { ok: false, error: strength.errors.join(" ") };

  const passwordHash = await hashPassword(newPassword);
  await updateUser(userId, { passwordHash });
  return { ok: true };
}
