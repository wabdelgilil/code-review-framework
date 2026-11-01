# [RES-01-01] Fail-Fast Execution Halting
## Level 3 Category Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-RES] Resilience, Error Handling & Security (Level 1)](../../README.md) > [Fail-Fast & Exception Handling (Level 2)](../README.md) > **Fail-Fast Execution Halting (Level 3)**

---

### 🎯 Purpose & Scope
Halt execution immediately upon encountering an unrecoverable corrupted state or invariant violation, and strictly eliminate silent error swallowing.

---

### 📜 Governing Standards
Jim Gray: Fault-Tolerant Systems; Fail-Fast Principle (Martin Fowler); Clean Code Chapter 7; ISO/IEC 25010: Reliability.

---

### 📋 Level 4: Atomic Checkpoints Specification

| Checkpoint Code | Atomic Checkpoint Name | Classification | Verification Specification Link |
| :---: | :--- | :---: | :---: |
| `CHK-RES-0101` | **Immediate Execution Halting on Invariant Breach** | `[MANDATORY]` | [📄 View Checkpoint Specification](./01_immediate_execution_halting_invariants.md) |
| `CHK-RES-0102` | **Prohibition of Silent Error Swallowing** | `[MANDATORY]` | [📄 View Checkpoint Specification](./02_silent_error_swallowing_prohibition.md) |

---
[⬅️ Back to Sub-Pillar (Level 2)](../README.md) | [🏠 Back to Root Index](../../../README.md)
