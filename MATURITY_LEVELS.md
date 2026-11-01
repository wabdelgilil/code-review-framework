# 🎖️ Software Quality Maturity Levels & Assurance Tiers (L1 – L3)

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](./README.md) > **Maturity Levels & Assurance Tiers**
> **Grounding:** Inspired by **OWASP ASVS (Application Security Verification Standard)**, **ISO/IEC 25010**, and **Google Production Readiness Standards**.

---

## 🎯 Purpose & Philosophy
Not every piece of software requires the exact same depth of verification. A quick internal CLI utility has different operational risk profiles than a distributed multi-tenant SaaS platform or an algorithmic financial engine.

This framework defines **Three Progressive Assurance Tiers (L1, L2, L3)** that specify which subsets of the **89 Atomic Checkpoints** are mandatory based on system criticality and blast radius.

---

## 🏛️ The Three Assurance Tiers

```text
┌─────────────────────────────────────────────────────────────────┐
│  Tier 3: High-Assurance & Mission-Critical (L3)                │
│  Financial systems, safety-critical telemetry, core kernels     │
│  Mandatory Checkpoints: 89/89 (100% Full Verification)          │
└────────────────────────────────┬────────────────────────────────┘
                                 │
┌────────────────────────────────┴────────────────────────────────┐
│  Tier 2: Standard Enterprise Production (L2)                    │
│  Production SaaS services, customer-facing APIs, microservices  │
│  Mandatory Checkpoints: 62 Checkpoints                         │
└────────────────────────────────┬────────────────────────────────┘
                                 │
┌────────────────────────────────┴────────────────────────────────┐
│  Tier 1: Baseline Software Hygiene (L1)                         │
│  Internal developer tooling, CLI scripts, batch utilities      │
│  Mandatory Checkpoints: 34 Checkpoints                         │
└─────────────────────────────────────────────────────────────────┘
```

---

### 🥉 Tier 1: Baseline Software Hygiene (L1)
* **Target Software:** Developer tools, internal CLIs, non-critical batch scrapers, standalone utilities.
* **Objective:** Ensure basic software engineering discipline, reproducible single-command builds, zero security embarrassments (no hardcoded credentials, no known critical CVEs), and basic automated testing.
* **Verification Method:** Fully automatable via linters, basic unit tests, and pre-commit checks in CI.
* **Key Checkpoint Requirements (34 Checkpoints):**
  * **Architecture:** `CHK-ARCH-0101` (Zero Framework Leakage), `CHK-ARCH-0205` (Zero Dead Code), `CHK-ARCH-0206` (No Commented Code), `CHK-ARCH-0302` (Lockfile Pinning), `CHK-ARCH-0401` (No Hardcoded Paths), `CHK-ARCH-0402` (CWD Agnostic).
  * **Domain Logic:** `CHK-DOM-0201` (Epsilon Float Comp), `CHK-DOM-0203` (Zero Division Guards).
  * **Testing:** `CHK-TEST-0201` (Deterministic Tests), `CHK-TEST-0202` (Hermetic Isolation), `CHK-TEST-0402` (No Counterfeit Tests).
  * **Resilience & Security:** `CHK-RES-0101` (Fail-Fast), `CHK-RES-0102` (No Silent Swallowing), `CHK-RES-0201` (Boundary Parsing), `CHK-RES-0501` (Injection Prevention), `CHK-RES-0502` (Zero Hardcoded Secrets).
  * **Performance:** `CHK-PERF-0101` (No $O(N^2)$ Loops).
  * **Operations:** `CHK-UX-0101` (Single-Command Build), `CHK-UX-0102` (Codified Prerequisites), `CHK-UX-0301` (Three-Part Errors).

---

