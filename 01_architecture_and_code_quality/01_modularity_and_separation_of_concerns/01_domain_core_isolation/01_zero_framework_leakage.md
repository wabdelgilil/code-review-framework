# [CHK-ARCH-0101] Zero Framework Leakage in Core
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../../README.md) > [Modularity & Separation of Concerns (Level 2)](../../README.md) > [Domain Core Isolation (Level 3)](../README.md) > **CHK-ARCH-0101 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-ARCH-0101` |
| **Sub-Pillar & Category** | Modularity & Separation of Concerns / Domain Core Isolation |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | ISO/IEC 25010 (Modularity & Replaceability); Clean Architecture (Robert C. Martin); Hexagonal Ports & Adapters (Alistair Cockburn) |
| **Target Entities** | Pure business models, calculation engines, domain state machines, domain value objects |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Core domain entities, business calculations, and internal state logic must have **zero imports, annotations, or runtime inheritance** coupling them to external frameworks, UI toolkits, ORM mappers, web servers, CLI parsers, or database drivers.
* **Engineering Rationale:** When domain rules depend directly on external libraries or frameworks (e.g., mixing HTTP request objects or SQL annotations inside business calculations), the software cannot be tested in isolation, framework upgrades cause breaking domain bugs, and porting the core logic to another execution environment requires rewriting business rules.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Framework Import Count in Domain:** Strictly `0` third-party framework packages imported into any core domain file.
* **Permitted Imports in Core:**
  * Language standard library primitives (e.g., mathematical functions, standard collections, pure typing/interfaces).
  * In-house pure domain abstractions.
* **Taint Metric:** Any domain file referencing external I/O packages triggers a `CRITICAL` audit failure.

---

### 4. Step-by-Step Verification Protocol
1. **Automated Import Scanning:**
   * Run an Abstract Syntax Tree (AST) or static dependency analysis tool on the designated core/domain packages.
   * Verify that imported module names match an allowlist of pure standard library modules.
   * Command example (AST grep / import analysis):
     ```bash
     # Example: Scanning domain directory for prohibited web/database framework imports
     grep -rEn "^(import|from) (flask|django|fastapi|express|sqlalchemy|flutter|react)" src/domain/
     ```
2. **Type Hierarchy Inspection:**
   * Inspect all domain model base classes. Confirm no domain model inherits from an external framework base class (e.g., `Model`, `Controller`, `BaseObservable`).
3. **Hermetic Compilation Check:**
   * Compile or run unit test suites for the domain package in an environment where framework dependencies are completely uninstalled or removed from the classpath/virtualenv. The domain package must compile and test with zero missing module errors.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** The core domain modules compile and execute entirely on pure standard library primitives. Zero framework annotations or imports exist.
* **`FAIL`:** Any core domain module contains imports of web/CLI/database libraries, uses framework-specific decorators or base classes, or fails to compile in an environment stripped of external frameworks.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Framework Leaked into Core)
```python
# Prohibited: Domain entity inherits from ORM model and imports web HTTP status
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base
from fastapi import HTTPException

Base = declarative_base()

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True)
    total_amount = Column(Integer)

    def apply_discount(self, percent: float):
        if percent < 0 or percent > 100:
            # Domain logic leaking HTTP-specific concepts
            raise HTTPException(status_code=400, detail="Invalid discount rate")
        self.total_amount -= int(self.total_amount * (percent / 100))
```

#### ✅ Compliant Canonical Pattern (Pure Domain Isolation)
```python
# Compliant: Pure in-memory domain entity with zero external framework dependencies
from dataclasses import dataclass
from typing import Self

class InvalidDiscountRateError(ValueError):
    """Domain-specific exception decoupled from presentation layer."""
    pass

@dataclass(frozen=True)
class Order:
    order_id: str
    total_amount: int

    def apply_discount(self, percent: float) -> Self:
        if not (0.0 <= percent <= 100.0):
            raise InvalidDiscountRateError(f"Discount {percent}% must be between 0 and 100")
        discount_value = int(self.total_amount * (percent / 100.0))
        return Order(
            order_id=self.order_id,
            total_amount=self.total_amount - discount_value
        )
```

---
[⬅️ Back to Domain Core Isolation (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
