# Access Control Policy

_Last updated: 2026-06-22 · Owner: Security Officer (CISO)_

This policy governs how identities are created, granted privileges, reviewed, and removed across the Yawn AI Agency application and the systems that support it (GitHub, Vercel, Supabase, and the LLM/scraping vendor accounts).

## 1. Scope of Identities

Two distinct identity planes exist and are managed separately:

- **Application users** — end users of the Yawn app. They authenticate with email + password (Argon2id-hashed) and, for privileged roles, TOTP MFA. Their role (`user` or `admin`) is stored on the user record (`role` column, see `server/schema.ts`).
- **Operator / platform access** — accounts on GitHub (source + CI), Vercel (hosting + secrets), and Supabase (database). These are managed through each provider's team/role settings.

## 2. User Provisioning

- Application accounts are self-service: a user registers with email + password. Passwords must meet the standards in [`password-policy.md`](password-policy.md) and are stored only as Argon2id hashes.
- New accounts default to the least-privileged role (`user`). The `admin` role is never granted at sign-up.
- Admin privileges are granted explicitly by the CISO and require TOTP MFA to be enrolled before the role is activated.
- Operator access (GitHub/Vercel/Supabase) is granted only to active team members, at the lowest role that lets them do their job (e.g., GitHub "Write" not "Admin" unless required), and is recorded in the access review log.

## 3. User Deprovisioning

- When a user requests account closure, their account and associated personal data are removed per the [`data-retention-policy.md`](data-retention-policy.md) deletion procedure.
- When a team member leaves or no longer needs access, their operator accounts are disabled the **same day**: removed from the GitHub repo, Vercel team, and Supabase project; any shared API keys they could have known are rotated.
- Admin role on the app is revoked immediately upon role change. Active sessions are invalidated (session secret rotation or per-user session revocation).
- Deprovisioning actions are logged with date and approver.

## 4. Periodic Access Reviews

- Access is reviewed **quarterly** by the CISO using the checklist in [`docs/security/access-review-template.md`](../../docs/security/access-review-template.md).
- The review confirms: every operator account maps to a current team member; every `admin` app account is still justified and has MFA enrolled; no stale API keys or invited-but-unused collaborators remain.
- Findings (e.g., an account to remove or a privilege to downgrade) are actioned within 7 days and recorded.

## 5. Least-Privilege Enforcement

Least privilege is enforced in code and configuration, not just on paper:

- **Application authorization** — tRPC `protectedProcedure` gates all data routes; users can only read their own image generations and web scrapes (queries are scoped by `ctx.user.id` in `server/routers.ts`). Admin-only actions check `role === "admin"`.
- **Database** — the Supabase migration ships Row-Level Security (RLS) policies and least-privilege database roles so the application role can touch only the rows and tables it needs; the service role key is never exposed to the client (`supabase/migrations`).
- **Secrets** — API keys and the session secret live in Vercel environment variables / secrets, scoped per environment, and are never committed (secret scanning enforces this).
- **Platform** — operator roles on GitHub/Vercel/Supabase are set to the minimum tier required.

Default-deny is the rule: a new resource or route starts with no access and is opened up deliberately.