### 🥈 Tier 2: Standard Enterprise Production (L2)
* **Target Software:** Customer-facing web APIs, production backend microservices, SaaS platforms, long-running background workers.
* **Objective:** High maintainability, robust error propagation, complete input validation, telemetry observability, and data safety under concurrent production loads.
* **Verification Method:** Automated CI pipelines combined with standard peer code reviews.
* **Key Additional Requirements (Tier 1 + 28 = 62 Checkpoints):**
  * **Architecture:** `CHK-ARCH-0103` (Unidirectional Layering), `CHK-ARCH-0104` (No Circular Imports), `CHK-ARCH-0201` (SRP), `CHK-ARCH-0203` (Cyclomatic Complexity $\le 10$), `CHK-ARCH-0204` (Nesting $\le 3$, Length $\le 40$), `CHK-ARCH-0301` (Adapter Isolation), `CHK-ARCH-0305` (SCA CVE Scans), `CHK-ARCH-0306` (License Compliance), `CHK-ARCH-0403` (Isolated Workspace), `CHK-ARCH-0404` (RAII Cleanup).
  * **Domain Logic:** `CHK-DOM-0301` (Single Source of Truth), `CHK-DOM-0302` (No Dual Writes), `CHK-DOM-0401` (Preconditions), `CHK-DOM-0403` (State Machine Matrix).
  * **Testing:** `CHK-TEST-0203` (Branch Coverage $\ge 90\%$), `CHK-TEST-0204` (BVA 5-point bounds), `CHK-TEST-0301` (Pipeline Stage Preservation), `CHK-TEST-0302` (Roundtrip Serialization), `CHK-TEST-0303` (Black-Box E2E), `CHK-TEST-0501` (Legacy Data Parity), `CHK-TEST-0502` (API Signature Parity), `CHK-TEST-0503` (Baseline CI Gates).
  * **Resilience & Security:** `CHK-RES-0103` (Typed Exceptions), `CHK-RES-0104` (Root Cause Chaining), `CHK-RES-0202` (Forbidden Extra Fields), `CHK-RES-0203` (Range & Length Validation), `CHK-RES-0301` (Structured JSON Logging), `CHK-RES-0302` (PII Masking), `CHK-RES-0303` (Correlation IDs), `CHK-RES-0401` (Atomic File Writes), `CHK-RES-0503` (Modern Cryptography), `CHK-RES-0504` (CSPRNG Tokens).
  * **Performance:** `CHK-PERF-0103` (P95 Latency Budgets), `CHK-PERF-0201` (Bounded Memory Footprint), `CHK-PERF-0203` (Streaming $>10\text{MB}$ Payloads), `CHK-PERF-0301` (Buffered I/O), `CHK-PERF-0402` (Stateless Thread-Safety).
  * **Operations:** `CHK-UX-0103` (Codified Release Runbook), `CHK-UX-0201` (ADRs), `CHK-UX-0203` (100% Typed Docstrings), `CHK-UX-0302` (Doctor Command), `CHK-UX-0401` (Troubleshooting Matrix).

---

### 🥇 Tier 3: High-Assurance & Mission-Critical (L3)
* **Target Software:** Financial ledger engines, cryptographic services, critical healthcare/industrial telemetry, foundational kernel/OS components.
* **Objective:** Mathematical certainty, complete specifications traceability, active falsifiability through deliberate mutation testing, and full crash resilience.
* **Verification Method:** Automated pipelines + Formal architectural reviews + Adversarial chaos engineering & mutation testing.
* **Total Requirement:** **100% of the 89 Checkpoints Mandatory.**
* **Exclusive Tier 3 Requirements:**
  * `CHK-DOM-0101` & `CHK-DOM-0102`: Formal clause-by-clause standard mapping & full Requirements Traceability Matrix (RTM).
  * `CHK-DOM-0202`: Exact integer cents / Decimal representation for all currency.
  * `CHK-TEST-0101` & `CHK-TEST-0102`: Immutable golden reference problem bank solved independently by external authorities.
  * `CHK-TEST-0103`: Strict relative delta assertions against analytical oracles ($|\delta| \le 10^{-4}$).
  * `CHK-TEST-0401`: Mutation score $\ge 80.0\%$ (automated fault injection).
  * `CHK-TEST-0403`: Property-based fuzz testing passing $\ge 10,000$ malformed payloads without crash.
  * `CHK-RES-0402`: Physical kernel disk syncing (`fsync`) on every persistent mutation.
  * `CHK-RES-0403`: Immutable SHA-256 cryptographic checksum verified on every persistent load.
  * `CHK-PERF-0401`: Empirically verified linear scaling ratio ($\le 12\times$ per $10\times$ data growth).

---

## 📊 Summary Tier Applicability Matrix

| Pillar | Tier 1 (L1 Baseline) | Tier 2 (L2 Production) | Tier 3 (L3 Mission-Critical) | Total Available |
| :--- | :---: | :---: | :---: | :---: |
| **01 Architecture & Quality** | 7 | 15 | 19 | 19 |
| **02 Domain & Standards** | 2 | 7 | 11 | 11 |
| **03 Testing & Verification** | 3 | 9 | 13 | 13 |
| **04 Resilience & Security** | 8 | 15 | 17 | 17 |
| **05 Performance & Resources** | 1 | 6 | 14 | 14 |
| **06 Operations & DX** | 4 | 10 | 15 | 15 |
| **Total Mandatory Points** | **25 Points** | **62 Points** | **89 Points (100%)** | **89 Checkpoints** |

---
[⬅️ Back to Master Root Index](./README.md)
