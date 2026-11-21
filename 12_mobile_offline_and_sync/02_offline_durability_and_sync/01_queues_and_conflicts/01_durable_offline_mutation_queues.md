# [CHK-MOB-0201] Durable Offline Mutation Queues
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-MOB] Mobile, Offline-First & Sync Engineering (Level 1)](../../README.md) > [Offline Durability & Sync (Level 2)](../README.md) > [Offline Queues, Conflicts & Adaptive Sync (Level 3)](./README.md) > **CHK-MOB-0201 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-MOB-0201` |
| **Sub-Pillar & Category** | Offline Durability & Sync / Offline Queues, Conflicts & Adaptive Sync |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Local-First Software Reliability; ISO/IEC 25010 (Fault Tolerance & Recoverability) |
| **Target Entities** | Offline sync managers, local SQLite/Drift/WatermelonDB mutation queues, field-capture forms |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** In offline-capable mobile applications, every user mutation (form submissions, status updates, photo uploads) must be persisted **atomically to a durable on-disk queue** with a client-generated UUID (`operationId` / `Idempotency-Key`), ordered sequence timestamp, and retry counter—never held solely in volatile RAM. Queued items must survive app force-kills, OS termination, and device reboots, and be removed from the queue **only after server acknowledgment (`2xx`)**.
* **Engineering Rationale:** Field technicians routinely inspect basements, tunnels, and remote sites with zero connectivity. Keeping pending writes in memory loses hours of field work when the OS kills the backgrounded app.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Offline Write Loss on App Crash:** Strictly `0` committed local mutations lost after force-killing and relaunching the app while in airplane mode.
* **Duplicate Server Writes on Reconnect:** Strictly `0` duplicates (each queued item carries a persistent `Idempotency-Key`).

---

### 4. Step-by-Step Verification Protocol
1. **Airplane-Mode Kill Test:**
   * Enable airplane mode, submit 3 work-order mutations, force-kill the app, relaunch, disable airplane mode, and confirm all 3 mutations sync in order with zero data loss.
2. **Failure Quarantine Check:**
   * Verify permanent `4xx` validation errors move the item to a visible user-actionable `FAILED_SYNC` state rather than blocking the entire queue indefinitely (head-of-line blocking).

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Offline mutations persist durably on disk with idempotency keys, survive app termination, replay in order upon reconnect, and isolate permanent `4xx` failures without blocking subsequent items.
* **`FAIL`:** Pending offline writes live only in memory, disappear on app restart, lack idempotency keys, or wedge the entire queue on a single `4xx` error.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (In-Memory Pending List)
```dart
// Prohibited: Lost immediately if OS terminates the app in background
final List<Map<String, dynamic>> pendingUploads = [];
void submitOffline(Map<String, dynamic> payload) {
  pendingUploads.add(payload);
}
```

#### ✅ Compliant Canonical Pattern (Durable Transactional On-Disk Queue)
```dart
// Compliant: Persisted atomically to local SQLite with persistent Idempotency-Key
Future<void> enqueueMutation({
  required String entityType,
  required String entityId,
  required String operation,
  required Map<String, dynamic> payload,
}) async {
  await localDb.into(localDb.syncOutbox).insert(
    SyncOutboxCompanion.insert(
      operationId: const Uuid().v4(), // Sent as Idempotency-Key header
      entityType: entityType,
      entityId: entityId,
      operation: operation,
      payloadJson: jsonEncode(payload),
      status: const Value('PENDING'),
      createdAtUtc: DateTime.now().toUtc(),
    ),
  );
}
```

---
[⬅️ Back to Offline Queues, Conflicts & Adaptive Sync (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
