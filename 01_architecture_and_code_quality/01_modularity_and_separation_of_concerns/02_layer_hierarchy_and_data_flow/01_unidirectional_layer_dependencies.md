# [CHK-ARCH-0103] Unidirectional Layer Dependencies
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../../README.md) > [Modularity & Separation of Concerns (Level 2)](../../README.md) > [Layer Hierarchy & Data Flow (Level 3)](../README.md) > **CHK-ARCH-0103 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-ARCH-0103` |
| **Sub-Pillar & Category** | Modularity & Separation of Concerns / Layer Hierarchy & Data Flow |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | ISO/IEC 25010 (Modularity); The Dependency Rule (Clean Architecture); Layered Pattern Standards |
| **Target Entities** | Application controllers, service orchestrators, domain entities, infrastructure adapters |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Dependencies between architectural layers must point strictly in one direction (inward toward high-level policies): `Presentation/CLI/API` $\rightarrow$ `Application/Orchestration` $\rightarrow$ `Domain/Core`. Low-level layers (Domain) must never import or hold references to high-level outer layers.
* **Engineering Rationale:** Upward or inward-to-outward dependencies create tightly coupled monoliths where changing a user interface or swapping a database requires modifying the core calculation engine. Unidirectional flow guarantees stability and enables independent component evolution.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Reverse Layer Imports:** Strictly `0` instances of lower layers importing from outer/upper layers.
* **Layer Bypass Violations:** Strictly `0` instances where Presentation layer accesses persistence infrastructure directly without passing through application orchestration boundaries.

---

### 4. Step-by-Step Verification Protocol
1. **Architecture Linter Verification:**
   * Configure and run layer-enforcing lint tools (e.g. `dependency-cruiser`, `archunit`, or custom AST dependency checks).
   * Define forbidden dependency edges:
     * `domain` cannot import `application`, `infrastructure`, or `presentation`.
     * `application` cannot import `presentation`.
2. **Import Graph Analysis:**
   * Generate an import dependency matrix across package boundaries.
   * Verify that the adjacency matrix is strictly upper or lower triangular (indicating topological order without back-edges).

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All dependencies flow monotonically from outer concrete layers to inner abstract domain layers. Zero reverse imports detected.
* **`FAIL`:** Any domain or business logic file imports a file from an outer presentation, controller, or infrastructure package.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Reverse Layer Dependency)
```python
# Prohibited: Domain entity importing and calling an outer presentation/CLI module
from app.presentation.cli_formatter import print_error_banner  # Upward dependency!

class Account:
    def debit(self, amount: float):
        if amount > self.balance:
            # Domain layer directly driving outer presentation layer
            print_error_banner(f"Debit failed: balance exceeded")
            return False
        self.balance -= amount
        return True
```

#### ✅ Compliant Canonical Pattern (Clean Inward Dependency Flow)
```python
# Compliant: Domain signals outcome via pure return values or typed exceptions;
# Outer presentation layer observes outcome and formats output.

class InsufficientFundsError(Exception):
    pass

class Account:
    def __init__(self, balance: float):
        self._balance = balance

    def debit(self, amount: float) -> None:
        """Domain layer strictly enforces invariant; completely unaware of presentation."""
        if amount > self._balance:
            raise InsufficientFundsError(f"Cannot debit {amount}; balance is {self._balance}")
        self._balance -= amount
```

---
[⬅️ Back to Layer Hierarchy & Data Flow (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
