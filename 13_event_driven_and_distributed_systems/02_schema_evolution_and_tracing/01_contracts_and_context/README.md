# [EVENT-02-01] Event Contracts & Trace Context
## Level 3 Category Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-EVENT] Event-Driven Architecture & Distributed Systems (Level 1)](../../README.md) > [Schema Evolution & Distributed Tracing (Level 2)](../README.md) > **Event Contracts & Trace Context (Level 3)**

---

### 🎯 Purpose & Scope
Prevent breaking schema deployments across decoupled producers/consumers and enable end-to-end latency/error diagnostics across queues.

---

### 📜 Governing Standards
CloudEvents v1.0 Specification; W3C Trace Context Level 1; OpenTelemetry Messaging Semantic Conventions.

---

### 📋 Level 4: Atomic Checkpoints Specification

| Checkpoint Code | Atomic Checkpoint Name | Classification | Verification Specification Link |
| :---: | :--- | :---: | :---: |
| `CHK-EVENT-0201` | **Event Schema Registry & Backward Compatibility** | `[MANDATORY]` | [📄 View Checkpoint Specification](./01_event_schema_registry_and_compatibility.md) |
| `CHK-EVENT-0202` | **Distributed Trace Context Propagation (`traceparent`)** | `[BEST PRACTICE]` | [📄 View Checkpoint Specification](./02_distributed_trace_context_propagation.md) |

---
[⬅️ Back to Sub-Pillar (Level 2)](../README.md) | [🏠 Back to Root Index](../../../README.md)
