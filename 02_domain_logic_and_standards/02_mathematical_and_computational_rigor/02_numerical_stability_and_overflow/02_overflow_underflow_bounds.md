# [CHK-DOM-0204] Overflow & Underflow Bounds Checking
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-DOM] Domain Logic & Specifications (Level 1)](../../../README.md) > [Mathematical & Computational Rigor (Level 2)](../../README.md) > [Numerical Stability & Overflow Protection (Level 3)](../README.md) > **CHK-DOM-0204 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-DOM-0204` |
| **Sub-Pillar & Category** | Mathematical & Computational Rigor / Numerical Stability & Overflow Protection |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | CWE-190 (Integer Overflow or Wraparound); CWE-191 (Integer Underflow); ISO/IEC 25010 Reliability |
| **Target Entities** | Large exponent arithmetic, accumulator loops, timestamps, byte counters |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Iterative accumulators, compounding calculations, large power expressions, and integer counters must contain **explicit bound assertions against arithmetic overflow, underflow, and unbounded value explosion**.
* **Engineering Rationale:** Unbounded growth can overflow fixed-width integers (wrapping positive values to negative numbers in C/C++/Java/Go) or consume unbounded memory and CPU time in languages with arbitrary-precision integers (like Python), causing denial of service.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Exponent Bounds:** Exponents in functions like $x^y$ or $e^x$ must be clamped to safe operational limits (e.g. $y \le 100$ or domain-specific maximum).
* **Accumulator Clamping:** Accumulator values must have declared minimum/maximum limits beyond which execution halts or clamps gracefully.

---

### 4. Step-by-Step Verification Protocol
1. **Loop & Power Operation Audit:**
   * Review all multiplication loops and `pow()` / `**` invocations.
   * Verify that upper bound checks precede any exponential calculation.
2. **Stress Value Testing:**
   * Inject boundary maximum values (e.g. $10^{15}$, integer limits); verify the system catches the overflow cleanly without silent numerical wraparound.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Numerical bounds are enforced on all exponential and compounding routines, preventing arithmetic explosion or overflow wraparound.
* **`FAIL`:** Functions compute powers or compound loops with unbounded inputs, allowing potential overflow or runaway memory allocation.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Unchecked Exponential Calculation)
```python
# Prohibited: Unchecked exponent allows CPU lockup or memory exhaustion
def compound_growth(base: float, periods: int) -> float:
    # If periods is passed as 10,000,000, causes massive calculation or crash!
    return base ** periods
```

#### ✅ Compliant Canonical Pattern (Guarded Exponential Bounds)
```python
# Compliant: Explicit bounds checking on exponent magnitude
MAX_SAFE_PERIODS: int = 1000

def compound_growth(base: float, periods: int) -> float:
    """Calculates compounding growth with strict bounds validation."""
    if not (0 <= periods <= MAX_SAFE_PERIODS):
        raise ValueError(f"Periods must be between 0 and {MAX_SAFE_PERIODS}: got {periods}")
    if base < 0:
        raise ValueError(f"Base must be non-negative: got {base}")
    return base ** periods
```

---
[⬅️ Back to Numerical Stability & Overflow Protection (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
