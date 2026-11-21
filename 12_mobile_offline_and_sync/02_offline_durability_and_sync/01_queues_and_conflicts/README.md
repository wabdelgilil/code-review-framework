# [MOB-02-01] Offline Queues, Conflicts & Adaptive Sync
## Level 3 Category Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-MOB] Mobile, Offline-First & Sync Engineering (Level 1)](../../README.md) > [Offline Durability & Sync (Level 2)](../README.md) > **Offline Queues, Conflicts & Adaptive Sync (Level 3)**

---

### 🎯 Purpose & Scope
Enforce crash-safe offline write queues, idempotent conflict-aware synchronization, and energy-conscious background scheduling.

---

### 📜 Governing Standards
Local-First Software Architecture; ISO/IEC 25010 (Reliability & Resource Utilization); Android WorkManager / iOS BGTaskScheduler Guidelines.

---

### 📋 Level 4: Atomic Checkpoints Specification

| Checkpoint Code | Atomic Checkpoint Name | Classification | Verification Specification Link |
| :---: | :--- | :---: | :---: |
| `CHK-MOB-0201` | **Durable Offline Mutation Queues** | `[MANDATORY]` | [📄 View Checkpoint Specification](./01_durable_offline_mutation_queues.md) |
| `CHK-MOB-0202` | **Deterministic Sync Conflict Resolution** | `[MANDATORY]` | [📄 View Checkpoint Specification](./02_deterministic_sync_conflict_resolution.md) |
| `CHK-MOB-0203` | **Battery & Network-Aware Adaptive Sync** | `[BEST PRACTICE]` | [📄 View Checkpoint Specification](./03_battery_and_network_aware_adaptive_sync.md) |

---
[⬅️ Back to Sub-Pillar (Level 2)](../README.md) | [🏠 Back to Root Index](../../../README.md)
