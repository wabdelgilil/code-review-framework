# [CHK-DATA-0301] Immutable Append-Only Audit Trails
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-DATA] Data Architecture, Multi-Tenancy & Compliance (Level 1)](../../README.md) > [Auditability & Data Governance (Level 2)](../README.md) > [Immutable Audit Trails & Governance (Level 3)](./README.md) > **CHK-DATA-0301 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-DATA-0301` |
| **Sub-Pillar & Category** | Auditability & Data Governance / Immutable Audit Trails & Governance |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | ISO/IEC 27001 (A.12.4); SOC 2 Type II (CC7.2); ISO 55000 Asset Traceability |
| **Target Entities** | Financial, asset, permission, configuration, and workflow state-mutating services; `audit_logs` table |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Every create, update, soft-delete, status transition, and permission/role modification on critical domain entities must emit a structured audit log record capturing: **actor identity (`actor_id`)**, **tenant context (`tenant_id`)**, **UTC timestamp**, **action type**, **target entity type & ID**, **correlation ID**, and **before/after field diffs** (with sensitive secrets scrubbed). Audit log storage must be **append-only and tamper-resistant**—exposing zero application APIs or DB permissions to mutate or delete historical audit entries.
* **Engineering Rationale:** Operational incidents, financial discrepancies, and security investigations require an authoritative, non-repudiable chain of custody. Mutable audit tables or missing field diffs fail enterprise compliance audits and prevent forensic root-cause analysis.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Critical Mutation Coverage:** `100%` of state-changing operations on financial, permission, and core operational entities emit an audit record atomically within the same transaction.
* **Audit Mutability:** Strictly `0` API endpoints or application DB privileges permitting `UPDATE` or `DELETE` on `audit_logs`.

---

### 4. Step-by-Step Verification Protocol
1. **Database Immutability Check:**
   * Inspect database grants and triggers on `audit_logs`; verify `REVOKE UPDATE, DELETE ON audit_logs FROM app_role;` or an immutability trigger raising an exception on update/delete.
2. **Transactional Atomicity Verification:**
   * Mutate a critical record and verify the corresponding `audit_logs` entry contains valid `actor_id`, `tenant_id`, `occurred_at` (UTC), `entity_id`, and accurate `before`/`after` JSON diff.
3. **Secret Scrubbing Check:**
   * Trigger a user password/token update and verify the emitted audit diff redacts sensitive fields (`[REDACTED]`).

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Critical mutations atomically emit structured, scrubbed audit records with before/after diffs into an append-only store with zero update/delete pathways.
* **`FAIL`:** Critical mutations bypass audit logging, audit entries lack actor/diff metadata, or application code/roles can alter or delete audit records.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Missing Diff & Mutable Table)
```typescript
// Prohibited: Unstructured log string, no diff, outside DB transaction
await db.roles.update({ where: { id: roleId }, data: { permissions } });
console.log(`User ${userId} updated role ${roleId}`);
```

#### ✅ Compliant Canonical Pattern (Atomic Append-Only Audit Record + DB Guard)
```sql
-- Compliant: Enforce append-only immutability at the database layer
REVOKE UPDATE, DELETE, TRUNCATE ON TABLE audit_logs FROM app_runtime_role;
```
```typescript
// Compliant: Atomic mutation + structured before/after diff audit record
await db.$transaction(async (tx) => {
  const before = await tx.roles.findFirstOrThrow({ where: { id: roleId, tenantId: ctx.tenantId } });
  const after = await tx.roles.update({ where: { id: roleId }, data: { permissions } });

  await tx.auditLogs.create({
    data: {
      tenantId: ctx.tenantId,
      actorId: ctx.userId,
      correlationId: ctx.correlationId,
      action: 'ROLE_PERMISSIONS_UPDATED',
      entityType: 'Role',
      entityId: roleId,
      beforeState: { permissions: before.permissions },
      afterState: { permissions: after.permissions },
      occurredAt: new Date(),
    },
  });
});
```

---
[⬅️ Back to Immutable Audit Trails & Governance (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
