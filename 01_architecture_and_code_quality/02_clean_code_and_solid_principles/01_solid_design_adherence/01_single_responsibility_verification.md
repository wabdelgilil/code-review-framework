# [CHK-ARCH-0201] Single Responsibility Principle (SRP) Verification
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../../README.md) > [Clean Code & SOLID Principles (Level 2)](../../README.md) > [SOLID Design Adherence (Level 3)](../README.md) > **CHK-ARCH-0201 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-ARCH-0201` |
| **Sub-Pillar & Category** | Clean Code & SOLID Principles / SOLID Design Adherence |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Single Responsibility Principle (Robert C. Martin); ISO/IEC 25010 (Modifiability & Analyzability) |
| **Target Entities** | Classes, modules, domain services, utilities |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Every class, module, and function must have **one, and only one, reason to change**. A class must encapsulate a single cohesive responsibility and must not combine unrelated concerns (such as combining mathematical calculations, database serialization, and PDF generation into one class).
* **Engineering Rationale:** Classes with multiple responsibilities suffer from frequent merge conflicts, subtle regressions when modifying one concern, high cognitive load for maintainers, and poor testability.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Lack of Cohesion of Methods (LCOM4):** LCOM4 score must equal `1`. An LCOM4 score $> 1$ indicates disjoint responsibilities that should be split into multiple classes.
* **Actor Coupling:** A class must serve only one primary business stakeholder/actor (e.g. Finance, Operations, or Reporting; never all three simultaneously).

---

### 4. Step-by-Step Verification Protocol
1. **LCOM Static Analysis:**
   * Run an object-oriented metrics tool (e.g., `radon`, `sonar`, or language-specific LCOM analyzer) on core services.
   * Flag any class with LCOM4 $> 1$.
2. **Method Responsibility Audit:**
   * Review public methods of the class. If a class contains methods operating on completely different domain concepts or performing presentation and calculation concurrently, flag as a defect.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** The class encapsulates a single, tightly-coupled set of operations with LCOM4 = 1 and serves one clear operational purpose.
* **`FAIL`:** The class exhibits multiple distinct responsibilities (e.g., performs business logic and serializes to disk and formats HTML), or has an LCOM4 score $> 1$.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern ("God Class" with Multiple Responsibilities)
```python
# Prohibited: Single class handles calculation, persistence, and formatting
class PayrollEngine:
    def calculate_net_pay(self, gross: float, tax_rate: float) -> float:
        return gross * (1 - tax_rate)

    def save_to_database(self, employee_id: str, net_pay: float):
        # Database responsibility leaked into calculation class!
        pass

    def export_pdf_paystub(self, employee_id: str) -> bytes:
        # Presentation responsibility leaked into calculation class!
        pass
```

#### ✅ Compliant Canonical Pattern (Segregated Single Responsibilities)
```python
# Compliant: Each class has exactly one reason to change

class PayrollCalculator:
    """Pure calculation responsibility."""
    def calculate_net_pay(self, gross: float, tax_rate: float) -> float:
        if not (0.0 <= tax_rate <= 1.0):
            raise ValueError(f"Tax rate must be between 0 and 1: got {tax_rate}")
        return gross * (1.0 - tax_rate)

class PayrollRepository:
    """Persistence responsibility."""
    def save_payroll_record(self, employee_id: str, net_pay: float) -> None:
        pass

class PaystubPdfGenerator:
    """Document rendering responsibility."""
    def generate_pdf(self, employee_id: str, net_pay: float) -> bytes:
        return b"%PDF-1.4 ..."
```

---
[⬅️ Back to SOLID Design Adherence (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
