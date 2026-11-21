# [CHK-DATA-0104] Atomic Transactions & Zero-Variance Reconciliation
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-DATA] Data Architecture, Multi-Tenancy & Compliance (Level 1)](../../README.md) > [Relational Symmetry & Integrity (Level 2)](../README.md) > [Transactional & Lifecycle Safety (Level 3)](./README.md) > **CHK-DATA-0104 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-DATA-0104` |
| **Sub-Pillar & Category** | Relational Symmetry & Integrity / Transactional & Lifecycle Safety |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | ACID Transaction Isolation; ISO/IEC 25010 (Data Integrity); Double-Entry Accounting Invariants |
| **Target Entities** | Financial ledgers, inventory stock movements, billing/invoicing rollups, multi-table state transitions |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** All multi-step financial, inventory, quota, and cross-table state mutations must execute inside a **single atomic database transaction** with appropriate row-level locking (`SELECT ... FOR UPDATE` or optimistic concurrency version checks) and **self-verifying reconciliation invariants** guaranteeing zero variance (`delta === 0`).
* **Engineering Rationale:** Executing sequential updates outside a transaction causes partial writes on crash or timeout (e.g., deducting inventory without creating the stock movement ledger entry). Missing concurrency locks cause lost updates and negative stock/balance drift under concurrent requests.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Unwrapped Multi-Step Mutations:** Strictly `0` financial or inventory workflows performing multiple `INSERT`/`UPDATE` statements outside an explicit transaction boundary.
* **Reconciliation Delta:** Strictly `0` (`SUM(ledger_entries) - current_balance === 0`).

---

### 4. Step-by-Step Verification Protocol
1. **Transaction Boundary Audit:**
   * Inspect service methods performing $\ge 2$ write operations; verify all writes share the same transaction client (`tx`).
2. **Failure Rollback Test:**
   * Inject a simulated failure on step 2 of a multi-step mutation and verify step 1 is completely rolled back in the database.
3. **Concurrency Stress Test:**
   * Fire 20 concurrent deduction requests against a single inventory/balance row and confirm final balance equals `initial - successful_deductions` with zero negative drift.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Multi-step state mutations are atomically wrapped, protected against concurrent lost updates, and pass rollback and zero-variance reconciliation tests.
* **`FAIL`:** Partial writes persist after mid-operation failures, concurrent updates produce lost-update drift, or ledger aggregates diverge from stored balances.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Non-Atomic Race Condition)
```typescript
// Prohibited: Two separate queries without transaction or row lock
async function issueStock(partId: string, qty: number) {
  const part = await db.parts.findUnique({ where: { id: partId } });
  if (!part || part.stock < qty) throw new Error('Insufficient stock');

  // Crash or concurrent request here corrupts inventory permanently
  await db.parts.update({ where: { id: partId }, data: { stock: part.stock - qty } });
  await db.stockLedger.create({ data: { partId, delta: -qty } });
}
```

#### ✅ Compliant Canonical Pattern (Atomic Transaction + Optimistic/Pessimistic Lock)
```typescript
// Compliant: Atomic transaction with conditional guard preventing negative drift
async function issueStock(tenantId: string, partId: string, qty: number): Promise<void> {
  if (qty <= 0) throw new DomainValidationError('Quantity must be positive');

  await db.$transaction(async (tx) => {
    const updated = await tx.parts.updateMany({
      where: { id: partId, tenantId, deletedAt: null, stock: { gte: qty } },
      data: { stock: { decrement: qty } },
    });

    if (updated.count !== 1) {
      throw new InsufficientStockError(partId, qty);
    }

    await tx.stockLedger.create({
      data: { tenantId, partId, delta: -qty, recordedAt: new Date() },
    });
  });
}
```

---
[⬅️ Back to Transactional & Lifecycle Safety (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
