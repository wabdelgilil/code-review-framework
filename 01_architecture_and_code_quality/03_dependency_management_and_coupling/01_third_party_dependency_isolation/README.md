# [ARCH-03-01] Third-Party Dependency Isolation
## Level 3 Category Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../README.md) > [Dependency Management & Coupling (Level 2)](../README.md) > **Third-Party Dependency Isolation (Level 3)**

---

### 🎯 Purpose & Scope
Wrap external libraries to prevent vendor lock-in, isolate supply chain risks, and guarantee 100% deterministic dependency installation across environments.

---

### 📜 Governing Standards
Twelve-Factor App: Explicit Dependencies; Adapter Pattern; SLSA Supply-Chain Security Standards; ISO/IEC 25010: Replaceability.

---

### 📋 Level 4: Atomic Checkpoints Specification

| Checkpoint Code | Atomic Checkpoint Name | Classification | Verification Specification Link |
| :---: | :--- | :---: | :---: |
| `CHK-ARCH-0301` | **Adapter Wrapper for External Libraries** | `[MANDATORY]` | [📄 View Checkpoint Specification](./01_adapter_wrapper_external_libraries.md) |
| `CHK-ARCH-0302` | **Deterministic Dependency Pinning** | `[MANDATORY]` | [📄 View Checkpoint Specification](./02_deterministic_dependency_pinning.md) |

---
[⬅️ Back to Sub-Pillar (Level 2)](../README.md) | [🏠 Back to Root Index](../../../README.md)
