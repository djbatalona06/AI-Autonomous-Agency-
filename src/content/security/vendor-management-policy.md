# Vendor & Third-Party Management Policy

_Last updated: 2026-06-22 · Owner: Security Officer (CISO)_

Yawn relies on a small set of third-party services (subprocessors). This policy
defines how we evaluate, approve, and monitor those vendors so that outsourcing
infrastructure never outsources our security obligations.

## 1. Scope

Applies to any external service that stores, processes, or transmits Yawn data,
or that is part of our build/deploy supply chain. The current vendor set is
recorded in the [Vendor Register](../../docs/security/vendor-register.md).

## 2. Vendor Review Process

Before adopting a new vendor:

1. **Need & data flow** — document what the vendor does and exactly what data
   (and what [classification](../../docs/security/data-classification.md)) flows
   to it.
2. **Security review** — complete the checklist below.
3. **Approval** — the Security Officer approves; Restricted/Confidential data
   vendors require explicit sign-off.
4. **Record** — add the vendor to the register with data shared, risk rating,
   and next review date.

## 3. Security Review Checklist

For each vendor, confirm:

- [ ] Published security posture / compliance (e.g., **SOC 2**, ISO 27001).
- [ ] **Encryption** in transit (TLS) and at rest.
- [ ] Authentication options (SSO/MFA) for our account with them.
- [ ] A **Data Processing Agreement** / privacy terms and sub-processor list.
- [ ] Data location/residency and a documented data-deletion path.
- [ ] Incident notification commitments (how/when they notify us of breaches).
- [ ] Status page / reliability track record and support channels.

## 4. Third-Party Risk Assessment

Each vendor is rated **Low / Medium / High** based on data sensitivity and
blast radius:

- **High** — holds Restricted/Confidential data or can affect availability of
  the whole app (e.g., hosting, database).
- **Medium** — processes user content transiently (e.g., LLM/scraping APIs).
- **Low** — minimal or no user data.

Higher-risk vendors get closer scrutiny and more frequent review.

## 5. Current Subprocessors (summary)

| Vendor | Purpose | Data shared | Risk |
| --- | --- | --- | --- |
| **Vercel** | Hosting / serverless / TLS | All request data, env secrets | High |
| **Supabase** | Database & backups (planned) | All app data incl. Restricted | High |
| **GitHub** | Source, CI/CD | Source code, CI secrets | High |
| **Anthropic** | LLM (chat, intelligence) | Prompts / scraped text | Medium |
| **OpenAI** | LLM / image generation | Prompts / scraped text | Medium |
| **Firecrawl** | Optional web scraping | Target URLs | Low |

The authoritative, detailed list lives in the
[Vendor Register](../../docs/security/vendor-register.md).

## 6. Ongoing Monitoring & Contract Management

- Vendors are **re-reviewed at least annually**, or on a material change
  (pricing tier, security incident, sub-processor change, acquisition).
- We track contract renewal dates, data-processing terms, and the minimum
  access scope for each integration (least privilege — API keys are scoped and
  rotated; see the [Password & Authentication Policy](password-policy.md)).
- Offboarding a vendor includes revoking keys, exporting/deleting our data, and
  updating the register.
