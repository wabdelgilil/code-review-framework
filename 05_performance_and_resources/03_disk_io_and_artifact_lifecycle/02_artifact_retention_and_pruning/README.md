# [PERF-03-02] Artifact Retention & Pruning
## Level 3 Category Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-PERF] Performance & Resource Efficiency (Level 1)](../../README.md) > [Disk I/O & Artifact Lifecycle (Level 2)](../README.md) > **Artifact Retention & Pruning (Level 3)**

---

### 🎯 Purpose & Scope
Enforce automated pruning and retention management of temporary runs, exports, and intermediate caches to prevent disk exhaustion and inode depletion.

---

### 📜 Governing Standards
Data Lifecycle Management (DLM); Storage Capacity Planning; ISO/IEC 25010: Resource Utilization.

---

### 📋 Level 4: Atomic Checkpoints Specification

| Checkpoint Code | Atomic Checkpoint Name | Classification | Verification Specification Link |
| :---: | :--- | :---: | :---: |
| `CHK-PERF-0302` | **Automated Artifact Retention & Pruning Policy** | `[BEST PRACTICE]` | [📄 View Checkpoint Specification](./01_automated_retention_pruning_policy.md) |

---
[⬅️ Back to Sub-Pillar (Level 2)](../README.md) | [🏠 Back to Root Index](../../../README.md)
