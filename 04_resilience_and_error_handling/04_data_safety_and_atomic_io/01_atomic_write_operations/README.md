# [RES-04-01] Atomic Write Operations
## Level 3 Category Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-RES] Resilience, Error Handling & Security (Level 1)](../../README.md) > [Data Safety & Atomic I/O (Level 2)](../README.md) > **Atomic Write Operations (Level 3)**

---

### 🎯 Purpose & Scope
Prevent file truncation, partial writes, and power-cut data loss using atomic write-temp-then-rename patterns and explicit OS kernel buffer synchronization.

---

### 📜 Governing Standards
POSIX rename() Atomicity Guarantee; ACID Durability (fsync); ISO/IEC 25010: Data Integrity & Reliability.

---

### 📋 Level 4: Atomic Checkpoints Specification

| Checkpoint Code | Atomic Checkpoint Name | Classification | Verification Specification Link |
| :---: | :--- | :---: | :---: |
| `CHK-RES-0401` | **Atomic Temporary File Replacement** | `[MANDATORY]` | [📄 View Checkpoint Specification](./01_atomic_temp_file_replacement.md) |
| `CHK-RES-0402` | **Explicit Directory & Buffer Syncing (fsync)** | `[BEST PRACTICE]` | [📄 View Checkpoint Specification](./02_explicit_directory_fsync.md) |

---
[⬅️ Back to Sub-Pillar (Level 2)](../README.md) | [🏠 Back to Root Index](../../../README.md)
