# [CHK-DATA-0102] Referential Integrity & Versioned Migrations
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-DATA] Data Architecture, Multi-Tenancy & Compliance (Level 1)](../../README.md) > [Relational Symmetry & Integrity (Level 2)](../README.md) > [Bidirectional Symmetry & Migrations (Level 3)](./README.md) > **CHK-DATA-0102 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-DATA-0102` |
| **Sub-Pillar & Category** | Relational Symmetry & Integrity / Bidirectional Symmetry & Migrations |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | ISO/IEC 25010 (Reliability & Maintainability); Evolutionary Database Design (Fowler & Sadalage) |
| **Target Entities** | SQL DDL files, Prisma/Drizzle/Alembic/Flyway migrations, database schema definitions |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Every relational table must enforce explicit primary keys (UUIDs or immutable surrogate keys), standard audit timestamps (`created_at`, `updated_at`), and database-level foreign key constraints (`REFERENCES`). All schema modifications must be delivered exclusively through **sequential, versioned, committed, and reversible migration files**—never via manual out-of-band production DDL edits.
* **Engineering Rationale:** Relying solely on application-layer validation for referential integrity inevitably produces orphaned rows during concurrent writes, scripts, or partial failures. Unversioned manual DDL edits cause silent environment drift between development, staging, and production.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Unenforced Foreign Key Columns:** Strictly `0` `*_id` relational columns lacking an explicit `FOREIGN KEY` constraint (unless documented as a cross-service external reference).
* **Out-of-Band Schema Edits:** Strictly `0` manual production DDL alterations outside versioned migration history.
* **Migration Reproducibility:** `100%` clean replay from an empty database to `HEAD` in CI with zero manual intervention.

---

### 4. Step-by-Step Verification Protocol
1. **Clean Replay Verification:**
   * Spin up an ephemeral database instance in CI and execute the full migration sequence from scratch (`prisma migrate deploy`, `alembic upgrade head`, or `flyway migrate`).
2. **Constraint Inspection:**
   * Query `information_schema.table_constraints` to confirm all relational tables enforce primary keys, foreign keys, and `NOT NULL` invariants.
3. **Drift Detection:**
   * Run schema diff against the committed ORM schema (`prisma migrate diff` / `alembic check`) and verify zero unmigrated drift.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All schema changes are captured in sequential committed migrations, replay cleanly on an empty database, and enforce explicit foreign key constraints.
* **`FAIL`:** Schema drift exists between migrations and ORM models, relational columns lack DB-level foreign keys, or production schemas are mutated manually.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Unconstrained Column & Manual DDL)
```sql
-- Prohibited: No foreign key constraint, no audit timestamps, applied ad-hoc in prod console
CREATE TABLE invoices (
  id SERIAL,
  customer_id INT,
  amount FLOAT
);
```

#### ✅ Compliant Canonical Pattern (Versioned Migration with Strict Constraints)
```sql
-- Migration: 20260415_001_create_invoices.sql
-- Up
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  amount_cents BIGINT NOT NULL CHECK (amount_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE INDEX idx_invoices_tenant_customer ON invoices (tenant_id, customer_id) WHERE deleted_at IS NULL;

-- Down (Reversible)
-- DROP TABLE IF EXISTS invoices;
```

---
[⬅️ Back to Bidirectional Symmetry & Migrations (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
