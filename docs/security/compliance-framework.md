# Compliance & Regulatory Framework

_Last updated: 2026-07-15 · Owner: Security Officer (CISO)_

This document is Yawn's regulatory and legal-compliance layer. Where the
[Security Controls Matrix](security-controls-matrix.md) tracks *technical*
controls, this maps the **laws and standards** we operate under to how the app
addresses them, and to the obligations we must meet on a recurring basis.

> **Not legal advice.** This is an internal risk-awareness reference. Applicability
> depends on which users, data types, and jurisdictions are actually in scope.
> Have qualified counsel review before relying on any position below.

## Status legend

- **✅ Addressed in code** — enforced by application/database code in this repo.
- **⚙️ Configured** — enforced by platform/CI configuration.
- **📄 Documented** — governed by a written policy/process.
- **🟡 Applies-if / Planned** — conditional on scope, or in progress.

## Where Yawn stands today

Yawn is a React 19 SPA (Vite) with an Express + tRPC API and Supabase for auth
and data, deployed on Vercel. It does **not** currently target regulated data:
no PHI (HIPAA), no cardholder data (PCI DSS — payments, if added, run through a
compliant processor so card data never touches our servers), and no federal
agency data (FedRAMP). The live obligations are therefore driven by **general
consumer-privacy law**, **FTC §5**, **accessibility**, and **platform liability**
for AI/automation output. The table below is the full map; the "Applies to Yawn"
column states current reality so scope creep is visible when it changes.

## 1. Data-privacy regulations

| Regulation | Jurisdiction | Trigger | Applies to Yawn | Core obligations |
| --- | --- | --- | --- | --- |
| **GDPR** | EU / EEA | Processing EU residents' personal data | 🟡 Applies-if we accept EU users | Lawful basis/consent, DSARs, deletion, portability, 72h breach notice, DPA with subprocessors |
| **CCPA / CPRA** | California | For-profit + thresholds (≥100k consumers, or data-sale revenue) | 🟡 Applies-if thresholds met | Notice at collection, right to know/delete/correct, opt-out of sale/share, no minor data sale |
| **US state laws** (VA, CO, CT, UT, TX, FL, …) | Respective states | State-resident data + thresholds | 🟡 Applies-if thresholds met | Consumer rights, opt-out of targeted ads/sale, sensitive-data consent, data-protection assessments (VA/CO/CT) |
| **HIPAA** | US healthcare | Processing PHI as/for a covered entity | 🔴 Out of scope — do **not** ingest PHI | BAAs, Security Rule safeguards, 60-day breach notice |
| **PCI DSS** | Card networks | Storing/processing cardholder data | 🔴 Out of scope — use a compliant processor (SAQ-A) | Never store PAN; tokenize via processor |
| **FedRAMP** | US federal | Federal agency data | 🔴 Out of scope | NIST 800-53 baseline, ATO |
| **LGPD / PIPL** | Brazil / China | Resident data | 🟡 Applies-if we serve those markets | GDPR-like rights; PIPL adds localization + separate consent |

**High-risk patterns to avoid:** processing personal data without a DPA in place
with each subprocessor (see [vendor-register.md](vendor-register.md)); EU→US
transfers without SCCs/DPF; treating re-identifiable data as "anonymized."

## 2. Platform & AI liability

- **CDA §230.** Protects us from liability as the "publisher" of *user-provided*
  content passing through the app/workflows, and for good-faith moderation.
  **We lose it** for content we materially create — which includes **AI outputs
  our workflows generate** (image generation, crawl summaries, chat replies).
  Exceptions: federal IP claims, criminal law, FOSTA-SESTA.
- **FTC Act §5.** Our privacy policy and security/AI marketing claims must match
  actual practice; material omissions or unsubstantiated "AI"/"secure" claims are
  actionable. Keep [Privacy Policy](../../src/content/security/privacy-policy.md)
  in sync with real data flows ([asset-inventory.md](asset-inventory.md),
  [vendor-register.md](vendor-register.md)).
- **AI output.** Copyright status of generated output is unsettled; keep a
  human-in-the-loop for consequential decisions and label AI-generated content.
- **First Amendment / unprotected categories.** CSAM, obscenity, incitement, and
  defamation get no protection — moderation and abuse-reporting paths must exist.

## 3. OWASP Top 10 → how Yawn addresses it

Concrete, repo-anchored mapping (complements the controls matrix):

