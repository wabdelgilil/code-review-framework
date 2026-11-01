# [CHK-TEST-0204] Exhaustive Boundary Value Testing
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-TEST] Testing & Verification Suite (Level 1)](../../../README.md) > [Deterministic Unit Testing (Level 2)](../../README.md) > [Branch & Edge-Case Coverage (Level 3)](../README.md) > **CHK-TEST-0204 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-TEST-0204` |
| **Sub-Pillar & Category** | Deterministic Unit Testing / Branch & Edge-Case Coverage |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | ISO/IEC/IEEE 29119-4 (Boundary Value Analysis); Glenford Myers (The Art of Software Testing) |
| **Target Entities** | Input validation routines, range clamps, loop bounds, pagination windows |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Every numerical, temporal, or collection boundary must be verified using formal **Boundary Value Analysis (BVA)**. For any interval $[A, B]$, tests must assert behavior at: $A-1$ (invalid low), $A$ (boundary min), nominal midrange, $B$ (boundary max), and $B+1$ (invalid high), plus zero, empty collection, and null/none.
* **Engineering Rationale:** An overwhelming majority of software defects (off-by-one errors, loop indexing bugs, buffer overflows) occur at the precise boundaries of input domains, rather than in the center of the range.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Boundary Vector Density:** Minimum 5 test assertions per constrained input variable ($min-1, min, mid, max, max+1$).
* **Off-by-One Immunity:** Zero occurrences of `<` vs `<=` boundary leaks.

---

### 4. Step-by-Step Verification Protocol
1. **Constraint Boundary Identification:**
   * Review range validations in the code (e.g. `1 <= month <= 12`, `0 <= percentage <= 100`).
2. **Boundary Test Matrix Check:**
   * Verify that unit tests explicitly test both the exact boundary limits and the first invalid value outside the boundary.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All numerical and collection limits have explicit test cases verifying boundary values and off-by-one rejections.
* **`FAIL`:** Tests only verify comfortable midrange values (e.g. testing percentage only with `50.0`) without exercising boundary limits ($0.0, 100.0, -0.01, 100.01$).

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Only Mid-Range Nominal Tested)
```python
# Prohibited: Only comfortable midrange tested; off-by-one errors undetected
def test_discount_rate():
    # Only tests 10% - does not verify whether 0% or 100% or 101% work or crash!
    assert calculate_discount(100.0, 10.0) == 90.0
```

#### ✅ Compliant Canonical Pattern (Full 5-Point Boundary Value Analysis)
```python
# Compliant: Full BVA matrix covering boundaries and off-by-one rejections
import pytest

@pytest.mark.parametrize("rate, is_valid", [
    (-0.01, False),  # min - 1 (Invalid low)
    (0.00, True),    # min (Exact boundary)
    (50.00, True),   # mid (Nominal)
    (100.00, True),  # max (Exact boundary)
    (100.01, False), # max + 1 (Invalid high)
])
def test_discount_rate_boundary_matrix(rate, is_valid):
    if is_valid:
        assert calculate_discount(100.0, rate) is not None
    else:
        with pytest.raises(ValueError):
            calculate_discount(100.0, rate)
```

---
[⬅️ Back to Branch & Edge-Case Coverage (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
