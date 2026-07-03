# Access Review Template

_Last updated: 2026-06-22 · Owner: Security Officer (CISO)_

Conducted **quarterly** (and on any role change/offboarding) to enforce
least privilege per the
[Access Control Policy](../../src/content/security/access-control-policy.md).

## Review metadata

- **Review period:** `__________`
- **Reviewer:** `__________`
- **Date completed:** `__________`

## 1. Human access

| System | Who should have access | Access level | Verified? | Action |
| --- | --- | --- | --- | --- |
| Vercel project | | Owner/Member | ☐ | |
| Supabase project | | Owner/Developer | ☐ | |
| GitHub repository | | Admin/Write/Read | ☐ | |
| Production secrets | | per-environment | ☐ | |
| Domain/DNS | | Owner | ☐ | |

Checklist:

- [ ] Every account maps to a current team member (no orphaned/stale accounts).
- [ ] Admin/owner roles are limited to those who genuinely need them.
- [ ] MFA is enforced on all admin accounts (Vercel, Supabase, GitHub, Yawn).
- [ ] Offboarded users have **all** access revoked (and shared secrets rotated).
- [ ] No shared logins; each person uses their own account.

## 2. Machine / programmatic access

| Credential | Purpose | Scope | Last rotated | Action |
| --- | --- | --- | --- | --- |
| `SESSION_SECRET` | Sign session cookies | App | | |
| Supabase service-role key | Privileged DB access | Server only | | |
| `yawn_app` DB role | App data access (RLS) | Least privilege | | |
| Anthropic/OpenAI keys | AI features | Scoped | | |
| Firecrawl key | Scraping | Scoped | | |

Checklist:

- [ ] Each key is scoped to the minimum required privilege.
- [ ] Keys are stored in the secrets manager, not in source (gitleaks clean).
- [ ] Keys with suspected exposure are rotated; rotation dates recorded.
- [ ] The `yawn_app` role remains `nosuperuser`/`nobypassrls` with only its
      required grants (`supabase/migrations/0003`).

## 3. Application roles

- [ ] `admin` accounts are justified and have MFA enabled.
- [ ] Spot-check that RLS scopes user data correctly (no cross-tenant access).

## Sign-off

| Role | Name | Date |
| --- | --- | --- |
| Reviewer | | |
| Security Officer | | |

Findings and remediation items are tracked to closure and noted in the next
review.
