# [CHK-DOM-0102] Requirements Traceability Matrix (RTM)
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-DOM] Domain Logic & Specifications (Level 1)](../../../README.md) > [Specification & Standards Compliance (Level 2)](../../README.md) > [Formal Specification Traceability (Level 3)](../README.md) > **CHK-DOM-0102 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-DOM-0102` |
| **Sub-Pillar & Category** | Specification & Standards Compliance / Formal Specification Traceability |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | ISO/IEC/IEEE 29148 (Requirements Traceability); CMMI Level 3 (Verification & Validation) |
| **Target Entities** | System requirements specifications, test suites, module interfaces |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** The project repository must maintain an up-to-date, bidirectional **Requirements Traceability Matrix (RTM)** linking every formal domain specification clause to: (1) the implementing module/function, and (2) the dedicated verification test case.
* **Engineering Rationale:** Without an RTM, requirements get silently dropped during refactorings, or "orphan features" get introduced that have no governing specification or test coverage.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Requirements Traceability Coverage:** `100%` of documented domain requirements must link to $\ge 1$ code implementation and $\ge 1$ automated verification test.
* **Orphan Requirements Count:** Strictly `0` specification clauses without verified automated tests.

---

### 4. Step-by-Step Verification Protocol
1. **RTM Completeness Verification:**
   * Open the project's specification or requirements document.
   * Trace each requirement ID (e.g. `REQ-042`) into the codebase using grep to confirm corresponding test assertions:
     ```bash
     grep -r "REQ-042" tests/
     ```
2. **Reverse Traceability Audit:**
   * Confirm that test files reference their originating specification clause in their test docstrings.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Every specification requirement maps to an explicit code implementation and at least one passing automated test case.
* **`FAIL`:** Any domain requirement lacks automated test coverage, or code features exist without a documented requirement source.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Untraced Domain Tests)
```python
# Prohibited: Test without requirement traceability
def test_calc():
    # What requirement does this test verify? What is the expected behavior standard?
    assert compute(10) == 20
```

#### ✅ Compliant Canonical Pattern (Traceable Specification Test Case)
```python
# Compliant: Explicit requirement ID, specification clause, and expected boundary
import pytest

def test_req_dom_042_thermal_heat_flow_standard_conformance():
    """Validates REQ-DOM-042 (ISO 6946:2017 Clause 6.1.2 - Heat flow verification).
    
    Verifies that steady-state thermal heat flow calculation matches the reference
    benchmark within 0.001% tolerance.
    """
    temperature_delta_k = 25.0
    area_m2 = 10.0
    expected_flow_watts = 81.650  # Pre-calculated standard reference value

    actual_flow = calculate_thermal_heat_flow(temperature_delta_k, area_m2)
    assert actual_flow == pytest.approx(expected_flow_watts, rel=1e-5)
```

---
[⬅️ Back to Formal Specification Traceability (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
