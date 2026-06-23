# Acceptable Use Policy

_Last updated: 2026-06-22 · Owner: Security Officer (CISO)_

This Acceptable Use Policy (AUP) applies to everyone with privileged or operational access to Yawn AI Agency systems — the GitHub repository, Vercel and Supabase consoles, vendor accounts (Anthropic, OpenAI, Firecrawl), and any device used to access them. End-user conduct on the public app is governed by the [Terms of Service](terms-of-service.md).

## 1. Device Usage

- Any device used to access Yawn production systems or secrets must have **full-disk encryption**, a **screen lock with a strong passcode**, and **automatic OS/security updates** enabled.
- Production credentials and secrets must never be stored on a device in plaintext (no secrets in Notes, chat history, or unencrypted files). Use the platform secrets managers and a reputable password manager.
- Lost or stolen devices that had access to systems or secrets must be reported immediately (see [`incident-response-policy.md`](incident-response-policy.md)) so credentials can be rotated and sessions revoked.
- Personal devices may be used only if they meet these baseline requirements.

## 2. Network Usage

- Administrative access to Vercel, Supabase, and GitHub should be performed over trusted networks. Avoid managing production from open/public Wi-Fi; if unavoidable, use a VPN.
- All application traffic is over HTTPS — TLS is enforced automatically by Vercel; do not disable or work around it.
- Do not expose internal endpoints, the Supabase service-role key, or any secret on a public network or in client-side code.

## 3. Software Installation

- Only install software from trusted, official sources on devices used for Yawn work.
- New project dependencies must be added through a pull request so they pass dependency review, CodeQL, and `npm audit` before reaching `main`. Do not hand-edit `package-lock.json` to bypass these checks.
- Do not introduce unvetted browser extensions or CLI tools that can read repository contents, environment variables, or session tokens.

## 4. Employee / Operator Responsibilities

Everyone with access agrees to:

- Use access **only** for legitimate Yawn purposes and only at the privilege level granted (see [`access-control-policy.md`](access-control-policy.md)).
- Protect credentials: unique strong passwords, MFA where offered, never sharing accounts or API keys.
- Keep Confidential and Restricted data (user PII, generated images, scraped content, secrets) on a strict need-to-know basis and never copy it to unmanaged locations.
- Report suspected security issues, phishing, or policy violations promptly to the CISO (`batalona06@gmail.com`).
- Not attempt to circumvent security controls (rate limits, RLS, branch protection, CI gates).

## 5. Prohibited Activities

- Sharing, selling, or exfiltrating customer data.
- Using Yawn infrastructure or vendor API keys for personal projects or unrelated workloads.
- Disabling logging, monitoring, security headers, or CI security checks without CISO approval.
- Committing secrets to source control (secret scanning will block and alert on this).

Violations may result in revoked access and, for serious cases, termination of the engagement. This policy is reviewed annually.
