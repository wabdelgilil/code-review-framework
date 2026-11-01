# [RES-02-02] Sanitization & Range Clamping
## Level 3 Category Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-RES] Resilience, Error Handling & Security (Level 1)](../../README.md) > [Input Boundary Validation (Level 2)](../README.md) > **Sanitization & Range Clamping (Level 3)**

---

### 🎯 Purpose & Scope
Sanitize string inputs and clamp numeric/collection bounds to permissible operational windows, preventing denial of service, integer overflows, and memory exhaustion.

---

### 📜 Governing Standards
CWE-1287: Improper Validation of Input Range; CWE-400: Resource Consumption; OWASP Top 10.

---

### 📋 Level 4: Atomic Checkpoints Specification

| Checkpoint Code | Atomic Checkpoint Name | Classification | Verification Specification Link |
| :---: | :--- | :---: | :---: |
| `CHK-RES-0203` | **Numeric Range and String Length Validation** | `[MANDATORY]` | [📄 View Checkpoint Specification](./01_numeric_range_length_validation.md) |

---
[⬅️ Back to Sub-Pillar (Level 2)](../README.md) | [🏠 Back to Root Index](../../../README.md)
