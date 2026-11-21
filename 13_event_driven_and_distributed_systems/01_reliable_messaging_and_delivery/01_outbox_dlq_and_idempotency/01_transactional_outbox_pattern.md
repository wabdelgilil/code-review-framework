# [CHK-EVENT-0101] Transactional Outbox Pattern
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-EVENT] Event-Driven Architecture & Distributed Systems (Level 1)](../../README.md) > [Reliable Messaging & Delivery (Level 2)](../README.md) > [Outbox, DLQ & Consumer Idempotency (Level 3)](./README.md) > **CHK-EVENT-0101 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-EVENT-0101` |
| **Sub-Pillar & Category** | Reliable Messaging & Delivery / Outbox, DLQ & Consumer Idempotency |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Microservices Patterns (Transactional Outbox); Distributed Data Consistency |
| **Target Entities** | Domain services persisting state to SQL and publishing events to Kafka, RabbitMQ, SQS, or Redis Streams |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Services that mutate a database and publish a domain event to a message broker must **never perform an uncoordinated dual-write** (DB commit followed by direct broker publish). Instead, write the domain state change and the serialized event record into an **`outbox_events` table inside the exact same database transaction**, then relay events asynchronously via a polling publisher or CDC connector (e.g., Debezium).
* **Engineering Rationale:** If the process crashes or the broker times out after `db.commit()` and before `broker.publish()`, the domain event is permanently lost—leaving downstream billing, search, or notification services out of sync forever. Conversely, publishing before `db.commit()` emits phantom events when transactions roll back.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Uncoordinated Dual-Writes:** Strictly `0` critical domain workflows publishing directly to a message broker outside a transactional outbox or CDC pipeline.
* **Event Loss on Crash:** `0` lost domain events when broker connectivity drops during transaction commit.

---

### 4. Step-by-Step Verification Protocol
1. **Service Code Audit:**
   * Inspect domain services invoking both DB writes and broker `.publish()`/`.send()` calls; verify broker publishing occurs via a dedicated outbox relay/CDC worker.
2. **Broker Outage Test:**
   * Stop the local message broker, commit a domain mutation, verify the `outbox_events` row is persisted, restart the broker, and confirm the event is delivered automatically.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** State mutations and outbox event records commit atomically in one database transaction, with reliable asynchronous relay to the message broker.
* **`FAIL`:** Services perform raw dual-writes directly to both database and message broker without transactional atomicity.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Fragile Dual-Write)
```typescript
// Prohibited: Process crash between DB commit and Kafka publish loses event forever
await db.orders.create({ data: order });
await kafkaProducer.send({ topic: 'orders.created', messages: [{ value: JSON.stringify(order) }] });
```

#### ✅ Compliant Canonical Pattern (Atomic Transactional Outbox)
```typescript
// Compliant: Order and Outbox event commit or roll back atomically together
await db.$transaction(async (tx) => {
  const created = await tx.orders.create({ data: order });
  await tx.outboxEvents.create({
    data: {
      eventId: crypto.randomUUID(),
      aggregateType: 'Order',
      aggregateId: created.id,
      eventType: 'orders.created.v1',
      payload: created,
      status: 'PENDING',
    },
  });
});
```

---
[⬅️ Back to Outbox, DLQ & Consumer Idempotency (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
