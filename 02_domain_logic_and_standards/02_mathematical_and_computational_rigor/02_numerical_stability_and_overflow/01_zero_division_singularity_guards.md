# [CHK-DOM-0203] Zero Division & Singularity Guards
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-DOM] Domain Logic & Specifications (Level 1)](../../../README.md) > [Mathematical & Computational Rigor (Level 2)](../../README.md) > [Numerical Stability & Overflow Protection (Level 3)](../README.md) > **CHK-DOM-0203 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-DOM-0203` |
| **Sub-Pillar & Category** | Mathematical & Computational Rigor / Numerical Stability & Overflow Protection |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | CERT C / Python Coding Standard (FLT32-C / ERR08-J); ISO/IEC 25010 (Fault Tolerance) |
| **Target Entities** | Arithmetic quotients, normalizations, inverse transforms, trigonometric/logarithmic operations |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Every mathematical division, percentage calculation, normalization step, and logarithmic evaluation must contain **explicit guard clauses or clamp bounds against zero denominators and mathematical singularities**.
* **Engineering Rationale:** Unprotected divisions produce unhandled exceptions (`ZeroDivisionError`) or generate IEEE `NaN` / `Infinity` values that silently poison downstream data structures, leading to corrupted database records and crashed pipelines.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Unguarded Divisions:** Strictly `0` unguarded division operations where the denominator is variable or untrusted.
* **Singularity Defense:** Denominators with $|denominator| < 10^{-12}$ must either trigger an explicit domain validation error or use an explicit clamping epsilon.

---

### 4. Step-by-Step Verification Protocol
1. **Division Operator Audit:**
   * Scan codebase for all `/` and `//` division operators.
   * Verify that the variable in the denominator is checked for zero or non-zero preconditions prior to calculation.
2. **Boundary Zero Input Injection:**
   * Pass zero and negative numbers into mathematical calculation functions; verify the function raises a clean, typed domain exception rather than an unhandled division crash.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All division and logarithmic functions have defensive guards ensuring denominators can never cause zero-division crashes or produce `NaN`.
* **`FAIL`:** Any calculation routine executes division directly on unverified variables without zero checking.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Unguarded Division Crash)
```python
# Prohibited: If total_runs is 0, execution crashes with ZeroDivisionError
def calculate_failure_rate(failures: int, total_runs: int) -> float:
    # Crashes on first run when total_runs == 0!
    return (failures / total_runs) * 100.0
```

#### ✅ Compliant Canonical Pattern (Defensive Singularity Guard)
```python
# Compliant: Guard condition handles zero denominator explicitly
def calculate_failure_rate(failures: int, total_runs: int) -> float:
    """Calculates percentage failure rate with guaranteed zero-division safety."""
    if total_runs < 0 or failures < 0:
        raise ValueError(f"Parameters must be non-negative: runs={total_runs}, failures={failures}")
    if total_runs == 0:
        return 0.0  # Zero runs yield 0.0% failure rate by definition
    if failures > total_runs:
        raise ValueError(f"Failures ({failures}) cannot exceed total runs ({total_runs})")
    return (failures / total_runs) * 100.0
```

---
[⬅️ Back to Numerical Stability & Overflow Protection (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
