# [RES-02-01] Schema & Type Enforcement
## Level 3 Category Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-RES] Resilience, Error Handling & Security (Level 1)](../../README.md) > [Input Boundary Validation (Level 2)](../README.md) > **Schema & Type Enforcement (Level 3)**

---

### 🎯 Purpose & Scope
Validate external data at entry points before it enters internal domain processing, enforcing "Parse, Don't Validate" and preventing mass assignment vulnerabilities.

---

### 📜 Governing Standards
OWASP Input Validation Cheat Sheet; CWE-915: Mass Assignment; Parse, Don't Validate Pattern; ISO/IEC 25010.

---

### 📋 Level 4: Atomic Checkpoints Specification

| Checkpoint Code | Atomic Checkpoint Name | Classification | Verification Specification Link |
| :---: | :--- | :---: | :---: |
| `CHK-RES-0201` | **Strict Boundary Type Verification** | `[MANDATORY]` | [📄 View Checkpoint Specification](./01_strict_boundary_type_verification.md) |
| `CHK-RES-0202` | **Rejection of Unknown or Extra Input Fields** | `[BEST PRACTICE]` | [📄 View Checkpoint Specification](./02_unknown_fields_rejection.md) |

---
[⬅️ Back to Sub-Pillar (Level 2)](../README.md) | [🏠 Back to Root Index](../../../README.md)
