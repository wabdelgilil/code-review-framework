# [CHK-EVENT-0202] Distributed Trace Context Propagation (`traceparent`)
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-EVENT] Event-Driven Architecture & Distributed Systems (Level 1)](../../README.md) > [Schema Evolution & Distributed Tracing (Level 2)](../README.md) > [Event Contracts & Trace Context (Level 3)](./README.md) > **CHK-EVENT-0202 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-EVENT-0202` |
| **Sub-Pillar & Category** | Schema Evolution & Distributed Tracing / Event Contracts & Trace Context |
| **Classification** | **`[BEST PRACTICE]`** |
| **Governing Standard** | W3C Trace Context Level 1 (`traceparent`, `tracestate`); OpenTelemetry Messaging Semantic Conventions |
| **Target Entities** | Message producers, outbox relays, queue consumers, async webhook dispatchers |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Every asynchronous message, outbox row, and background job must inject the active **W3C `traceparent` header** (and `correlationId`) at enqueue/publish time, and every consumer must extract that context to create a linked/child OpenTelemetry span before executing handler logic.
* **Engineering Rationale:** Without async trace context propagation, distributed traces break the instant a request enqueues a background job—making it impossible to correlate an API request with downstream worker latency spikes or failures.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Orphaned Async Traces:** `0` production message producers/consumers dropping `traceparent` headers across queue hops.
* **End-to-End Trace Linkage:** `100%` of sampled HTTP → Outbox/Queue → Consumer workflows appear under a single unified `trace_id`.

---

### 4. Step-by-Step Verification Protocol
1. **Producer/Consumer Instrumentation Audit:**
   * Verify producers call `propagation.inject(context.active(), headers)` and consumers call `propagation.extract(ROOT_CONTEXT, headers)` before starting the processing span.
2. **Trace Inspection:**
   * Trigger an end-to-end async workflow in staging and verify the resulting trace tree connects the originating HTTP span to the downstream worker span under one `trace_id`.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** W3C `traceparent` and correlation IDs propagate seamlessly across outbox/queue/worker boundaries, uniting HTTP and async spans under one trace.
* **`FAIL`:** Background workers start disconnected root traces with no link to the originating request or event producer.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Dropping Trace Context at Queue Boundary)
```typescript
// Prohibited: Worker has no traceparent header; trace breaks completely
await queue.add('send-invoice', { invoiceId });
```

#### ✅ Compliant Canonical Pattern (W3C `traceparent` Inject & Extract)
```typescript
// Compliant: Inject active OTel trace context into message headers on enqueue
import { context, propagation, trace } from '@opentelemetry/api';

const carrier: Record<string, string> = {};
propagation.inject(context.active(), carrier);
await queue.add('send-invoice', { invoiceId, _traceHeaders: carrier });

// Consumer side: extract parent context so worker span links directly to producer trace
const parentCtx = propagation.extract(context.active(), job.data._traceHeaders ?? {});
await context.with(parentCtx, () =>
  tracer.startActiveSpan('worker.send-invoice', async (span) => {
    try { await sendInvoice(job.data.invoiceId); } finally { span.end(); }
  })
);
```

---
[⬅️ Back to Event Contracts & Trace Context (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
