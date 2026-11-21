# [CHK-EVENT-0201] Event Schema Registry & Backward Compatibility
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-EVENT] Event-Driven Architecture & Distributed Systems (Level 1)](../../README.md) > [Schema Evolution & Distributed Tracing (Level 2)](../README.md) > [Event Contracts & Trace Context (Level 3)](./README.md) > **CHK-EVENT-0201 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-EVENT-0201` |
| **Sub-Pillar & Category** | Schema Evolution & Distributed Tracing / Event Contracts & Trace Context |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | CloudEvents v1.0; Schema Registry Backward/Full Compatibility Standards (Avro / Protobuf / JSON Schema) |
| **Target Entities** | Event payload schemas, Kafka/broker topic contracts, producer serializers, consumer deserializers |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** All asynchronous domain events must conform to a **versioned, registered schema contract** (e.g., CloudEvents envelope + JSON Schema / Protobuf / Avro) governed by **backward-compatible evolution rules**—new fields must be optional with defaults, existing fields may never be renamed or change types in-place, and breaking payload changes require a new versioned event type (`orders.created.v2`).
* **Engineering Rationale:** Producers and consumers deploy independently and replay historical events from brokers or DLQs. In-place breaking schema changes cause silent deserialization failures across every subscribed service.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Unversioned Ad-Hoc Event Payloads:** Strictly `0` cross-service events published without a formal schema definition and explicit `eventType` version.
* **CI Compatibility Gate:** `100%` of event schema PRs pass automated backward-compatibility verification before merge.

---

### 4. Step-by-Step Verification Protocol
1. **Schema Compatibility Check:**
   * Run schema registry compatibility validation (`buf breaking`, Confluent Schema Registry check, or JSON Schema diff) in CI against `main`.
2. **Envelope Audit:**
   * Confirm every published event includes standard metadata: `eventId`, `eventType` (versioned), `occurredAt` (UTC ISO 8601), `tenantId`, and `data`.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Events follow versioned CloudEvents/schema contracts with automated backward-compatibility checks in CI.
* **`FAIL`:** Producers mutate event field names or types in-place without versioning, breaking independent consumers or DLQ replays.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Unversioned Ad-Hoc Event Payload)
```json
// Prohibited: No eventId, no version, no timestamp; changing "total" from number to string breaks consumers
{ "order": 42, "total": "199.50" }
```

#### ✅ Compliant Canonical Pattern (Versioned CloudEvents-Style Contract)
```json
{
  "specversion": "1.0",
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "type": "com.enterprise.orders.created.v1",
  "source": "/services/orders",
  "time": "2026-04-15T10:30:00.000Z",
  "tenantid": "tnt_01HZX8...",
  "data": {
    "orderId": "ord_01HZX9...",
    "totalCents": 19950,
    "currency": "SAR"
  }
}
```

---
[⬅️ Back to Event Contracts & Trace Context (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
