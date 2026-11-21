---
name: code-review-framework
description: Comprehensive enterprise software quality and code review skill. Executes deep static analysis, architectural integrity checks, resilience, performance, security, multi-tenancy, frontend UX, API governance, AI safety, cloud IaC, mobile offline, and event-driven audits across 136 atomic checkpoints (13 pillars). Use when reviewing code, auditing pull requests, or verifying production readiness.
---

# Code Review & Quality Assurance Skill

When this skill is activated (e.g. user asks to "review my code", "audit this PR", "check if this is production ready", or "run audit scorecard"), execute the following deterministic protocol:

## 1. Select Assurance Tier & Applicable Pillars
Determine the required maturity tier (see `MATURITY_LEVELS.md`) and Project Profile (see `AUDIT_SCORECARD.md`):
- **Universal Core Pillars (`01–06`)**: Always mandatory for every software project.
- **Conditional Pillars (`07–13`)**: Activate only the pillars matching the repository's architecture; mark non-applicable pillars `N/A` so they never penalize the score.

## 2. Evaluate Diff Across Applicable Pillars (01–13)
Inspect the target codebase or git diff against the relevant checkpoint cards:
1. **Pillar 1: Architecture & Code Quality**: Framework isolation (`CHK-ARCH-0101`), dead code (`CHK-ARCH-0205`), pinned dependencies (`CHK-ARCH-0301`).
2. **Pillar 2: Domain Logic & Mathematics**: Float equality (`CHK-DOM-0201`), zero-division guards (`CHK-DOM-0203`), UTC timestamps (`CHK-DOM-0301`).
3. **Pillar 3: Testing & Verification**: Deterministic tests (`CHK-TEST-0201`), no sleep delays (`CHK-TEST-0203`), assertion integrity (`CHK-TEST-0402`).
4. **Pillar 4: Resilience & Security**: Fail-fast (`CHK-RES-0101`), no swallowed errors (`CHK-RES-0102`), I/O timeouts (`CHK-RES-0301`), injection prevention (`CHK-RES-0501`), zero hardcoded secrets (`CHK-RES-0502`).
5. **Pillar 5: Performance & Resources**: $O(N^2)$ loops (`CHK-PERF-0101`), unindexed queries (`CHK-PERF-0203`), memory leaks (`CHK-PERF-0301`).
6. **Pillar 6: Operations & DX**: Actionable errors (`CHK-UX-0301`), PII masking (`CHK-UX-0303`), single-command setup (`CHK-UX-0101`).
7. **Pillar 7: Data & Multi-Tenancy *(Conditional)***: Relational symmetry (`CHK-DATA-0101`), versioned migrations (`CHK-DATA-0102`), atomic reconciliation (`CHK-DATA-0104`), server RBAC & RLS (`CHK-DATA-0201`, `0202`), immutable audit trails (`CHK-DATA-0301`).
8. **Pillar 8: Frontend & UX *(Conditional)***: Design tokens (`CHK-FE-0101`), async UI states & Error Boundaries (`CHK-FE-0102`), i18n/RTL parity (`CHK-FE-0301`), WCAG 2.1 AA (`CHK-FE-0302`).
9. **Pillar 9: API Governance & Delivery *(Conditional)***: Standard envelopes (`CHK-API-0101`), `Idempotency-Key` (`CHK-API-0103`), rate limiting (`CHK-API-0104`), living `SRS.md` (`CHK-API-0302`).
10. **Pillar 10: AI/LLM Safety *(Conditional)***: Prompt isolation (`CHK-AI-0101`), structured output validation (`CHK-AI-0102`), PII egress scrubbing (`CHK-AI-0103`), HITL destructive gates (`CHK-AI-0202`).
11. **Pillar 11: Cloud-Native & IaC *(Conditional)***: Non-root containers & scans (`CHK-INFRA-0101`), OIDC identity (`CHK-INFRA-0102`), IaC drift (`CHK-INFRA-0201`), private data stores (`CHK-INFRA-0202`).
12. **Pillar 12: Mobile & Offline *(Conditional)***: Hardware Keychain/Keystore (`CHK-MOB-0101`), durable offline queues (`CHK-MOB-0201`), conflict resolution (`CHK-MOB-0202`).
13. **Pillar 13: Event-Driven *(Conditional)***: Transactional Outbox (`CHK-EVENT-0101`), DLQ poison-pill isolation (`CHK-EVENT-0102`), consumer idempotency (`CHK-EVENT-0103`), `traceparent` (`CHK-EVENT-0202`).

## 3. Output Review in Conventional Format
Format every finding using the Conventional Review syntax:
```text
<label> [decorations] [CHK-CODE]: <subject>

[rationale]

[code suggestion]
```
Labels:
- `issue (blocking)`: Merge blockers (security, data loss, architectural violations).
- `suggestion (non-blocking)`: Non-blocking performance or stylistic enhancements.
- `praise`: Recognition for outstanding design or thorough testing.

## 4. Generate Audit Scorecard
If requested, generate the full Markdown scorecard defined in `AUDIT_SCORECARD.md` with calculated compliance percentage and letter grade (A+ to F).
