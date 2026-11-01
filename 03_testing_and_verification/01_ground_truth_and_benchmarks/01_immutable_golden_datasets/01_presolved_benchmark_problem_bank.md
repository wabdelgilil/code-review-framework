# [CHK-TEST-0101] Pre-Solved Benchmark Problem Bank
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-TEST] Testing & Verification Suite (Level 1)](../../../README.md) > [Ground Truth & Benchmark Datasets (Level 2)](../../README.md) > [Immutable Golden Datasets (Level 3)](../README.md) > **CHK-TEST-0101 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-TEST-0101` |
| **Sub-Pillar & Category** | Ground Truth & Benchmark Datasets / Immutable Golden Datasets |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | ISO/IEC/IEEE 29119-4 (Specification-Based Testing); Golden Master Testing Pattern |
| **Target Entities** | Analytical test suites, benchmark data fixtures, ground truth reference banks |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** The verification suite must contain a dedicated, curated **Bank of Pre-Solved Benchmark Reference Problems** whose expected outputs were calculated and verified independently of the current codebase (e.g. from academic publications, textbook analytical solutions, or certified reference tools).
* **Engineering Rationale:** When tests are written by calculating expected results using the software itself or by developers with confirmation bias, bugs in the algorithm become codified into the test assertions, creating counterfeit tests that validate incorrect math.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Pre-Solved Reference Problems:** Minimum `3` independent analytical reference problems per core calculation engine.
* **External Provenance Citation:** `100%` of reference datasets must document their external source (e.g., standard appendix, published reference dataset).

---

### 4. Step-by-Step Verification Protocol
1. **Provenance Inspection:**
   * Review benchmark test fixtures. Confirm each fixture cites the independent source from which its inputs and expected outputs were derived.
2. **Independent Calculation Validation:**
   * Verify that expected outputs in the reference fixture are hardcoded constants, not generated dynamically by calling project helper functions.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Benchmark test cases validate against pre-solved reference problems with documented external provenance.
* **`FAIL`:** Test expected outputs are computed dynamically using functions from the project under test or lack independent validation sources.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Tautological Self-Validating Test)
```python
# Prohibited: Expected output computed using the very function under test!
def test_heat_transfer():
    inputs = 25.0
    # Tautology: If calculate_heat has a bug, the test still passes!
    expected = calculate_heat(inputs)
    assert calculate_heat(inputs) == expected
```

#### ✅ Compliant Canonical Pattern (Independently Solved Reference Benchmark)
```python
# Compliant: Independently published analytical solution used as frozen expected value
import pytest

# Source: Incropera & DeWitt, Fundamentals of Heat and Mass Transfer, Example 3.1
REFERENCE_PROBLEM_3_1 = {
    "wall_thickness_m": 0.15,
    "thermal_conductivity_w_m_k": 1.4,
    "inner_surface_temp_c": 1400.0,
    "outer_surface_temp_c": 1150.0,
    "expected_heat_flux_w_m2": 2333.33,  # Analytically solved in reference text
}

def test_steady_state_conduction_benchmark():
    flux = calculate_one_dimensional_conduction(
        thickness_m=REFERENCE_PROBLEM_3_1["wall_thickness_m"],
        conductivity=REFERENCE_PROBLEM_3_1["thermal_conductivity_w_m_k"],
        temp_inside=REFERENCE_PROBLEM_3_1["inner_surface_temp_c"],
        temp_outside=REFERENCE_PROBLEM_3_1["outer_surface_temp_c"],
    )
    assert flux == pytest.approx(REFERENCE_PROBLEM_3_1["expected_heat_flux_w_m2"], rel=1e-4)
```

---
[⬅️ Back to Immutable Golden Datasets (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
