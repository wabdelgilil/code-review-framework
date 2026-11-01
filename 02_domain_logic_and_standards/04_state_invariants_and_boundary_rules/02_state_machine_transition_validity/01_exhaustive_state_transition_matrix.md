# [CHK-DOM-0403] Exhaustive State Transition Matrix
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-DOM] Domain Logic & Specifications (Level 1)](../../../README.md) > [State Invariants & Boundary Rules (Level 2)](../../README.md) > [State Machine Transition Validity (Level 3)](../README.md) > **CHK-DOM-0403 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-DOM-0403` |
| **Sub-Pillar & Category** | State Invariants & Boundary Rules / State Machine Transition Validity |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Formal Finite State Automata (FSM) Theory; ISO/IEC 25010 (Fault Tolerance & Reliability) |
| **Target Entities** | Order lifecycles, workflow engines, connection states, subscription states |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Any entity that progresses through lifecycle states (e.g. `Draft` $\rightarrow$ `Pending` $\rightarrow$ `Approved` $\rightarrow$ `Archived`) must be governed by an **explicit, exhaustive state transition matrix**. Any attempted transition not explicitly registered in the matrix must be rejected immediately with an `IllegalStateTransitionError`.
* **Engineering Rationale:** Permitting arbitrary state jumps (such as jumping directly from `Archived` to `Approved` or re-opening a finalized invoice) bypasses business validation, creates orphaned child data, and exposes workflows to serious logical bypass vulnerabilities.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Undefined Transition Allowance:** Strictly `0` unhandled or implicit state transitions.
* **Transition Determinism:** Given state $S_1$ and event $E$, the next state $S_2$ must be deterministically defined or explicitly prohibited.

---

### 4. Step-by-Step Verification Protocol
1. **Transition Table Audit:**
   * Locate the state machine or lifecycle definition.
   * Verify an explicit lookup table or enum transition graph defines permissible source $\rightarrow$ target pairs.
2. **Invalid State Transition Test:**
   * Execute unit tests attempting all invalid transitions in the Cartesian product of states; verify 100% of invalid attempts raise `IllegalStateTransitionError`.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Entity state transitions follow an explicit table; illegal transitions are strictly rejected with typed exceptions.
* **`FAIL`:** States can be set arbitrarily via direct assignment, bypassing transition validation rules.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Arbitrary State Assignment)
```python
# Prohibited: Direct state assignment allows illegal transitions
class Order:
    def __init__(self):
        self.status = "DRAFT"

    def set_status(self, new_status: str):
        # Allows transitioning from "CANCELLED" back to "SHIPPED"!
        self.status = new_status
```

#### ✅ Compliant Canonical Pattern (Exhaustive FSM Transition Graph)
```python
# Compliant: Explicit transition matrix with illegal state exception
class IllegalStateTransitionError(Exception):
    pass

class OrderState:
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    APPROVED = "APPROVED"
    CANCELLED = "CANCELLED"

VALID_TRANSITIONS: dict[str, set[str]] = {
    OrderState.DRAFT: {OrderState.SUBMITTED, OrderState.CANCELLED},
    OrderState.SUBMITTED: {OrderState.APPROVED, OrderState.CANCELLED},
    OrderState.APPROVED: {OrderState.CANCELLED},
    OrderState.CANCELLED: set(),  # Terminal state: zero outgoing transitions allowed
}

class Order:
    def __init__(self):
        self._status = OrderState.DRAFT

    @property
    def status(self) -> str:
        return self._status

    def transition_to(self, target_state: str) -> None:
        """Enforces exhaustive state transition matrix."""
        allowed_targets = VALID_TRANSITIONS.get(self._status, set())
        if target_state not in allowed_targets:
            raise IllegalStateTransitionError(
                f"Cannot transition order from {self._status} to {target_state}. "
                f"Allowed targets: {allowed_targets or 'None (Terminal state)'}"
            )
        self._status = target_state
```

---
[⬅️ Back to State Machine Transition Validity (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
