# [CHK-DATA-0101] Bidirectional Relationship Symmetry
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-DATA] Data Architecture, Multi-Tenancy & Compliance (Level 1)](../../README.md) > [Relational Symmetry & Integrity (Level 2)](../README.md) > [Bidirectional Symmetry & Migrations (Level 3)](./README.md) > **CHK-DATA-0101 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-DATA-0101` |
| **Sub-Pillar & Category** | Relational Symmetry & Integrity / Bidirectional Symmetry & Migrations |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | ISO/IEC 25010 (Functional Completeness & Integrity); Domain-Driven Design (Aggregate & Relationship Coherence) |
| **Target Entities** | Relational schemas, ORM models, REST/GraphQL endpoints, detail views and cross-navigation links |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Whenever Entity A maintains a domain relationship with Entity B, that relationship must be **symmetrical and navigable** across the database foreign key, ORM/repository model, API contract ($A \to B$ and $B \to A$ where operationally applicable), and UI navigation views. Zero core domain entities may exist as isolated islands lacking parent, child, operational, or reporting links.
* **Engineering Rationale:** One-way relationships (e.g., a Work Order links to an Asset, but the Asset detail view cannot list its associated Work Orders) fragment operational visibility, cause duplicate lookup logic, and lead to orphaned records that break reporting and compliance audits.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Isolated Core Entities:** Strictly `0` operational domain tables without explicit parent/child or reporting links.
* **Cross-Layer Symmetry Drift:** `0` foreign-key relationships exposed in one entity's API/UI without the corresponding reverse lookup or explicit architectural exclusion documented in an ADR.

---

### 4. Step-by-Step Verification Protocol
1. **Schema-to-ORM Audit:**
   * Inspect database foreign key constraints and verify each has a corresponding bidirectional relation definition in the ORM/repository layer.
2. **API Contract Symmetry Check:**
   * Verify that parent/child resources expose consistent relational endpoints or query filters (e.g., `GET /api/v1/assets/:id/work-orders` alongside `workOrder.assetId`).
3. **UI Navigation Verification:**
   * Confirm that detail screens for linked entities provide direct bidirectional navigation without dead ends.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All domain relationships are consistently modeled across DB, ORM, API, and UI with zero isolated entities.
* **`FAIL`:** Relationships exist in only one direction, foreign keys lack reverse lookups where operationally needed, or core entities are unreachable from related operational screens.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (One-Way Orphaned Relation)
```typescript
// Prohibited: WorkOrder references Asset, but Asset schema/API exposes no reverse relation
export interface WorkOrderDTO {
  id: string;
  assetId: string;
  title: string;
}

export interface AssetDTO {
  id: string;
  serialNumber: string;
  // Missing workOrders relation, count, or reverse endpoint link
}
```

#### ✅ Compliant Canonical Pattern (Symmetrical Cross-Layer Relation)
```typescript
// Compliant: Explicit bidirectional contracts across ORM, API, and UI navigation
export interface WorkOrderSummaryDTO {
  id: string;
  code: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
}

export interface WorkOrderDetailDTO {
  id: string;
  title: string;
  asset: { id: string; code: string; name: string }; // A -> B
}

export interface AssetDetailDTO {
  id: string;
  serialNumber: string;
  activeWorkOrderCount: number;
  recentWorkOrders: WorkOrderSummaryDTO[]; // B -> A (paginated endpoint: /assets/:id/work-orders)
}
```

---
[⬅️ Back to Bidirectional Symmetry & Migrations (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
