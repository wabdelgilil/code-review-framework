# [CHK-ARCH-0202] Open/Closed Principle (OCP) Extensibility
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../../README.md) > [Clean Code & SOLID Principles (Level 2)](../../README.md) > [SOLID Design Adherence (Level 3)](../README.md) > **CHK-ARCH-0202 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-ARCH-0202` |
| **Sub-Pillar & Category** | Clean Code & SOLID Principles / SOLID Design Adherence |
| **Classification** | **`[BEST PRACTICE]`** |
| **Governing Standard** | Open/Closed Principle (Bertrand Meyer / Robert C. Martin); ISO/IEC 25010 (Extensibility & Modifiability) |
| **Target Entities** | Strategy selectors, calculation dispatchers, format converters, rule engines |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Modules and algorithms must be **open for extension, but closed for modification**. Adding a new algorithmic variation, export format, or business rule must be achievable by introducing a new implementation class or strategy, without modifying or monkey-patching existing, audited core code.
* **Engineering Rationale:** Modifying existing battle-tested code to add new behavior risks introducing regressions into previously working paths. Polymorphism, composition, or strategy registries allow seamless extension with zero regression risk to existing code.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Switch/If-Else Branch Growth:** Core dispatchers must not contain cascading `if-elif-else` or `switch` statements over extensible types that require adding a branch every time a new type is supported.
* **Extensibility Hook:** Addition of a new strategy must require touching `0` lines in core calculation classes.

---

### 4. Step-by-Step Verification Protocol
1. **Dispatcher Inspection:**
   * Review dispatch routines. Verify whether extending the system with a new type requires altering the dispatcher's source code or simply registering a new implementation.
2. **Regression Boundary Check:**
   * Simulate adding a new calculation strategy. Confirm that existing unit tests for prior strategies pass unmodified without changes to existing classes.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** New capabilities can be registered dynamically or composed via polymorphism without altering core dispatch logic.
* **`FAIL`:** Core code relies on hardcoded conditionals checking type strings or enums, requiring edits to the core file whenever a new type is added.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Hardcoded Cascading Conditionals)
```python
# Prohibited: Adding a new tax calculation requires modifying this audited function
def calculate_tax(order_type: str, amount: float) -> float:
    if order_type == "standard":
        return amount * 0.15
    elif order_type == "luxury":
        return amount * 0.25
    elif order_type == "essential":
        return 0.0
    # Every new order type forces modifying this file and re-verifying all branches!
    raise ValueError(f"Unknown order type: {order_type}")
```

#### ✅ Compliant Canonical Pattern (Strategy Registry Pattern)
```python
# Compliant: Extensible strategy registry - closed for modification, open for extension
from typing import Protocol, Callable

class TaxCalculationStrategy(Protocol):
    def calculate(self, amount: float) -> float: ...

class TaxStrategyRegistry:
    def __init__(self):
        self._strategies: dict[str, TaxCalculationStrategy] = {}

    def register(self, order_type: str, strategy: TaxCalculationStrategy) -> None:
        """New tax rules are registered without modifying existing code."""
        self._strategies[order_type] = strategy

    def calculate(self, order_type: str, amount: float) -> float:
        strategy = self._strategies.get(order_type)
        if not strategy:
            raise KeyError(f"No tax strategy registered for {order_type}")
        return strategy.calculate(amount)
```

---
[⬅️ Back to SOLID Design Adherence (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
