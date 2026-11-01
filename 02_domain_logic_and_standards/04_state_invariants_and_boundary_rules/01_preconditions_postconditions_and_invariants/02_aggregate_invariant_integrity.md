# [CHK-DOM-0402] Class & Aggregate Invariant Integrity
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-DOM] Domain Logic & Specifications (Level 1)](../../../README.md) > [State Invariants & Boundary Rules (Level 2)](../../README.md) > [Preconditions, Postconditions & Invariants (Level 3)](../README.md) > **CHK-DOM-0402 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-DOM-0402` |
| **Sub-Pillar & Category** | State Invariants & Boundary Rules / Preconditions, Postconditions & Invariants |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Domain-Driven Design (Aggregate Invariants); Bertrand Meyer (Class Invariants) |
| **Target Entities** | Aggregate roots, entity models, value objects, transactional boundaries |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Domain entities and Aggregate Roots must **never enter, exist in, or persist an invalid internal state**. All business invariants (e.g. `sum(order_items) == order_total`, `end_date >= start_date`) must be satisfied at object creation and maintained across every state transition.
* **Engineering Rationale:** If objects can be instantiated in an incomplete or corrupt state (such as via an empty constructor followed by separate setters), client code can easily forget to initialize critical fields, creating silent invariant breaches.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Invalid Object Window:** Strictly `0` seconds. An entity must be valid immediately upon instantiation (Self-Validating Entity).
* **Direct Field Mutation Exposure:** Public mutable attributes on aggregate roots must be `0`; all mutations must occur through invariant-enforcing methods.

---

### 4. Step-by-Step Verification Protocol
1. **Constructor Integrity Check:**
   * Review class constructors. Confirm that the constructor enforces all required fields and invariants immediately upon creation.
2. **Encapsulation Audit:**
   * Verify that entity collections cannot be mutated from outside without going through the aggregate root (e.g. returning immutable or copied lists).

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Entities protect their invariants internally and cannot be created or placed into an illegal domain state.
* **`FAIL`:** Entities permit public modification of internal fields without invariant checks or allow instantiation of invalid objects.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Unprotected Invariants with Public Setters)
```python
# Prohibited: Anemic model with zero invariant enforcement
class TimeInterval:
    def __init__(self):
        self.start_timestamp = 0
        self.end_timestamp = 0
        # Client can set end_timestamp < start_timestamp, creating invalid state!
```

#### ✅ Compliant Canonical Pattern (Self-Validating Aggregate with Enforced Invariants)
```python
# Compliant: Invariants enforced in constructor and on all mutations
from dataclasses import dataclass

@dataclass(frozen=True)
class TimeInterval:
    start_timestamp: int
    end_timestamp: int

    def __post_init__(self):
        if self.start_timestamp < 0:
            raise ValueError(f"start_timestamp cannot be negative: {self.start_timestamp}")
        if self.end_timestamp < self.start_timestamp:
            raise ValueError(
                f"Invariant violation: end_timestamp ({self.end_timestamp}) "
                f"must be >= start_timestamp ({self.start_timestamp})"
            )
```

---
[⬅️ Back to Preconditions, Postconditions & Invariants (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
