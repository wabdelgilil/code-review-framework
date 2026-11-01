# [CHK-TEST-0103] Precision Bounds in Oracle Verification
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-TEST] Testing & Verification Suite (Level 1)](../../../README.md) > [Ground Truth & Benchmark Datasets (Level 2)](../../README.md) > [Oracle Comparison & Precision (Level 3)](../README.md) > **CHK-TEST-0103 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-TEST-0103` |
| **Sub-Pillar & Category** | Ground Truth & Benchmark Datasets / Oracle Comparison & Precision |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Software Test Oracle Problem (Barr et al.); IEEE 754 Arithmetic Precision Standards |
| **Target Entities** | Numerical assertions, black-box oracle tests, scientific simulation outputs |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** When comparing algorithmically computed outputs against external oracles (e.g. certified third-party reference libraries or mathematical models), verification assertions must evaluate relative or absolute errors against **strictly defined numerical tolerance bounds**. Tests must never pass with unexamined delta discrepancies.
* **Engineering Rationale:** Black-box oracles may calculate values using different floating-point algorithms (e.g. Runge-Kutta vs Euler). Asserting exact equality causes false failures, while asserting overly loose bounds (e.g. `abs(a - b) < 10.0`) permits severe mathematical regression bugs to pass undetected.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Maximum Permissible Relative Delta ($\delta_{rel}$):** $\frac{|\text{actual} - \text{expected}|}{|\text{expected}|} \le 1.0 \times 10^{-4}$ (0.01% error limit for physical/engineering calculations, or domain precision bound).
* **Loose Delta Assertion Ban:** Assertions using relative tolerances $> 1.0\%$ trigger an immediate defect.

---

### 4. Step-by-Step Verification Protocol
1. **Assertion Tolerance Audit:**
   * Review all tolerance parameters in test assertions (e.g. `rel=` in `pytest.approx`).
   * Confirm that tolerances are justified by the underlying numerical method's convergence rate.
2. **Oracle Multi-Point Sweep:**
   * Evaluate the oracle comparison across minimum 5 distinct parameter points across the domain operating range.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Computed values match oracle outputs across all test points within documented, rigorous relative tolerances ($\le 10^{-4}$).
* **`FAIL`:** Any test point exceeds permissible tolerance bounds or relies on unjustified, overly loose assertion windows.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Overly Loose or Missing Tolerance)
```python
# Prohibited: Sloppy assertion hides massive mathematical errors
def test_simulation_against_oracle():
    actual = run_simulation(100.0)
    expected_oracle = 450.25
    # Permitting a delta of 50.0 allows completely wrong physics to pass!
    assert abs(actual - expected_oracle) < 50.0
```

#### ✅ Compliant Canonical Pattern (Strict Mathematically Bounded Delta)
```python
# Compliant: Rigorous relative tolerance matched to numerical solver specifications
import pytest

def test_simulation_against_oracle():
    actual = run_simulation(100.0)
    expected_oracle = 450.25
    # Enforces strict 0.01% relative error bound
    assert actual == pytest.approx(expected_oracle, rel=1e-4)
```

---
[⬅️ Back to Oracle Comparison & Precision (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
