# [CHK-DATA-0103] Soft Delete & Consistent Query Filtering
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-DATA] Data Architecture, Multi-Tenancy & Compliance (Level 1)](../../README.md) > [Relational Symmetry & Integrity (Level 2)](../README.md) > [Transactional & Lifecycle Safety (Level 3)](./README.md) > **CHK-DATA-0103 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-DATA-0103` |
| **Sub-Pillar & Category** | Relational Symmetry & Integrity / Transactional & Lifecycle Safety |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | ISO/IEC 25010 (Recoverability & Integrity); Financial & Operational Auditability Standards |
| **Target Entities** | Operational database tables, repository query builders, search endpoints, reporting aggregations |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Operational, financial, and audit-relevant entities must use **soft delete (`deleted_at TIMESTAMPTZ NULL`)** as the default deletion strategy rather than destructive `DELETE FROM`. Every standard read query, search endpoint, dashboard KPI, and unique constraint (via partial unique index `WHERE deleted_at IS NULL`) must consistently filter out soft-deleted records.
* **Engineering Rationale:** Hard-deleting operational records destroys historical audit lineage, breaks foreign key references in historical invoices/work orders, and makes accidental deletion recovery impossible. Conversely, failing to filter `deleted_at IS NULL` leaks deleted items into search results and inflates dashboard metrics.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Hard Delete Usage on Operational Entities:** Strictly `0` unapproved `DELETE FROM` statements on core operational tables (hard delete reserved strictly for compliant privacy erasure/purge jobs).
* **Deleted Record Leakage:** `0` soft-deleted rows returned by standard list, detail, search, or aggregation endpoints.

---

### 4. Step-by-Step Verification Protocol
1. **Repository & ORM Audit:**
   * Inspect delete methods on operational repositories; confirm they set `deleted_at = NOW()` (and `deleted_by = actorId`) instead of executing physical deletes.
2. **Global Read Filtering Test:**
   * Soft-delete a test record and execute integration tests across `GET /list`, `GET /:id`, `/search`, `/export`, and aggregate dashboard endpoints to verify the record is excluded.
3. **Partial Unique Index Check:**
   * Verify unique business keys (e.g., SKU, email, code) use `WHERE deleted_at IS NULL` so soft-deleted records do not permanently block legitimate reuse.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Operational entities default to soft delete, all reads/aggregations exclude `deleted_at IS NOT NULL`, and integration tests confirm zero deleted-record leakage.
* **`FAIL`:** Operational records are physically deleted, or soft-deleted records appear in listings, search results, or aggregate KPIs.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Destructive Delete & Unfiltered Read)
```sql
-- Prohibited: Destroys financial/operational lineage
DELETE FROM assets WHERE id = $1;

-- Prohibited: Leaks soft-deleted records into operational totals
SELECT COUNT(*) FROM work_orders WHERE tenant_id = $1;
```

#### ✅ Compliant Canonical Pattern (Soft Delete + Scoped Read + Partial Unique Index)
```sql
-- Compliant: Partial unique index allows code reuse after soft deletion
CREATE UNIQUE INDEX uq_assets_tenant_code
  ON assets (tenant_id, asset_code)
  WHERE deleted_at IS NULL;

-- Compliant: Soft delete preserves lineage and records actor
UPDATE assets
SET deleted_at = NOW(), deleted_by = $2, updated_at = NOW()
WHERE id = $1 AND tenant_id = $3 AND deleted_at IS NULL;

-- Compliant: Consistent active-record filtering
SELECT COUNT(*)
FROM work_orders
WHERE tenant_id = $1 AND deleted_at IS NULL;
```

---
[⬅️ Back to Transactional & Lifecycle Safety (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
