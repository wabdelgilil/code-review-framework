# [TEST-02-01] Pure Algorithmic Testing
## Level 3 Category Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-TEST] Testing & Verification Suite (Level 1)](../../README.md) > [Deterministic Unit Testing (Level 2)](../README.md) > **Pure Algorithmic Testing (Level 3)**

---

### 🎯 Purpose & Scope
Test business and calculation logic in sterile isolation without mocks for computation, eliminating all sources of flakiness, wall-clock sleeps, and shared mutable state leakage.

---

### 📜 Governing Standards
Kent Beck: Test-Driven Development; Google Testing Blog (Flaky Tests Elimination); Hermetic Test Principle; ISO/IEC/IEEE 29119.

---

### 📋 Level 4: Atomic Checkpoints Specification

| Checkpoint Code | Atomic Checkpoint Name | Classification | Verification Specification Link |
| :---: | :--- | :---: | :---: |
| `CHK-TEST-0201` | **Zero Flakiness & Non-Deterministic Calls** | `[MANDATORY]` | [📄 View Checkpoint Specification](./01_zero_flakiness_deterministic_calls.md) |
| `CHK-TEST-0202` | **Hermetic Test Execution** | `[MANDATORY]` | [📄 View Checkpoint Specification](./02_hermetic_test_execution.md) |

---
[⬅️ Back to Sub-Pillar (Level 2)](../README.md) | [🏠 Back to Root Index](../../../README.md)
