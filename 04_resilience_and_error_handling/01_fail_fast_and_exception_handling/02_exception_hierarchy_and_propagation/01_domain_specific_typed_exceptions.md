# [CHK-RES-0103] Domain-Specific Typed Exception Hierarchy
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-RES] Resilience, Error Handling & Security (Level 1)](../../../README.md) > [Fail-Fast & Exception Handling (Level 2)](../../README.md) > [Exception Hierarchy & Propagation (Level 3)](../README.md) > **CHK-RES-0103 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-RES-0103` |
| **Sub-Pillar & Category** | Fail-Fast & Exception Handling / Exception Hierarchy & Propagation |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Clean Code Chapter 7; Effective Java (Exceptions); ISO/IEC 25010 (Maintainability & Analyzability) |
| **Target Entities** | Application exceptions, error types, error dispatchers |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** The application must define an explicit **Domain Exception Hierarchy** inheriting from a common base application exception (e.g. `AppDomainError`). Domain logic must raise strongly-typed exceptions (e.g. `InsufficientInventoryError`, `InvalidContractStateError`), never generic raw language exceptions (`raise Exception("msg")` or `throw "error"`).
* **Engineering Rationale:** Raising generic language exceptions forces callers to either catch broad `Exception` (risking catching system panics or memory errors) or parse error message strings with regex, which is fragile and breaks whenever wording is edited.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Generic Exception Throws (`raise Exception`, `throw new Error`):** Strictly `0` in production business logic.
* **Base Root Exception:** `100%` of custom application exceptions must inherit from the project's root domain error class.

---

### 4. Step-by-Step Verification Protocol
1. **Static AST Scan for Generic Throws:**
   * Scan for bare `raise Exception(` or `throw new Error(` in domain packages:
     ```bash
     grep -rEn "raise Exception\(" src/domain/
     ```
   * Confirm zero matches.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All raised business errors are strongly typed domain exceptions inheriting from a common application root error.
* **`FAIL`:** The codebase raises generic `Exception` / `Error` instances or throws raw strings directly.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Raising Generic Untyped Exception)
```python
# Prohibited: Raising generic Exception with error string
def withdraw(account, amount):
    if amount > account.balance:
        # Callers cannot catch this specific error cleanly without catching ALL exceptions!
        raise Exception("Balance exceeded")
```

#### ✅ Compliant Canonical Pattern (Structured Typed Exception Hierarchy)
```python
# Compliant: Clear typed exception hierarchy
class AppError(Exception):
    """Root application error for all domain exceptions."""
    pass

class InsufficientFundsError(AppError):
    """Raised when account balance is less than required withdrawal amount."""
    def __init__(self, account_id: str, balance_cents: int, requested_cents: int):
        self.account_id = account_id
        self.balance_cents = balance_cents
        self.requested_cents = requested_cents
        super().__init__(
            f"Account {account_id} cannot debit {requested_cents} cents; balance is {balance_cents} cents"
        )
```

---
[⬅️ Back to Exception Hierarchy & Propagation (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
