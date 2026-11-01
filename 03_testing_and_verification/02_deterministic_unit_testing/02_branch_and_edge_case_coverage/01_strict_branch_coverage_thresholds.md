# [CHK-TEST-0203] Strict Branch Coverage Thresholds
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-TEST] Testing & Verification Suite (Level 1)](../../../README.md) > [Deterministic Unit Testing (Level 2)](../../README.md) > [Branch & Edge-Case Coverage (Level 3)](../README.md) > **CHK-TEST-0203 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-TEST-0203` |
| **Sub-Pillar & Category** | Deterministic Unit Testing / Branch & Edge-Case Coverage |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | ISO/IEC/IEEE 29119-4 (Branch/Decision Coverage); DO-178C (MC/DC Concepts) |
| **Target Entities** | Core domain modules, algorithmic calculations, conditional decision trees |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Core business logic and algorithmic modules must satisfy a minimum **Branch Coverage threshold of $\ge 90\%$** (with overall line coverage $\ge 95\%$). Simple statement/line coverage is insufficient: every decision path (both `True` and `False` branches) must be executed by automated tests.
* **Engineering Rationale:** Line coverage is notoriously misleading: a single line of code can contain multiple ternary operators or boolean predicates where only the happy path is ever executed, leaving error paths and edge cases completely untested.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Core Domain Branch Coverage:** $\ge 90.0\%$.
* **Overall Codebase Line Coverage:** $\ge 85.0\%$.
* **CI Enforcement Gate:** Any PR dropping branch coverage below the defined threshold fails the build automatically.

---

### 4. Step-by-Step Verification Protocol
1. **Branch Coverage Measurement:**
   * Run the test suite with branch coverage instrumentation enabled:
     ```bash
     # Example for Python pytest
     pytest --cov=src/domain --cov-branch --cov-report=term-missing --cov-fail-under=90
     ```
2. **Missing Branch Identification:**
   * Review missed branch numbers in the report and add targeted test assertions to cover alternate conditions.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Branch coverage on core domain logic satisfies $\ge 90.0\%$, with all boolean branches tested.
* **`FAIL`:** Branch coverage falls below 90.0%, or tests measure only statement coverage while leaving error branches unexecuted.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (High Line Coverage but 50% Branch Coverage)
```python
# Code has 100% line coverage if tested with amount = 150, but FALSE branch is never tested!
def apply_surcharge(amount: float) -> float:
    rate = 0.05 if amount > 100.0 else 0.01  # False branch (amount <= 100) unexercised!
    return amount * (1.0 + rate)
```

#### ✅ Compliant Canonical Pattern (Exhaustive Branch Test Suite)
```python
# Compliant: Tests explicitly exercise both branches of the conditional decision
import pytest

@pytest.mark.parametrize("amount, expected_rate", [
    (150.0, 0.05),  # True branch (amount > 100.0)
    (100.0, 0.01),  # Boundary boundary condition (amount == 100.0 -> False branch)
    (50.0, 0.01),   # False branch (amount < 100.0)
])
def test_apply_surcharge_all_branches(amount, expected_rate):
    expected_total = amount * (1.0 + expected_rate)
    assert apply_surcharge(amount) == pytest.approx(expected_total)
```

---
[⬅️ Back to Branch & Edge-Case Coverage (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
