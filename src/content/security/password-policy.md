# Password & Authentication Policy

_Last updated: 2026-06-22 · Owner: Security Officer (CISO)_

This policy defines the authentication standards for the Yawn AI Agency application. It matches the implementation in `server/_core/password.ts`, `server/_core/mfa.ts`, and `server/_core/authService.ts`.

## 1. Minimum Password Standards

Every account password must satisfy these rules, enforced server-side at registration and password change:

- **Length** — minimum **12 characters**. Longer is encouraged; we do not impose a low maximum that would block passphrases.
- **Complexity** — must include a mix of character classes (upper, lower, number, and/or symbol) so trivially weak strings are rejected.
- **Blocklist** — common and breached passwords (e.g., `password123`, `qwertyuiop`, the username/email itself) are rejected via a blocklist check.
- **No silent truncation** — the full password is hashed; we never trim it down before hashing.

Validation lives in `server/_core/password.ts` so the same rules apply everywhere a password is set.

## 2. Multi-Factor Authentication (MFA)

- MFA uses **time-based one-time passwords (TOTP)**, compatible with standard authenticator apps (`server/_core/mfa.ts`).
- **MFA is required for all `admin` accounts.** An admin role is not activated until TOTP enrolment is complete.
- MFA is **available and recommended for all users**; we encourage every account to enable it.
- TOTP secrets are Restricted data: stored encrypted, never logged, and never returned to the client after enrolment.

## 3. Credential Storage

- Passwords are hashed with **Argon2id** — a memory-hard algorithm resistant to GPU cracking — with a unique per-user salt (`server/_core/password.ts`).
- **Plaintext passwords are never stored, logged, or transmitted beyond the TLS-terminated request body.** They do not appear in logs, error messages, or backups.
- Application secrets (session signing secret, API keys, Supabase service key) are stored in **Vercel environment variables / secrets manager**, scoped per environment, and are never committed to source. The `SESSION_SECRET` must be a strong random value in production (the dev default is non-production only).
- Password hashes and MFA secrets are classified Restricted (see [`../../docs/security/data-classification.md`](../../docs/security/data-classification.md)) and protected by database RLS and least-privilege roles.

## 4. Password Reset Process

- Reset is **token-based**: the user requests a reset, and a single-use, cryptographically random token is issued (`server/_core/authService.ts`).
- Tokens **expire after 1 hour** and are invalidated once used or once a new one is requested.
- The reset flow does not reveal whether an email is registered (no account enumeration).
- A successful reset invalidates existing sessions for that account.

## 5. Account Lockout

- After **5 consecutive failed login attempts**, the account is temporarily locked to defeat brute-force and credential-stuffing attacks (`server/_core/authService.ts`).
- Lockout is paired with the application-wide rate limiting on the auth endpoints (`server/_core/security.ts`).
- Repeated lockouts on an account are surfaced in logs for review under [`incident-response-policy.md`](incident-response-policy.md).

## 6. Session Handling

- Sessions are carried in an `httpOnly`, `secure` (in production), `sameSite=lax` signed cookie (`server/_core/cookies.ts`).
- Logout and password reset clear/invalidate the session. Rotating `SESSION_SECRET` invalidates all sessions globally for emergency response.
