# [DOM-02-01] Floating-Point & Precision Handling
## Level 3 Category Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-DOM] Domain Logic & Specifications (Level 1)](../../README.md) > [Mathematical & Computational Rigor (Level 2)](../README.md) > **Floating-Point & Precision Handling (Level 3)**

---

### 🎯 Purpose & Scope
Eliminate floating-point drift, mandate explicit epsilon tolerances in comparisons, and require scaled integer or Decimal types for monetary and discrete operations.

---

### 📜 Governing Standards
IEEE 754 Standard for Floating-Point Arithmetic; Martin Fowler (Money Pattern); ISO/IEC 25010: Functional Accuracy.

---

### 📋 Level 4: Atomic Checkpoints Specification

| Checkpoint Code | Atomic Checkpoint Name | Classification | Verification Specification Link |
| :---: | :--- | :---: | :---: |
| `CHK-DOM-0201` | **Explicit Epsilon Tolerances for Floats** | `[MANDATORY]` | [📄 View Checkpoint Specification](./01_explicit_epsilon_tolerances.md) |
| `CHK-DOM-0202` | **Exact Representation for Non-Float Units** | `[MANDATORY]` | [📄 View Checkpoint Specification](./02_exact_representation_non_float.md) |

---
[⬅️ Back to Sub-Pillar (Level 2)](../README.md) | [🏠 Back to Root Index](../../../README.md)
