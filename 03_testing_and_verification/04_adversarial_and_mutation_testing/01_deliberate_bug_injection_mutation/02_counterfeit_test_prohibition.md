# [CHK-TEST-0402] Counterfeit Test Prohibition
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-TEST] Testing & Verification Suite (Level 1)](../../../README.md) > [Adversarial & Mutation Testing (Level 2)](../../README.md) > [Deliberate Bug Injection & Mutation (Level 3)](../README.md) > **CHK-TEST-0402 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-TEST-0402` |
| **Sub-Pillar & Category** | Adversarial & Mutation Testing / Deliberate Bug Injection & Mutation |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Karl Popper Falsifiability Criterion; ISO/IEC/IEEE 29119 (Test Effectiveness) |
| **Target Entities** | All automated tests, unit test assertions, assertion-free smoke tests |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Any test that cannot demonstrably fail when a deliberate bug or inverted return value is injected into the code is **counterfeit and strictly prohibited**. Tests must contain meaningful, non-trivial assertions that bind directly to domain correctness.
* **Engineering Rationale:** Tests without assertions or tests that assert trivialities (like `assert obj is not None` or `assert True`) artificially inflate code coverage numbers in CI dashboards while providing zero protection against business logic regressions.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Assertion-Free Test Count:** Strictly `0` tests in the repository lacking explicit assertions.
* **Trivial Assertion Ban:** Strictly `0` tests containing only generic type checks (`assert isinstance(...)`) without validating computed content.

---

### 4. Step-by-Step Verification Protocol
1. **Assertion Density Scanner:**
   * Run static analysis to detect test functions that contain zero `assert` or `expect()` calls:
     ```bash
     # Example pytest check for tests without asserts
     flake8 --select=PT018,PT015 tests/
     ```
2. **Negative Inversion Check:**
   * Artificially invert the return value of the function under test (e.g. return negative or empty output).
   * Confirm that the test suite fails immediately.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** 100% of tests contain explicit value assertions that reliably fail when deliberate defects are injected.
* **`FAIL`:** The test suite contains tests that execute code without asserting results, or tests that pass even when the underlying logic is broken.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Counterfeit Test Without Assertions)
```python
# Prohibited: Counterfeit test artificially inflates code coverage to 100% with NO assertions!
def test_complex_calculation():
    result = calculate_tax_and_penalties(1000.0, 5)
    # ZERO ASSERTIONS! If the calculation returns -99999 or None, this test passes!
```

#### ✅ Compliant Canonical Pattern (Falsifiable Test with Explicit Boundary Assertions)
```python
# Compliant: Explicit value assertions bound to exact expected outputs
def test_complex_calculation_falsifiable():
    result = calculate_tax_and_penalties(1000.0, 5)
    assert result.principal_cents == 100000
    assert result.tax_cents == 15000
    assert result.penalty_cents == 2500
    assert result.total_cents == 117500
```

---
[⬅️ Back to Deliberate Bug Injection & Mutation (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
