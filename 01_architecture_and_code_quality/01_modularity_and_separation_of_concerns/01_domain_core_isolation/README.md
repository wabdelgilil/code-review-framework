# [ARCH-01-01] Domain Core Isolation
## Level 3 Category Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../README.md) > [Modularity & Separation of Concerns (Level 2)](../README.md) > **Domain Core Isolation (Level 3)**

---

### 🎯 Purpose & Scope
Ensure domain logic contains zero framework, driver, or infrastructure dependencies. Core business models and mathematical engines execute strictly on pure in-memory inputs and outputs.

---

### 📜 Governing Standards
ISO/IEC 25010: Modularity; Clean Architecture; Hexagonal Architecture (Ports & Adapters).

---

### 📋 Level 4: Atomic Checkpoints Specification

| Checkpoint Code | Atomic Checkpoint Name | Classification | Verification Specification Link |
| :---: | :--- | :---: | :---: |
| `CHK-ARCH-0101` | **Zero Framework Leakage in Core** | `[MANDATORY]` | [📄 View Checkpoint Specification](./01_zero_framework_leakage.md) |
| `CHK-ARCH-0102` | **In-Memory Pure Calculation Boundaries** | `[MANDATORY]` | [📄 View Checkpoint Specification](./02_in_memory_calculation_boundaries.md) |

---
[⬅️ Back to Sub-Pillar (Level 2)](../README.md) | [🏠 Back to Root Index](../../../README.md)