| OWASP (2021) | Status | Where |
| --- | --- | --- |
| A01 Broken Access Control | ✅ | `protectedProcedure` gate `server/trpc.ts`; server-assigned roles + RLS `supabase/migrations/*` |
| A02 Cryptographic Failures | ⚙️ ✅ | TLS everywhere (Vercel) + HSTS (`server/_core/security.ts`, `vercel.json`); signed cookies `server/_core/cookies.ts` |
| A03 Injection / XSS | ✅ | Zod input schemas `server/routers.ts`; React auto-escaping + `react-markdown` (no raw HTML), no `dangerouslySetInnerHTML` |
| A04 Insecure Design | ✅ 📄 | Default-deny CORS, per-IP rate limits, body-size cap `server/_core/security.ts`, `server/app.ts` |
| A05 Security Misconfiguration | ⚙️ ✅ | Security headers + CSP `vercel.json`; prod error hygiene `server/trpc.ts` |
| A06 Vulnerable Components | ⚙️ | Dependabot, `npm-audit.yml`, `dependency-review.yml` |
| A07 Auth Failures | ✅ | Supabase JWT verify `server/context.ts`; brute-force lockout RPCs `supabase/migrations/20260703120000_*` |
| A08 Integrity Failures | ⚙️ | Pinned lockfile + CI build gates `.github/workflows/ci.yml` |
| A09 Logging & Monitoring | 🟡 | Request/error logging present; external error tracker planned (matrix #6) |
| A10 SSRF | ✅ | `assertPublicUrl()` blocks internal/link-local/metadata targets `server/_core/scrape.ts` |

## 4. n8n / AI-workflow security

Automation workflows and AI nodes are a distinct attack surface:

1. **Guardrails.** Sanitize PII from AI inputs/outputs, detect prompt-injection
   and jailbreak attempts, block malicious URLs and exposed secrets, and enforce
   topical alignment before delivering output.
2. **Data-flow mapping.** Every third-party destination (LLM provider, Firecrawl,
   Supabase, any n8n subprocessor) is documented in
   [vendor-register.md](vendor-register.md); data leaves our trust boundary the
   moment it is sent, so minimize what is sent and prefer self-hosted/enterprise
   AI for sensitive data.
3. **Secrets.** Never hardcode keys in workflows — use platform env vars
   (`.env.example`, Vercel encrypted env), rotate on a schedule, and rely on
   gitleaks (`.github/workflows/secret-scan.yml`) to catch regressions.

## 5. Breach response

Timelines are jurisdiction-specific; the [Incident Response
Runbook](incident-response-runbook.md) is the operational procedure. Fastest
clock wins when multiple apply.

| Regime | Notification window |
| --- | --- |
| GDPR | Supervisory authority within **72h** of awareness |
| CCPA/CPRA | Without unreasonable delay (≤45 days recommended) |
| US state laws | Varies; commonly ≤30 days |
| HIPAA (if ever in scope) | ≤60 days; 500+ individuals → media + HHS |

## 6. Accessibility (WCAG 2.2 AA / ADA / §508)

Target **WCAG 2.2 Level AA**: keyboard operability, screen-reader support,
color-contrast, visible focus, alt text, and ARIA labeling on interactive
elements. ADA Title III web-accessibility suits are common and cheap to file —
keep an accessibility review in the dev pipeline and publish an accessibility
statement.

## 7. Required legal documents

| Document | Purpose | Status |
| --- | --- | --- |
| Privacy Policy | Disclose collection/use/sharing | 📄 [`privacy-policy.md`](../../src/content/security/privacy-policy.md) |
| Terms of Service | User agreement, liability limits, acceptable use (supports §230) | 📄 [`terms-of-service.md`](../../src/content/security/terms-of-service.md) |
| Cookie/consent notice | Tracking consent (GDPR/ePrivacy) | 🟡 Applies-if non-essential cookies used |
| Data Processing Agreement | Subprocessor compliance | 🟡 Per vendor — see [vendor-register.md](vendor-register.md) |
| Business Associate Agreement | HIPAA PHI handling | 🔴 Only if PHI ever enters scope |

## 8. Recurring compliance obligations

The cadence-bound items below are tracked with concrete due dates in
[compliance-calendar.md](compliance-calendar.md), which the nightly compliance
agent reads to prepare each obligation **the day before it is due**.

| Obligation | Cadence |
| --- | --- |
| Dependency audit (`npm audit` / review Dependabot) | Weekly |
| Security patch review | Bi-weekly |
| Data-flow mapping refresh | Quarterly |
| Access review ([template](access-review-template.md)) | Quarterly |
| Backup/restore verification | Weekly (automated) |
| Privacy Policy / ToS legal review | Annual |
| Penetration test ([plan](penetration-test-plan.md)) | Annual |
| External audit (SOC 2 Type II or equiv.) | Annual |
| Security-awareness training | Semi-annual |
| Third-party/vendor risk assessment | Annual |
| Incident-response tabletop | Annual |

## 9. "Getting sued" — top risks & mitigations

| Risk | Mitigation |
| --- | --- |
| Data breach | Encryption, monitoring, tested IR plan, cyber-liability insurance |
| ADA accessibility | WCAG 2.2 AA, accessibility statement, pipeline review |
| Privacy violation | Honor DSARs/opt-outs, DPAs in place, policy matches practice |
| IP infringement | Licensed assets only, OSS-license compliance, IP indemnity clauses |
| FTC enforcement | Truthful privacy/AI/security claims, substantiation |
| Contractual (MSA) | Liability caps, IP ownership, confidentiality, indemnification |

---

_General guidance only; laws vary by jurisdiction and use case. Consult legal
counsel and compliance professionals for a plan tailored to Yawn's operations._
