# [CHK-TEST-0202] Hermetic Test Execution & Isolation
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-TEST] Testing & Verification Suite (Level 1)](../../../README.md) > [Deterministic Unit Testing (Level 2)](../../README.md) > [Pure Algorithmic Testing (Level 3)](../README.md) > **CHK-TEST-0202 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-TEST-0202` |
| **Sub-Pillar & Category** | Deterministic Unit Testing / Pure Algorithmic Testing |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Hermetic Test Principle (Google Testing Blog); ISO/IEC/IEEE 29119 (Test Independence) |
| **Target Entities** | Unit test cases, test fixtures, global variables, in-memory singletons |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Each test case must be **hermetically isolated**. A test must create its own isolated state and clean up after itself completely. Tests must execute independently in any arbitrary order (or in parallel) without state pollution or shared mutable singletons leaking from one test to another.
* **Engineering Rationale:** Tests that share mutable state or depend on execution order fail unpredictably when tests are executed in parallel or when a subset of tests is run in isolation during local development.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Order-Dependent Test Failures:** Strictly `0`. Running tests in reverse order (`--reverse`) or random order (`--random-order`) must produce identical results.
* **Global Mutable State Leaks:** Strictly `0` un-reset singletons or global state variables between test executions.

---

### 4. Step-by-Step Verification Protocol
1. **Randomized Order Test Run:**
   * Execute the test suite with randomized execution ordering:
     ```bash
     pytest --random-order
     ```
   * Confirm 100% pass rate regardless of execution sequence.
2. **Single-Test Isolated Execution:**
   * Pick 5 random tests and run each individually in a fresh process:
     ```bash
     pytest tests/unit/test_accounting.py::test_specific_case
     ```
   * Confirm they pass without requiring previous tests to populate shared memory.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Tests pass in any sequence, reverse sequence, and in isolation with zero inter-test state leakage.
* **`FAIL`:** Tests pass only when run in a specific order, or one test fails because a previous test mutated global state.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Shared Mutable Global State)
```python
# Prohibited: Tests share global list; execution order breaks test 2!
GLOBAL_USER_CACHE = []

def test_add_user():
    GLOBAL_USER_CACHE.append("UserA")
    assert len(GLOBAL_USER_CACHE) == 1

def test_empty_state():
    # FAILS if test_add_user ran first!
    assert len(GLOBAL_USER_CACHE) == 0
```

#### ✅ Compliant Canonical Pattern (Hermetic Scoped Fixture)
```python
# Compliant: Fresh isolated instance per test with zero global leakage
import pytest

@pytest.fixture
def fresh_user_cache():
    """Provides a sterile, independent instance for each test invocation."""
    cache = []
    yield cache
    cache.clear()

def test_add_user(fresh_user_cache):
    fresh_user_cache.append("UserA")
    assert len(fresh_user_cache) == 1

def test_empty_state(fresh_user_cache):
    assert len(fresh_user_cache) == 0  # Always passes regardless of run order
```

---
[⬅️ Back to Pure Algorithmic Testing (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
