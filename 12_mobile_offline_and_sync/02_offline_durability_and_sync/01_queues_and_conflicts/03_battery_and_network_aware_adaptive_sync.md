# [CHK-MOB-0203] Battery & Network-Aware Adaptive Sync
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-MOB] Mobile, Offline-First & Sync Engineering (Level 1)](../../README.md) > [Offline Durability & Sync (Level 2)](../README.md) > [Offline Queues, Conflicts & Adaptive Sync (Level 3)](./README.md) > **CHK-MOB-0203 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-MOB-0203` |
| **Sub-Pillar & Category** | Offline Durability & Sync / Offline Queues, Conflicts & Adaptive Sync |
| **Classification** | **`[BEST PRACTICE]`** |
| **Governing Standard** | Android WorkManager & iOS BGTaskScheduler Best Practices; ISO/IEC 25010 (Resource Utilization) |
| **Target Entities** | Background sync workers, delta-pull endpoints, media/photo upload managers, retry schedulers |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Mobile synchronization must use **delta/cursor pulls (`since_cursor`)** rather than repeatedly downloading entire tables, batch small mutations, compress/resize captured photos prior to upload, schedule background sync via OS-native constraint-aware schedulers (`WorkManager` / `BGTaskScheduler` respecting network reachability and battery saver mode), and apply **exponential backoff** on connectivity failure—never tight foreground/background polling loops.
* **Engineering Rationale:** Tight polling loops and uncompressed 12MB photo uploads on weak cellular links rapidly drain field technicians' phone batteries, exhaust cellular data caps, and get terminated by OS background watchdogs.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Full-Table Re-Downloads on Incremental Sync:** Strictly `0`; incremental pulls fetch only deltas since the last committed watermark/cursor.
* **Tight Retry Polling:** Strictly `0` fixed-interval retry timers $< 30\text{ s}$ running while offline.

---

### 4. Step-by-Step Verification Protocol
1. **Sync Protocol Audit:**
   * Inspect sync pull endpoints to confirm cursor/watermark delta parameters (`?since=<cursor>&limit=200`).
2. **Media & Scheduler Inspection:**
   * Verify photo uploads compress/resize images before queueing and background sync registers OS network/battery constraints.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Sync uses cursor-based delta pulls, OS-native constrained background scheduling, image compression, and exponential backoff on failure.
* **`FAIL`:** App polls aggressively in tight loops while offline or repeatedly downloads full entity catalogs on every reconnect.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Aggressive Polling & Full-Dataset Pull)
```dart
// Prohibited: Drains battery and bandwidth by polling every 5 seconds for all records
Timer.periodic(const Duration(seconds: 5), (_) async {
  final allAssets = await api.get('/api/v1/assets'); // Full table every 5s!
  await localDb.replaceAll(allAssets);
});
```

#### ✅ Compliant Canonical Pattern (Delta Cursor Pull + Connectivity-Triggered Backoff)
```dart
// Compliant: Syncs only deltas when network is available, with bounded batching
Future<void> pullDeltaChanges() async {
  if (!await connectivity.isOnline) return;
  final cursor = await syncStateStore.getLastCursor('assets');
  final page = await api.get('/api/v1/assets/delta', query: {'since': cursor, 'limit': 200});
  await localDb.upsertBatch(page.changes);
  await syncStateStore.saveCursor('assets', page.nextCursor);
}
```

---
[⬅️ Back to Offline Queues, Conflicts & Adaptive Sync (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
