# [CHK-API-0103] Idempotency Keys for Critical Mutations
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-API] API Governance, Delivery & Execution (Level 1)](../../README.md) > [API Contracts & Resilience (Level 2)](../README.md) > [Protection & Idempotency (Level 3)](./README.md) > **CHK-API-0103 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-API-0103` |
| **Sub-Pillar & Category** | API Contracts & Resilience / Protection & Idempotency |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | IETF `Idempotency-Key` HTTP Header Draft; Distributed Systems Exactly-Once Semantics |
| **Target Entities** | Payment/billing endpoints, inventory/work-order creation routes, offline mobile sync queues, webhook consumers |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** All critical non-idempotent mutating endpoints (`POST` creating financial charges, stock movements, purchase orders, or processing offline mobile sync queues) must support client-supplied **`Idempotency-Key`** headers stored atomically with the tenant scope and request payload hash. Replaying a request with the same key returns the cached original response without re-executing side effects; reusing a key with a different payload returns `409 Conflict` / `422 Unprocessable Entity`.
* **Engineering Rationale:** Mobile networks drop connections after the server commits a `POST` but before the client receives the HTTP `201` response. Without idempotency keys, automatic retries or user double-clicks create duplicate invoices, double-charged payments, and corrupted stock ledgers.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Duplicate Side Effects on Retry:** Strictly `0` duplicate database rows or charges when the same `POST` + `Idempotency-Key` is transmitted 2+ times sequentially or concurrently.
* **Key Retention Window:** Idempotency records persisted for $\ge 24\text{ hours}$ (or permanently for offline sync operation IDs).

---

### 4. Step-by-Step Verification Protocol
1. **Replay Test:**
   * Send two identical `POST` requests with the same `Idempotency-Key` and verify both return the exact same resource ID and only **1** row exists in the database.
2. **Payload Mismatch Test:**
   * Replay the same `Idempotency-Key` with a mutated request body and confirm `409`/`422` rejection.
3. **Concurrency Lock Test:**
   * Fire two concurrent requests with the same `Idempotency-Key` and verify a unique constraint `(tenant_id, idempotency_key)` prevents race-condition duplication.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Critical mutating and sync endpoints enforce scoped `Idempotency-Key` deduplication with payload hash verification and concurrency protection.
* **`FAIL`:** Retrying a `POST` due to network timeout creates duplicate financial, operational, or sync records.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Unprotected `POST` Creating Duplicates on Retry)
```typescript
// Prohibited: Double-click or network retry inserts two identical invoices
app.post('/api/v1/invoices', requireAuth, async (req, res) => {
  const invoice = await invoiceService.create(req.authContext, req.body);
  res.status(201).json({ data: invoice });
});
```

#### ✅ Compliant Canonical Pattern (Tenant-Scoped `Idempotency-Key` + Payload Hash)
```typescript
// Compliant: Middleware/transaction deduplicates by (tenantId, idempotencyKey)
app.post('/api/v1/invoices', requireAuth, requireIdempotencyKey(), async (req, res) => {
  const key = req.header('Idempotency-Key')!;
  const payloadHash = sha256Canonical(req.body);

  const result = await idempotencyStore.executeOnce({
    tenantId: req.authContext.tenantId,
    key,
    payloadHash,
    ttlSeconds: 86_400,
    handler: () => invoiceService.create(req.authContext, req.body),
  });

  res.status(result.statusCode).json(result.body);
});
```

---
[⬅️ Back to Protection & Idempotency (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
