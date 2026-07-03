# Vendor Register

_Last updated: 2026-06-22 · Owner: Security Officer (CISO)_

Authoritative list of subprocessors and third-party services, maintained under
the [Vendor Management Policy](../../src/content/security/vendor-management-policy.md).

| Vendor | Service | Data shared | Classification | Risk | Compliance | Next review |
| --- | --- | --- | --- | --- | --- | --- |
| **Vercel** | Hosting, serverless, TLS, secrets | All request data; env secrets | Restricted/Confidential | High | SOC 2 Type II | 2027-06 |
| **Supabase** | Postgres DB & encrypted backups (planned) | All app data incl. Restricted | Restricted/Confidential | High | SOC 2 Type II, HIPAA-eligible | 2027-06 |
| **GitHub** | Source control, CI/CD, secret scanning | Source code, CI secrets | Internal/Restricted | High | SOC 2 Type II | 2027-06 |
| **Anthropic** | LLM (assistant, intelligence) | User prompts, scraped text | Confidential | Medium | SOC 2 Type II | 2027-06 |
| **OpenAI** | LLM + image generation | User prompts, image prompts | Confidential | Medium | SOC 2 Type II | 2027-06 |
| **Firecrawl** | Optional web scraping | Target URLs | Internal | Low | Review vendor docs | 2027-06 |

## Notes

- **Data minimization:** only the data required for each integration is sent.
  AI providers receive prompts/scraped text transiently to produce a response;
  we do not send credentials or other Restricted data to them.
- **Keys:** every vendor API key is scoped to least privilege, stored in the
  Vercel secrets manager, and rotated on personnel change or suspected exposure.
- **Service-role key (Supabase):** server-side only; never shipped to the
  browser.
- **Notification:** vendors are expected to notify us of security incidents
  affecting our data; this is part of the onboarding review checklist.

## Change log

| Date | Change |
| --- | --- |
| 2026-06-22 | Initial register created; Supabase added as planned DB subprocessor. |
