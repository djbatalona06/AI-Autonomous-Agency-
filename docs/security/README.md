# Yawn Security Program

This directory is the home of Yawn's security governance: the policies we
operate by, the controls that enforce them, and the evidence that ties the two
together.

## How it fits together

- **Policies** (rendered in-app under [`/security`](/security), source in
  `src/content/security/`) describe *what* we commit to.
- **Controls** (code under `server/_core/`, database under `supabase/`, CI under
  `.github/workflows/`) are *how* those commitments are enforced.
- The **[Security Controls Matrix](security-controls-matrix.md)** maps every
  requirement to its status, evidence, and owner — start there.

## Contents

| Document | Purpose |
| --- | --- |
| [security-controls-matrix.md](security-controls-matrix.md) | Master mapping: requirement → status → evidence → owner. |
| [compliance-framework.md](compliance-framework.md) | Regulatory/legal framework: privacy laws, OWASP mapping, AI/n8n liability, breach timelines. |
| [compliance-calendar.md](compliance-calendar.md) | Recurring obligations with due dates; source for the nightly compliance agent. |
| [data-classification.md](data-classification.md) | Data sensitivity tiers and handling rules. |
| [asset-inventory.md](asset-inventory.md) | Systems, data stores, and dependencies we run. |
| [vendor-register.md](vendor-register.md) | Subprocessors, data shared, risk, review dates. |
| [access-review-template.md](access-review-template.md) | Quarterly least-privilege access review. |
| [soc2-readiness.md](soc2-readiness.md) | Mapping of controls to SOC 2 Trust Services Criteria. |
| [penetration-test-plan.md](penetration-test-plan.md) | Scope, methodology, and cadence for pentests. |
| [security-awareness-training.md](security-awareness-training.md) | Training curriculum and cadence. |
| [incident-response-runbook.md](incident-response-runbook.md) | Step-by-step on-call response runbook. |

## Policy index (in-app)

Information Security · Access Control · Password & Authentication · Acceptable
Use · Incident Response · Vulnerability Management · Data Retention · Backup &
Recovery · Change Management · Vendor Management · Privacy Policy · Terms of
Service.

## Ownership & review

The Security Officer (CISO role) owns this program. Policies are reviewed at
least annually and after any material change or significant incident.
