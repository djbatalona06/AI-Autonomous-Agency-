import crypto from "node:crypto";
import { authenticator } from "otplib";

/**
 * TOTP-based multi-factor auth via `otplib` (pure JS). Secrets are base32
 * strings compatible with Google Authenticator / 1Password / Authy. Recovery
 * codes are returned in plaintext ONCE at setup; only their SHA-256 hashes are
 * persisted (see authService), so a store leak never exposes usable codes.
 */

/** Allow a +/-1 step (30s) clock skew window. */
authenticator.options = { window: 1 };

export function generateSecret(): string {
  return authenticator.generateSecret();
}

/** otpauth:// URI consumed by authenticator apps (and rendered as a QR client-side). */
export function keyUri(email: string, secret: string): string {
  return authenticator.keyuri(email, "Yawn", secret);
}

export function verifyToken(secret: string, token: string): boolean {
  if (!secret || !token) return false;
  try {
    return authenticator.verify({ token: token.replace(/\s+/g, ""), secret });
  } catch {
    return false;
  }
}

/** Generate 10 human-friendly recovery codes (format: XXXXX-XXXXX). */
export function generateRecoveryCodes(count = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const raw = crypto.randomBytes(8).toString("hex").toUpperCase(); // 16 hex chars
    codes.push(`${raw.slice(0, 5)}-${raw.slice(5, 10)}`);
  }
  return codes;
}

/** SHA-256 of a normalised recovery code (used for storage + comparison). */
export function hashRecoveryCode(code: string): string {
  return crypto.createHash("sha256").update(normaliseRecoveryCode(code)).digest("hex");
}

export function normaliseRecoveryCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}
