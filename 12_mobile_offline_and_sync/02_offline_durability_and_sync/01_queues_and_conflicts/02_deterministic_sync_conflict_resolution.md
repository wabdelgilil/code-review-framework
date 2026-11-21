# [CHK-MOB-0202] Deterministic Sync Conflict Resolution
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-MOB] Mobile, Offline-First & Sync Engineering (Level 1)](../../README.md) > [Offline Durability & Sync (Level 2)](../README.md) > [Offline Queues, Conflicts & Adaptive Sync (Level 3)](./README.md) > **CHK-MOB-0202 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-MOB-0202` |
| **Sub-Pillar & Category** | Offline Durability & Sync / Offline Queues, Conflicts & Adaptive Sync |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Optimistic Concurrency Control (RFC 9110 `If-Match` / Version Vectors); ISO/IEC 25010 (Data Integrity) |
| **Target Entities** | Offline sync APIs, entity version columns (`version` / `updated_at`), mobile conflict resolution UI |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Every offline-editable record must carry a **monotonic server-assigned version (`row_version` / ETag)** submitted with each sync mutation. When two offline devices or a web user and mobile user edit the same record concurrently, the server must detect the version mismatch (`409 Conflict`) and apply an explicit, documented **conflict resolution strategy** (field-level merge, domain-safe LWW with audit log, or user-guided resolution)—never silently overwriting newer server edits with stale full-object snapshots.
* **Engineering Rationale:** Blindly `PUT`ting an entire stale offline object overwrites critical updates made by dispatchers or other technicians (e.g., resetting a closed work order back to "In Progress").

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Silent Lost Updates:** Strictly `0` concurrent sync writes permitted to silently overwrite a newer `row_version` without explicit conflict detection and logging.
* **Conflict Auditability:** `100%` of detected sync conflicts record both conflicting payloads/versions for audit or user resolution.

---

### 4. Step-by-Step Verification Protocol
1. **Concurrent Edit Integration Test:**
   * Fetch record at `version = 1` on Device A and Device B; sync Device A (bumps to `version = 2`); sync Device B with `baseVersion = 1` and verify deterministic `409 Conflict` handling or safe field-level merge without losing Device A's changes.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Sync mutations transmit optimistic version markers, detect concurrent modifications deterministically, and resolve/surface conflicts without silent data loss.
* **`FAIL`:** Stale offline clients silently overwrite newer server records via unversioned full-object `PUT`s.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Unversioned Blind Overwrite)
```typescript
// Prohibited: Overwrites newer dispatcher updates with stale offline client state
await db.workOrders.update({
  where: { id: payload.id, tenantId },
  data: payload.fullRecord,
});
```

#### ✅ Compliant Canonical Pattern (Optimistic Version Check + Explicit Conflict Response)
```typescript
// Compliant: Atomic version guard prevents silent lost updates
const updated = await db.workOrders.updateMany({
  where: { id: payload.id, tenantId, rowVersion: payload.baseVersion },
  data: { ...payload.changedFields, rowVersion: { increment: 1 } },
});

if (updated.count === 0) {
  const current = await db.workOrders.findFirst({ where: { id: payload.id, tenantId } });
  throw new SyncConflictError({ entityId: payload.id, clientVersion: payload.baseVersion, serverState: current });
}
```

---
[⬅️ Back to Offline Queues, Conflicts & Adaptive Sync (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
