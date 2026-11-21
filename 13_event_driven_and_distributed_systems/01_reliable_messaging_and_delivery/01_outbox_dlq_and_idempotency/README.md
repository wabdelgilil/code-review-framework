# [EVENT-01-01] Outbox, DLQ & Consumer Idempotency
## Level 3 Category Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-EVENT] Event-Driven Architecture & Distributed Systems (Level 1)](../../README.md) > [Reliable Messaging & Delivery (Level 2)](../README.md) > **Outbox, DLQ & Consumer Idempotency (Level 3)**

---

### 🎯 Purpose & Scope
Ensure state commits and event publications stay atomically consistent, poison messages never stall queues, and redelivered events produce zero duplicate side effects.

---

### 📜 Governing Standards
Enterprise Integration Patterns (Hohpe & Woolf); Microservices Patterns (Chris Richardson); ISO/IEC 25010 (Reliability).

---

### 📋 Level 4: Atomic Checkpoints Specification

| Checkpoint Code | Atomic Checkpoint Name | Classification | Verification Specification Link |
| :---: | :--- | :---: | :---: |
| `CHK-EVENT-0101` | **Transactional Outbox Pattern** | `[MANDATORY]` | [📄 View Checkpoint Specification](./01_transactional_outbox_pattern.md) |
| `CHK-EVENT-0102` | **Dead-Letter Queues & Poison-Pill Isolation** | `[MANDATORY]` | [📄 View Checkpoint Specification](./02_dead_letter_queues_and_poison_pill_isolation.md) |
| `CHK-EVENT-0103` | **Consumer Idempotency Under At-Least-Once Delivery** | `[MANDATORY]` | [📄 View Checkpoint Specification](./03_consumer_idempotency_at_least_once.md) |

---
[⬅️ Back to Sub-Pillar (Level 2)](../README.md) | [🏠 Back to Root Index](../../../README.md)
