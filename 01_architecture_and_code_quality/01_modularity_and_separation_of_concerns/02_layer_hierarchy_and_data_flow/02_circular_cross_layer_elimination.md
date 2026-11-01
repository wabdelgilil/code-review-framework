# [CHK-ARCH-0104] Elimination of Circular Cross-Layer Flows
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../../README.md) > [Modularity & Separation of Concerns (Level 2)](../../README.md) > [Layer Hierarchy & Data Flow (Level 3)](../README.md) > **CHK-ARCH-0104 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-ARCH-0104` |
| **Sub-Pillar & Category** | Modularity & Separation of Concerns / Layer Hierarchy & Data Flow |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Acyclic Dependencies Principle (ADP); ISO/IEC 25010 (Analyzability & Modularity) |
| **Target Entities** | All modules, packages, services, and class definitions |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** The dependency structure among modules and packages must form a **strict Directed Acyclic Graph (DAG)**. Direct or indirect cyclic dependencies (Module A imports Module B which imports Module A) are strictly prohibited.
* **Engineering Rationale:** Circular dependencies create tight coupling, prevent separate compilation, lead to unpredictable module initialization order bugs, and force developers to understand the entire cycle simultaneously rather than in isolation.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Cycle Count in Module Graph:** Strictly `0` detected cycles.
* **Graph Topological Sortability:** The module import graph must resolve to a valid topological sort without cycle errors.

---

### 4. Step-by-Step Verification Protocol
1. **Cycle Detection Tooling:**
   * Run an automated cyclic dependency detector across the codebase.
   * Example tool execution (Python / TypeScript / General):
     ```bash
     # Example using madge (for JS/TS) or pydeps/pytest-deadfixtures (for Python)
     # Cycle detection must return exit code 0 and empty cycle array
     madge --circular src/
     ```
2. **Dynamic Import Inspection:**
   * Verify that circular imports are not being hidden or postponed via deferred in-function imports (e.g. `import X` placed inside a function body solely to avoid runtime `ImportError`).

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Static dependency analysis confirms 0 circular dependencies across all modules and submodules.
* **`FAIL`:** Any circular import cycle is detected between two or more files, or in-function imports are used to circumvent top-level circular dependency errors.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Circular Dependency Cycle)
```python
# File: models/invoice.py
from models.customer import Customer  # Invoice -> Customer

class Invoice:
    def __init__(self, customer: Customer, amount: float):
        self.customer = customer
        self.amount = amount

# File: models/customer.py
from models.invoice import Invoice  # Customer -> Invoice (CIRCULAR CYCLE!)

class Customer:
    def __init__(self, name: str):
        self.name = name
        self.invoices: list[Invoice] = []
```

#### ✅ Compliant Canonical Pattern (Acyclic Inversion via ID or Interface)
```python
# Compliant: Decoupled via immutable identifier or dedicated relationship repository

# File: models/customer.py
from dataclasses import dataclass

@dataclass(frozen=True)
class Customer:
    customer_id: str
    name: str

# File: models/invoice.py
from dataclasses import dataclass

@dataclass(frozen=True)
class Invoice:
    invoice_id: str
    customer_id: str  # References Customer by identifier, breaking physical import cycle
    amount: float
```

---
[⬅️ Back to Layer Hierarchy & Data Flow (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
