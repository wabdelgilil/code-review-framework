# [CHK-DATA-0202] Strict Multi-Tenant Isolation & Database RLS
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-DATA] Data Architecture, Multi-Tenancy & Compliance (Level 1)](../../README.md) > [Multi-Tenancy & Access Control (Level 2)](../README.md) > [Tenant Isolation & RLS (Level 3)](./README.md) > **CHK-DATA-0202 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-DATA-0202` |
| **Sub-Pillar & Category** | Multi-Tenancy & Access Control / Tenant Isolation & RLS |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | OWASP ASVS v4.0 (V4.2 Operation Level Access Control); AWS/PostgreSQL Multi-Tenant SaaS Isolation Architecture |
| **Target Entities** | Tenant-owned database tables, ORM repositories, search indexes, report generators, object storage paths |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Every tenant-owned table, query, search index, report, cache key, and object-storage prefix must enforce strict `tenant_id` scoping. The active `tenant_id` must be derived **exclusively from verified server-side session/JWT claims**—never trusted from request bodies, query strings, or headers. Where supported (e.g., PostgreSQL), **Row-Level Security (RLS)** must be enabled and forced as the final database-layer barrier against cross-tenant data leakage.
* **Engineering Rationale:** A single forgotten `WHERE tenant_id = $1` clause in a repository query or report endpoint causes catastrophic cross-tenant data exposure. Enforcing PostgreSQL RLS alongside server-derived tenant context ensures Defense-in-Depth even if an application query omits a filter.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Unscoped Tenant Tables:** Strictly `0` tenant-owned tables missing a `NOT NULL tenant_id` column or active RLS policy.
* **Cross-Tenant Leakage in Tests:** Strictly `0` records, search hits, or storage URLs belonging to Tenant B accessible using Tenant A's credentials.

---

### 4. Step-by-Step Verification Protocol
1. **RLS Policy Inspection (PostgreSQL):**
   * Query `pg_tables` and `pg_policies` to confirm `rowsecurity = true` on all tenant-owned tables and confirm the application database role does NOT possess `BYPASSRLS`.
2. **Client-Supplied `tenant_id` Rejection Audit:**
   * Grep route handlers and DTO validators to ensure `tenant_id` is never accepted from `req.body` or `req.query` for standard tenant users.
3. **Cross-Tenant Adversarial Integration Suite:**
   * Seed Tenant A and Tenant B with distinct records; authenticate as Tenant A and attempt `GET`, `PATCH`, `DELETE`, `/search`, and `/export` using Tenant B's resource IDs. Every attempt must return `404`/`403` with zero leaked data.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All tenant-owned tables enforce server-derived `tenant_id` scoping + database RLS, cache/storage keys are tenant-prefixed, and cross-tenant isolation tests pass 100%.
* **`FAIL`:** Any query accepts client-supplied `tenant_id`, any tenant table lacks RLS/scoping, or any cross-tenant read/write succeeds.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Trusting Client `tenant_id` Without RLS)
```typescript
// Prohibited: Trusts client-supplied tenantId and queries directly by record ID
app.get('/api/v1/work-orders/:id', requireAuth, async (req, res) => {
  const order = await db.workOrders.findUnique({ where: { id: req.params.id } });
  res.json(order); // Cross-tenant data breach if ID belongs to Tenant B!
});
```

#### ✅ Compliant Canonical Pattern (Server-Derived Context + Database RLS)
```sql
-- Compliant: Database-enforced PostgreSQL Row-Level Security
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_work_orders ON work_orders
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
```
```typescript
// Compliant: Application binds verified server session tenant_id into transaction context
async function getWorkOrder(ctx: VerifiedAuthContext, workOrderId: string) {
  return db.withTenantContext(ctx.tenantId, (tx) =>
    tx.workOrders.findFirst({
      where: { id: workOrderId, tenantId: ctx.tenantId, deletedAt: null },
    })
  );
}
```

---
[⬅️ Back to Tenant Isolation & RLS (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
