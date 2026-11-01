# [CHK-DOM-0303] Deterministic Re-computation vs Stale Caching
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-DOM] Domain Logic & Specifications (Level 1)](../../../README.md) > [Single Source of Truth (Level 2)](../../README.md) > [Derived Data Synchronization (Level 3)](../README.md) > **CHK-DOM-0303 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-DOM-0303` |
| **Sub-Pillar & Category** | Single Source of Truth / Derived Data Synchronization |
| **Classification** | **`[BEST PRACTICE]`** |
| **Governing Standard** | Functional Reactive Programming; Cache Invalidation Invariants; ISO/IEC 25010 (Correctness) |
| **Target Entities** | Computed properties, cached aggregates, memoized calculations, search indices |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Values that can be deterministically calculated from canonical state must be computed on-demand or backed by **strict, automatic cache invalidation** bound directly to the primary state lifecycle. Storing derived values in long-lived mutable fields without invalidation hooks is strictly forbidden.
* **Engineering Rationale:** Storing derived data (e.g. `order_total = sum(items)`) as an independent mutable column without automated synchronization leads to cache staleness, where modifying an item's price does not update the order total, causing silent data corruption.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Stale Cache Window:** Exactly `0` milliseconds for synchronous transactional boundaries (immediate consistency) or strictly bounded TTL for asynchronous read models.
* **Pure Computed Property Preference:** Derived properties with computational latency $\le 1\text{ms}$ must be implemented as pure getters rather than stored fields.

---

### 4. Step-by-Step Verification Protocol
1. **Derived Field Audit:**
   * Review data models for redundant columns that represent sums, counts, or status summaries of child records.
2. **Mutation Synchronization Test:**
   * Mutate a child item (e.g. change an item price).
   * Verify that the parent summary or getter reflects the new calculation immediately without manual refresh calls.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Derived values are computed on-demand or automatically synchronized upon primary state mutation.
* **`FAIL`:** The system stores derived data that becomes out of sync when underlying primary data is updated.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Stored Derived Field Without Invalidation)
```python
# Prohibited: Storing derived total in mutable field that easily becomes stale
class Cart:
    def __init__(self):
        self.items = []
        self.cached_total = 0.0  # Becomes stale if items are modified!

    def add_item(self, item):
        self.items.append(item)
        # What if item.price changes later? cached_total remains stale!
```

#### ✅ Compliant Canonical Pattern (Dynamic Pure Getter / Property)
```python
# Compliant: Dynamic on-demand calculation from authoritative items list
from dataclasses import dataclass

@dataclass(frozen=True)
class CartItem:
    item_id: str
    price_cents: int
    quantity: int

    @property
    def subtotal_cents(self) -> int:
        return self.price_cents * self.quantity

class Cart:
    def __init__(self):
        self._items: list[CartItem] = []

    def add_item(self, item: CartItem) -> None:
        self._items.append(item)

    @property
    def total_cents(self) -> int:
        """Pure derived property: guaranteed 100% synchronized with current state."""
        return sum(item.subtotal_cents for item in self._items)
```

---
[⬅️ Back to Derived Data Synchronization (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
