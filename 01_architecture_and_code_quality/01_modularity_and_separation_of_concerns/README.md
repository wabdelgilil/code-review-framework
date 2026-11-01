# [ARCH-01] Modularity & Separation of Concerns
## Sub-Pillar Audit Catalog & Index

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../README.md) > **Modularity & Separation of Concerns (Level 2)**

---

### 🎯 Purpose & Scope
Evaluate structural decoupling of core business and domain logic from side-effect layers (UI, CLI, External APIs, Database, and File I/O) according to ISO/IEC 25010 Modularity principles.

---

### 📂 Level 3 Categories Index

| Category Code | Subject Category Name | Focus & Scope | Category Catalog Link |
| :---: | :--- | :--- | :---: |
| `ARCH-01-01` | **Domain Core Isolation** | Ensure domain logic contains zero framework, driver, or infrastructure dependencies. | [📁 Open Category](./01_domain_core_isolation/README.md) |
| `ARCH-01-02` | **Layer Hierarchy & Data Flow** | Enforce strict unidirectional dependency and data flow across architectural layers. | [📁 Open Category](./02_layer_hierarchy_and_data_flow/README.md) |
| `ARCH-01-03` | **Interface-Driven Boundaries** | Decouple subsystems and external integrations via abstract contracts and inversion of control. | [📁 Open Category](./03_interface_driven_boundaries/README.md) |

---
[⬅️ Back to [TRK-ARCH] Architecture & Code Quality Index](../README.md) | [🏠 Back to Root Index](../../README.md)
