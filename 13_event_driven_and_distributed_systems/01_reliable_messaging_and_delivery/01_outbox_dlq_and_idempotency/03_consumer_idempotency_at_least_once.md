# [CHK-EVENT-0103] Consumer Idempotency Under At-Least-Once Delivery
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-EVENT] Event-Driven Architecture & Distributed Systems (Level 1)](../../README.md) > [Reliable Messaging & Delivery (Level 2)](../README.md) > [Outbox, DLQ & Consumer Idempotency (Level 3)](./README.md) > **CHK-EVENT-0103 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-EVENT-0103` |
| **Sub-Pillar & Category** | Reliable Messaging & Delivery / Outbox, DLQ & Consumer Idempotency |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Distributed Messaging Reliability (Idempotent Receiver Pattern); ISO/IEC 25010 (Data Integrity) |
| **Target Entities** | Event consumers, webhook handlers, background job processors |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Because distributed brokers (Kafka, SQS, RabbitMQ, webhooks) guarantee **at-least-once delivery** (meaning duplicate and out-of-order deliveries are normal in production), every event consumer must be **strictly idempotent**—atomically recording the unique `eventId` in a `processed_events` table (with a `UNIQUE(consumer_name, event_id)` constraint) inside the same database transaction as its business side effect, or executing natural upsert/state-guarded updates.
* **Engineering Rationale:** A non-idempotent consumer redelivered after a visibility timeout or consumer rebalance will double-charge customers, send duplicate SMS/emails, or double-increment inventory counters.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Duplicate Side Effects on Redelivery:** Strictly `0` duplicate rows, charges, or notifications when the exact same event message is delivered 3+ times sequentially or concurrently.

---

### 4. Step-by-Step Verification Protocol
1. **Duplicate Delivery Test:**
   * Dispatch the exact same `eventId` to the consumer handler twice in an integration test; verify the second execution is a safe no-op (`ack`) and final database state matches a single execution.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Consumers atomically deduplicate by unique `(consumer_name, event_id)` or natural idempotent guards, passing duplicate-delivery tests with zero extra side effects.
* **`FAIL`:** Redelivering a message repeats financial, inventory, or external side effects.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Non-Idempotent Balance Increment)
```typescript
// Prohibited: Redelivered event credits the wallet twice!
async function onPaymentSettled(event: { eventId: string; accountId: string; amountCents: number }) {
  await db.accounts.update({
    where: { id: event.accountId },
    data: { balanceCents: { increment: event.amountCents } },
  });
}
```

#### ✅ Compliant Canonical Pattern (Atomic Deduplication Table in Same Transaction)
```typescript
// Compliant: Unique constraint on (consumerName, eventId) guarantees exactly-once effect
async function onPaymentSettled(event: { eventId: string; accountId: string; amountCents: number }) {
  await db.$transaction(async (tx) => {
    const inserted = await tx.$executeRaw`
      INSERT INTO processed_events (consumer_name, event_id, processed_at)
      VALUES ('wallet-ledger', ${event.eventId}, NOW())
      ON CONFLICT (consumer_name, event_id) DO NOTHING
    `;
    if (inserted === 0) return; // Already processed safely -> no-op

    await tx.accounts.update({
      where: { id: event.accountId },
      data: { balanceCents: { increment: event.amountCents } },
    });
  });
}
```

---
[⬅️ Back to Outbox, DLQ & Consumer Idempotency (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
