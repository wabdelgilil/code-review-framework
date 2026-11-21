# [CHK-EVENT-0102] Dead-Letter Queues & Poison-Pill Isolation
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-EVENT] Event-Driven Architecture & Distributed Systems (Level 1)](../../README.md) > [Reliable Messaging & Delivery (Level 2)](../README.md) > [Outbox, DLQ & Consumer Idempotency (Level 3)](./README.md) > **CHK-EVENT-0102 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-EVENT-0102` |
| **Sub-Pillar & Category** | Reliable Messaging & Delivery / Outbox, DLQ & Consumer Idempotency |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Enterprise Integration Patterns (Dead Letter Channel); ISO/IEC 25010 (Fault Tolerance) |
| **Target Entities** | Queue consumers, background job workers (BullMQ, Celery, SQS, RabbitMQ, Kafka consumers), alerting configs |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Every asynchronous queue or topic consumer must enforce a **bounded maximum retry count (`maxReceiveCount` / `maxAttempts`)** with exponential backoff and route permanently failing or malformed "poison-pill" messages to a dedicated **Dead-Letter Queue (DLQ)** with error metadata, active **alerting on DLQ depth $> 0$**, and a documented **replay runbook**.
* **Engineering Rationale:** Without bounded retries and a DLQ, a single malformed message causes an infinite crash-requeue loop that starves worker concurrency, inflates cloud bills, and stalls every healthy message behind it.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Unbounded Retry Loops:** Strictly `0` consumers configured with infinite retries (`maxAttempts = Infinity` or unacknowledged requeue loops).
* **DLQ Alerting:** `100%` of production queues/topics have a configured DLQ and alert threshold when `dlq_message_count > 0`.

---

### 4. Step-by-Step Verification Protocol
1. **Queue Topology Audit:**
   * Inspect IaC/worker definitions to confirm every primary queue has a paired `*-dlq` target and bounded `maxAttempts` (e.g., `3–5`).
2. **Poison-Pill Injection Test:**
   * Publish an intentionally malformed JSON payload; verify the consumer fails deterministically, routes the message to the DLQ after bounded retries (or immediately for non-retryable schema errors), and continues processing valid messages cleanly.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All queues/workers enforce bounded retries, route poison pills to monitored DLQs with error context, and support safe replay.
* **`FAIL`:** Malformed messages loop infinitely, stall consumer partitions, or are silently dropped without DLQ capture.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Infinite Requeue Loop)
```typescript
// Prohibited: Requeues malformed message forever, starving all workers
channel.consume('invoices', async (msg) => {
  try {
    await processInvoice(JSON.parse(msg.content.toString()));
    channel.ack(msg);
  } catch (err) {
    channel.nack(msg, false, true); // requeue=true -> infinite poison-pill loop!
  }
});
```

#### ✅ Compliant Canonical Pattern (Bounded Retries + Dead-Letter Routing)
```typescript
// Compliant: Non-retryable parse errors route immediately to DLQ; transient errors cap at 5 attempts
const worker = new Worker('invoices', processInvoiceJob, {
  connection: redis,
  settings: { backoffStrategy: (attempts) => Math.min(60_000, 1_000 * 2 ** attempts) },
});

// Queue defaultJobOptions: { attempts: 5, removeOnComplete: 1000, removeOnFail: false }
// Failed jobs exceeding max attempts are moved to 'invoices-dlq' with failure stack + alert metric
```

---
[⬅️ Back to Outbox, DLQ & Consumer Idempotency (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
