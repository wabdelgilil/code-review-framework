# [CHK-TEST-0401] Mutation Score Threshold & Fault Injection
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-TEST] Testing & Verification Suite (Level 1)](../../../README.md) > [Adversarial & Mutation Testing (Level 2)](../../README.md) > [Deliberate Bug Injection & Mutation (Level 3)](../README.md) > **CHK-TEST-0401 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-TEST-0401` |
| **Sub-Pillar & Category** | Adversarial & Mutation Testing / Deliberate Bug Injection & Mutation |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | IEEE Standard for Mutation Testing; Karl Popper Falsifiability Criterion |
| **Target Entities** | Core business algorithms, validation gates, mathematical formulas |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** The test suite must demonstrate genuine falsifiability by achieving a **Mutation Score of $\ge 80\%$** on core domain modules when subjected to automated mutation testing (e.g. flipping comparison operators `$<$` to `$<=$`, replacing constants, swapping `+` for `-`, or deleting statements). At least 80% of generated mutants must be detected and killed by failing tests.
* **Engineering Rationale:** High test coverage percentages can be fraudulent (e.g. tests that execute code lines but lack assertions, or assertions that are too weak to detect inverted logic). Mutation testing measures the real fault-detection capability of the test suite.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Minimum Mutation Score:** $\text{Score} = \frac{\text{Mutants Killed}}{\text{Total Mutants}} \ge 80.0\%$.
* **Surviving Mutants in Core Math:** Strictly `0` surviving mutants in critical arithmetic formulas.

---

### 4. Step-by-Step Verification Protocol
1. **Mutation Testing Execution:**
   * Run automated mutation analysis across core packages:
     ```bash
     # Example using mutmut (Python) or Stryker (JS/TS/C#)
     mutmut run --paths-to-mutate=src/domain/
     mutmut results
     ```
2. **Surviving Mutant Analysis:**
   * Review any mutant that survived (did not trigger a test failure).
   * Write targeted assertions specifically designed to detect and kill the unhandled mutation.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** The test suite achieves $\ge 80.0\%$ killed mutants on core logic packages.
* **`FAIL`:** Mutation score falls below 80.0%, indicating tests are weak or incapable of catching deliberate bugs.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Weak Assertion Allows Mutant to Survive)
```python
# Function under test
def is_eligible_for_tier(points: int) -> bool:
    return points >= 100

# Weak Test: Mutant changes `>=` to `>` or `True` to `False`
def test_eligible():
    # Only tests points = 500!
    # If mutant changes code to `points > 100`, this test STILL PASSES (Mutant Survives!)
    assert is_eligible_for_tier(500) is True
```

#### ✅ Compliant Canonical Pattern (Precise Assertion Kills Mutant)
```python
# Compliant: Boundary assertion specifically catches operator mutation (`>=` vs `>`)
def test_is_eligible_for_tier_boundary_kills_mutants():
    assert is_eligible_for_tier(100) is True   # Fails if mutated to `>` (Mutant Killed!)
    assert is_eligible_for_tier(99) is False   # Fails if mutated to `>= 90`
```

---
[⬅️ Back to Deliberate Bug Injection & Mutation (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
