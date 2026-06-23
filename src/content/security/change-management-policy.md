# Change Management Policy

_Last updated: 2026-06-22 · Owner: Security Officer (CISO)_

This policy governs how changes to the Yawn AI Agency application and its
infrastructure are proposed, reviewed, tested, and deployed. The goal is to ship
quickly while keeping production stable, auditable, and reversible.

## 1. Scope

Applies to all changes to: application code, database schema/migrations
(`supabase/`), CI/CD workflows (`.github/`), dependencies, and production
configuration (Vercel project settings, environment variables, DNS).

## 2. Change Approval

- All code changes land via a **pull request** — no direct pushes to `main`.
- Each PR requires **at least one reviewer approval** before merge. Security-
  or auth-touching changes (anything under `server/_core/`, `supabase/`, or the
  auth UI) should get an explicit security review.
- PRs must have a clear description of **what** changed and **why**, and link
  any related issue.
- Branch protection on `main`: required status checks (CI), required review,
  and no force-pushes.

## 3. Testing Requirements

Before merge, automated checks must pass (see `.github/workflows/`):

- **Typecheck** — `npm run typecheck` (TypeScript, strict).
- **Build** — `npm run build` (client + serverless bundle).
- **CodeQL** static analysis and **dependency review** on the PR.
- **Secret scanning** (gitleaks) to block committed credentials.
- For backup tooling changes, the **backup/restore self-test** must pass.

Higher-risk changes (auth, data model, retention) should include a manual test
plan in the PR and, where practical, be validated on a Vercel **preview
deployment** before promotion.

## 4. Production Deployment

- Production deploys are **automated**: merging to `main` triggers a Vercel
  build and deployment.
- Every pull request gets an isolated **preview deployment** for review.
- Database migrations are applied in numeric order (`supabase/migrations/`) and
  are written to be idempotent and backward-compatible where possible.
- Environment variables and secrets are managed in the Vercel dashboard
  (per-environment), never committed to source.

## 5. Rollback

- **Application:** use Vercel's instant rollback to re-promote the previous
  known-good deployment, and/or `git revert` the offending change.
- **Database:** migrations should be additive/reversible; destructive changes
  require a documented down-path and a fresh backup taken immediately before
  applying. Point-in-Time Recovery (Supabase) is the last-resort safety net.
- Any rollback is recorded as an incident note if it affected users (see the
  [Incident Response Policy](incident-response-policy.md)).

## 6. Emergency Changes

For urgent fixes (e.g., active security incident), an expedited path is allowed:
implement the minimal fix, get a synchronous review from a second engineer where
possible, deploy, and **retroactively** open the PR and documentation within 24
hours. Emergency changes are reviewed in the next change/postmortem cycle.

## 7. Audit Trail

Git history, pull requests, CI run logs, and Vercel deployment history together
form the change audit trail. These are retained per the
[Data Retention Policy](data-retention-policy.md).
