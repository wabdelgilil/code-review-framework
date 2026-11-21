# [DATA-01] Relational Symmetry & Integrity
## Sub-Pillar Audit Catalog & Index

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../README.md) > [[TRK-DATA] Data Architecture, Multi-Tenancy & Compliance (Level 1)](../README.md) > **Relational Symmetry & Integrity (Level 2)**

---

### 🎯 Purpose & Scope
Verify that relational data models maintain referential integrity, deterministic schema evolution, bidirectional navigation symmetry across DB/ORM/API/UI layers, soft-delete discipline, and atomic transactional reconciliation.

---

### 📂 Level 3 Categories Index

| Category Code | Subject Category Name | Focus & Scope | Category Catalog Link |
| :---: | :--- | :--- | :---: |
| `DATA-01-01` | **Bidirectional Symmetry & Migrations** | Bidirectional entity relationships, zero isolated entities, explicit FKs, reversible schema migrations | [📁 Open Category](./01_bidirectional_symmetry/README.md) |
| `DATA-01-02` | **Transactional & Lifecycle Safety** | Soft-delete default with mandatory query filtering, atomic transactions with zero-variance checks | [📁 Open Category](./02_transactional_and_lifecycle_safety/README.md) |

---
[⬅️ Back to [TRK-DATA] Data Architecture Index](../README.md) | [🏠 Back to Root Index](../../README.md)
