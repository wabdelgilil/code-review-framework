# [RES-04] Data Safety & Atomic I/O
## Sub-Pillar Audit Catalog & Index

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../README.md) > [[TRK-RES] Resilience, Error Handling & Security (Level 1)](../README.md) > **Data Safety & Atomic I/O (Level 2)**

---

### 🎯 Purpose & Scope
Guarantee atomic disk writes and checksum verification to prevent partially written or corrupted files.

---

### 📂 Level 3 Categories Index

| Category Code | Subject Category Name | Focus & Scope | Category Catalog Link |
| :---: | :--- | :--- | :---: |
| `RES-04-01` | **Atomic Write Operations** | Prevent file truncation or partial writes using write-temp-then-rename patterns. | [📁 Open Category](./01_atomic_write_operations/README.md) |
| `RES-04-02` | **Data Corruption Defense** | Protect saved artifacts with cryptographic or hash-based checksum verification. | [📁 Open Category](./02_data_corruption_defense/README.md) |

---
[⬅️ Back to [TRK-RES] Resilience, Error Handling & Security Index](../README.md) | [🏠 Back to Root Index](../../README.md)
