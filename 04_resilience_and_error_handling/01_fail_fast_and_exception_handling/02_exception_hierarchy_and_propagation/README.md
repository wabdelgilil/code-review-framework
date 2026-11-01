# [RES-01-02] Exception Hierarchy & Propagation
## Level 3 Category Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-RES] Resilience, Error Handling & Security (Level 1)](../../README.md) > [Fail-Fast & Exception Handling (Level 2)](../README.md) > **Exception Hierarchy & Propagation (Level 3)**

---

### 🎯 Purpose & Scope
Define domain-specific exception types inheriting from a root application error and maintain clear root-cause error chaining across layer boundaries.

---

### 📜 Governing Standards
Clean Code Chapter 7: Error Handling; Effective Java; PEP 3134: Exception Chaining; ISO/IEC 25010: Maintainability & Analyzability.

---

### 📋 Level 4: Atomic Checkpoints Specification

| Checkpoint Code | Atomic Checkpoint Name | Classification | Verification Specification Link |
| :---: | :--- | :---: | :---: |
| `CHK-RES-0103` | **Domain-Specific Typed Exceptions** | `[MANDATORY]` | [📄 View Checkpoint Specification](./01_domain_specific_typed_exceptions.md) |
| `CHK-RES-0104` | **Preservation of Root Cause Chaining** | `[MANDATORY]` | [📄 View Checkpoint Specification](./02_preservation_root_cause_chaining.md) |

---
[⬅️ Back to Sub-Pillar (Level 2)](../README.md) | [🏠 Back to Root Index](../../../README.md)
