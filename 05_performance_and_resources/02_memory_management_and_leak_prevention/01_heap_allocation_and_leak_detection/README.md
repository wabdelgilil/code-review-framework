# [PERF-02-01] Heap Allocation & Leak Detection
## Level 3 Category Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-PERF] Performance & Resource Efficiency (Level 1)](../../README.md) > [Memory Management & Leak Prevention (Level 2)](../README.md) > **Heap Allocation & Leak Detection (Level 3)**

---

### 🎯 Purpose & Scope
Verify steady-state memory consumption during repetitive operations, prevent memory leaks via eviction caps, and eliminate circular strong references.

---

### 📜 Governing Standards
Valgrind / Memcheck Principles; WeakRef Patterns; CERT Rules on Resource Exhaustion; ISO/IEC 25010: Resource Utilization.

---

### 📋 Level 4: Atomic Checkpoints Specification

| Checkpoint Code | Atomic Checkpoint Name | Classification | Verification Specification Link |
| :---: | :--- | :---: | :---: |
| `CHK-PERF-0201` | **Bounded Memory Footprint in Repetitive Cycles** | `[MANDATORY]` | [📄 View Checkpoint Specification](./01_bounded_memory_footprint_repetition.md) |
| `CHK-PERF-0202` | **Circular Reference Elimination & Weak References** | `[MANDATORY]` | [📄 View Checkpoint Specification](./02_circular_reference_elimination.md) |

---
[⬅️ Back to Sub-Pillar (Level 2)](../README.md) | [🏠 Back to Root Index](../../../README.md)
