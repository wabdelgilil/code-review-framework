# [CHK-DOM-0301] Canonical State Ownership
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-DOM] Domain Logic & Specifications (Level 1)](../../../README.md) > [Single Source of Truth (Level 2)](../../README.md) > [State Authority & Canonical Models (Level 3)](../README.md) > **CHK-DOM-0301 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-DOM-0301` |
| **Sub-Pillar & Category** | Single Source of Truth / State Authority & Canonical Models |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Single Source of Truth (SSOT); Domain-Driven Design (Aggregates & Entities); ISO/IEC 25010 (Data Integrity) |
| **Target Entities** | Aggregate roots, entity state managers, session stores, configuration registries |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Each distinct piece of domain state or configuration must have **exactly one authoritative canonical source of truth**. Secondary representations, projections, view models, or caches must be strictly read-only and derived from the canonical entity.
* **Engineering Rationale:** Having duplicate sources of truth (e.g. keeping user status in both a session object and a profile object) inevitably causes desynchronization bugs where parts of the application operate on stale or conflicting states.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Authoritative Owners per State Field:** Exactly `1` owner.
* **Secondary Mutable State References:** Strictly `0`. Secondary caches or view models must not expose write/mutation methods.

---

### 4. Step-by-Step Verification Protocol
1. **Entity Ownership Mapping:**
   * Identify all stateful entities. Verify that each field has an unambiguous primary owner (Aggregate Root).
2. **Mutation Path Audit:**
   * Confirm that mutations cannot bypass the authoritative owner (e.g. modifying a projection does not corrupt primary state).

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Every state field has a single canonical owner, and secondary representations are read-only projections.
* **`FAIL`:** Multiple independent state instances maintain redundant, independently mutable copies of the same business data.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Dual Divergent State Representations)
```python
# Prohibited: Status stored and mutated in two independent places
class UserSession:
    def __init__(self, user_id: str, status: str):
        self.user_id = user_id
        self.status = status  # Duplicate copy!

class UserProfile:
    def __init__(self, user_id: str, status: str):
        self.user_id = user_id
        self.status = status  # Duplicate copy!
        # Mutating status here leaves UserSession stale and desynchronized!
```

#### ✅ Compliant Canonical Pattern (Single Canonical Entity with Read-Only Projection)
```python
# Compliant: Sole authoritative entity; secondary representations read from it
from dataclasses import dataclass

@dataclass
class UserAccount:
    """Canonical single source of truth for user state."""
    user_id: str
    is_active: bool

    def deactivate(self) -> None:
        self.is_active = False

@dataclass(frozen=True)
class UserSessionView:
    """Read-only view model projected directly from canonical state."""
    user_id: str
    is_active: bool

    @classmethod
    def from_account(cls, account: UserAccount) -> "UserSessionView":
        return cls(user_id=account.user_id, is_active=account.is_active)
```

---
[⬅️ Back to State Authority & Canonical Models (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
