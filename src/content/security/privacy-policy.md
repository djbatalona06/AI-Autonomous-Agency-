# Privacy Policy

_Last updated: 2026-06-22 · Owner: Security Officer (CISO)_

This Privacy Policy explains what data the Yawn AI Agency application ("Yawn",
"we") collects, how we use it, who we share it with, and the choices you have.
By using Yawn you agree to this policy.

## 1. Data We Collect

**Account data**
- Email address, display name, and password (stored only as an **Argon2id
  hash** — we never store your plaintext password).
- Multi-factor authentication data if you enable it (a TOTP secret and hashed
  recovery codes).

**Content you create**
- AI image generations (your prompts and the resulting images).
- Web crawls (the URLs you submit and the content/summaries we generate from
  them).
- Messages you send to the in-app AI assistant.

**Technical data**
- A session cookie (`yawn_session`) to keep you signed in.
- Server logs containing request metadata (timestamp, method, path, status,
  duration, IP address, a request ID). We **do not** log request bodies,
  passwords, tokens, or cookies.

## 2. How We Use Your Data

- To provide the service: authenticate you, generate images, crawl and analyze
  pages, and run the assistant.
- To secure the service: detect abuse, enforce rate limits and account lockout,
  and investigate incidents.
- To operate and improve reliability via aggregate, non-identifying logs.

We do **not** sell your personal data, and we do not use your private content to
train our own models.

## 3. Third Parties (Subprocessors)

We share data with a small set of providers strictly to operate Yawn:

| Provider | Purpose | Data shared |
| --- | --- | --- |
| Vercel | Hosting & delivery | All request data |
| Supabase | Database & backups (planned) | Account data & your content |
| Anthropic / OpenAI | AI features | Your prompts and scraped text |
| OpenAI | Image generation | Your image prompts |
| Firecrawl | Optional scraping | The URLs you submit |

These providers process data on our behalf under their own terms. We do not
control, and are not responsible for, the content of third-party websites you
choose to crawl.

## 4. Cookies

We use a single **essential** cookie (`yawn_session`) — an `httpOnly`,
`sameSite=lax`, signed session cookie that is `secure` in production. It is
required to keep you logged in. We do not use advertising or cross-site tracking
cookies.

## 5. Data Retention

We keep data only as long as needed (see the
[Data Retention Policy](data-retention-policy.md)):

- Account data — for the life of your account.
- Generated content — until you delete it or close your account.
- Security/audit logs — about 90 days.
- Web crawl results — about 12 months.

When you close your account, associated content is deleted (database foreign
keys cascade), subject to short-lived backup retention.

## 6. Your Rights

Depending on your jurisdiction (e.g., **GDPR**, **CCPA**), you may have the
right to access, correct, export, or delete your personal data, and to object to
or restrict certain processing. To exercise these rights, contact us at
<batalona06@gmail.com>. We will respond within the timeframe required by
applicable law. You may also withdraw consent or close your account at any time.

## 7. Security

We protect your data with encryption in transit (HTTPS/TLS), strong password
hashing (Argon2id), optional MFA, least-privilege database access with
row-level security, security headers, rate limiting, and audit logging. See our
[Security Center](/security) for the full program. No system is perfectly
secure, but we work to protect your data and to notify you of incidents that
affect it.

## 8. Children

Yawn is not directed to children under 13 (or the minimum age in your
jurisdiction), and we do not knowingly collect their data.

## 9. Changes

We may update this policy; we will revise the "Last updated" date above and, for
material changes, provide a more prominent notice.

## 10. Contact

Questions or requests: <batalona06@gmail.com>.
