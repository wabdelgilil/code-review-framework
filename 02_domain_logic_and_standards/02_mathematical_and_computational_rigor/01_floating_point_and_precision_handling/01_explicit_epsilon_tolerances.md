# [CHK-DOM-0201] Explicit Epsilon Tolerances for Floating-Point
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-DOM] Domain Logic & Specifications (Level 1)](../../../README.md) > [Mathematical & Computational Rigor (Level 2)](../../README.md) > [Floating-Point & Precision Handling (Level 3)](../README.md) > **CHK-DOM-0201 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-DOM-0201` |
| **Sub-Pillar & Category** | Mathematical & Computational Rigor / Floating-Point & Precision Handling |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | IEEE 754 Standard for Floating-Point Arithmetic; Knuth TAOCP Vol. 2 (Floating-Point Arithmetic) |
| **Target Entities** | Numerical calculations, geometric solvers, convergence algorithms, unit test assertions |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Exact equality comparisons (`==` or `!=`) on floating-point numbers are **strictly prohibited** in business logic and test assertions. All comparisons must evaluate relative or absolute differences within an explicit, documented epsilon bound ($|a - b| \le \epsilon$).
* **Engineering Rationale:** Due to binary representation limitations (IEEE 754), operations such as `0.1 + 0.2` yield `0.30000000000000004`. Comparing floats directly causes flaky tests and catastrophic conditional branch failures depending on CPU microarchitecture or compiler optimization flags.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Direct Float Equality Comparisons:** Strictly `0` instances of `float_a == float_b` or `assert actual == expected` on floats.
* **Standard Epsilon Threshold:**
  * Single-precision (`float32`): $\epsilon \le 1 \times 10^{-5}$
  * Double-precision (`float64`): $\epsilon \le 1 \times 10^{-9}$ (or mathematically justified domain delta).

---

### 4. Step-by-Step Verification Protocol
1. **Static AST Scan for Float Equality:**
   * Scan code for equality operators applied to floating-point types:
     ```bash
     # Static search for direct float assertions or comparisons
     grep -rEn "assert [a-zA-Z0-9_]+ == [0-9]+\.[0-9]+" tests/
     ```
2. **Tolerance Verification:**
   * Verify all float comparisons utilize standard comparison helpers (e.g. `math.isclose()`, `pytest.approx()`, `np.isclose()`).

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All floating-point comparisons explicitly specify an absolute or relative epsilon tolerance.
* **`FAIL`:** Any direct equality (`==`) or inequality (`!=`) comparison on floating-point values is detected in domain logic or tests.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Direct Float Equality)
```python
# Prohibited: Direct equality on floating-point calculations
def check_pressure_equilibrium(target: float, measured: float) -> bool:
    # Fails unpredictably due to IEEE 754 representation differences!
    if measured == target:
        return True
    return False
```

#### ✅ Compliant Canonical Pattern (Explicit Epsilon Tolerance)
```python
# Compliant: Safe comparison using bounded epsilon tolerance
import math

EPSILON_PRESSURE_BAR: float = 1e-6

def check_pressure_equilibrium(target_bar: float, measured_bar: float, epsilon: float = EPSILON_PRESSURE_BAR) -> bool:
    """Verifies pressure equilibrium within explicit physical tolerance."""
    return math.isclose(measured_bar, target_bar, abs_tol=epsilon)
```

---
[⬅️ Back to Floating-Point & Precision Handling (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
