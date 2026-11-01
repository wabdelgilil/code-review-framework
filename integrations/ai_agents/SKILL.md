---
name: code-review-framework
description: Comprehensive enterprise software quality and code review skill. Executes deep static analysis, architectural integrity checks, resilience, performance, security, and verification audits across 89 atomic checkpoints. Use when reviewing code, auditing pull requests, or verifying production readiness.
---

# Code Review & Quality Assurance Skill

When this skill is activated (e.g. user asks to "review my code", "audit this PR", "check if this is production ready", or "run audit scorecard"), execute the following deterministic protocol:

## 1. Select Assurance Tier
Determine the required maturity tier (see `MATURITY_LEVELS.md`):
- **Tier 1 (L1 - Baseline Hygiene)**: CLIs, developer tools, internal scripts (34 checks).
- **Tier 2 (L2 - Enterprise Production)**: Production web services, APIs, databases, multi-user apps (62 checks).
- **Tier 3 (L3 - Mission-Critical)**: Financial, safety, core algorithmic engines (89 checks).

## 2. Evaluate Diff Across the 6 Pillars
Inspect the target codebase or git diff against the relevant checkpoint cards:
1. **Pillar 1: Architecture & Code Quality**: Check for framework isolation (`CHK-ARCH-0101`), dead code (`CHK-ARCH-0205`), pinned dependencies (`CHK-ARCH-0301`).
2. **Pillar 2: Domain Logic & Mathematics**: Check for float equality comparison (`CHK-DOM-0201`), zero-division guards (`CHK-DOM-0203`), UTC timestamps (`CHK-DOM-0301`).
3. **Pillar 3: Testing & Verification**: Check for deterministic tests (`CHK-TEST-0201`), no sleep delays (`CHK-TEST-0203`), assertion integrity (`CHK-TEST-0402`).
4. **Pillar 4: Resilience & Security**: Check for fail-fast (`CHK-RES-0101`), no swallowed errors (`CHK-RES-0102`), timeouts on all I/O (`CHK-RES-0301`), injection prevention (`CHK-RES-0501`), zero hardcoded secrets (`CHK-RES-0502`).
5. **Pillar 5: Performance & Resources**: Check for $O(N^2)$ loops (`CHK-PERF-0101`), unindexed queries (`CHK-PERF-0203`), memory leaks (`CHK-PERF-0301`).
6. **Pillar 6: Operations & DX**: Check for actionable errors (`CHK-UX-0301`), PII masking (`CHK-UX-0303`), single-command setup (`CHK-UX-0101`).

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
