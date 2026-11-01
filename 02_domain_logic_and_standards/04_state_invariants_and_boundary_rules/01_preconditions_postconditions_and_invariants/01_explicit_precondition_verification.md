# [CHK-DOM-0401] Explicit Precondition Verification
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-DOM] Domain Logic & Specifications (Level 1)](../../../README.md) > [State Invariants & Boundary Rules (Level 2)](../../README.md) > [Preconditions, Postconditions & Invariants (Level 3)](../README.md) > **CHK-DOM-0401 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-DOM-0401` |
| **Sub-Pillar & Category** | State Invariants & Boundary Rules / Preconditions, Postconditions & Invariants |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Bertrand Meyer: Design by Contract (DbC); ISO/IEC 25010 (Fault Tolerance & Reliability) |
| **Target Entities** | Public class methods, API entry points, domain service routines |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Public methods in domain services and entities must explicitly **validate all preconditions at the method entry boundary before performing any business logic or state mutation**. If any precondition is breached, the method must reject execution immediately with a descriptive exception.
* **Engineering Rationale:** Allowing operations to proceed with invalid arguments causes silent data corruption deep inside nested loops or database transactions, making root-cause debugging difficult and leaving partial, invalid mutations behind.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Unguarded Public Mutators:** Strictly `0`. Every public method modifying state must guard its arguments.
* **Failure Bailout Timing:** Precondition validation must happen on the first line(s) of the method before any external I/O or state assignment.

---

### 4. Step-by-Step Verification Protocol
1. **Precondition Audit:**
   * Review all public mutating methods in domain entities.
   * Verify that null checks, range bounds, and business prerequisites are asserted at the top of the routine.
2. **Adversarial Input Fuzzing:**
   * Call the method with nulls, empty strings, negative numbers, and out-of-range dates; verify immediate, clean rejection.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All public domain operations assert and validate preconditions upfront prior to mutating state.
* **`FAIL`:** Any domain mutator executes without validating argument validity, allowing invalid data to enter entity state.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Mutating State Before Validation)
```python
# Prohibited: State mutated before validating all inputs
class BankAccount:
    def transfer(self, target_account, amount: float):
        self.balance -= amount  # Mutated before checking target account validity!
        if target_account is None:
            raise ValueError("Target account is null")  # Too late! Balance is already debited!
        target_account.balance += amount
```

#### ✅ Compliant Canonical Pattern (Upfront Precondition Validation)
```python
# Compliant: Design by Contract preconditions checked prior to state mutation
class BankAccount:
    def transfer(self, target_account: "BankAccount", amount_cents: int) -> None:
        """Transfers funds with strict upfront precondition validation."""
        # Preconditions
        if target_account is None:
            raise ValueError("Target account cannot be None")
        if target_account is self:
            raise ValueError("Cannot transfer funds to the same account")
        if amount_cents <= 0:
            raise ValueError(f"Transfer amount must be positive: got {amount_cents}")
        if amount_cents > self.balance_cents:
            raise ValueError(f"Insufficient funds: balance {self.balance_cents} < {amount_cents}")

        # Execution
        self.balance_cents -= amount_cents
        target_account.balance_cents += amount_cents
```

---
[⬅️ Back to Preconditions, Postconditions & Invariants (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
