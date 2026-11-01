# [CHK-TEST-0201] Zero Flakiness & Non-Deterministic Calls
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-TEST] Testing & Verification Suite (Level 1)](../../../README.md) > [Deterministic Unit Testing (Level 2)](../../README.md) > [Pure Algorithmic Testing (Level 3)](../README.md) > **CHK-TEST-0201 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-TEST-0201` |
| **Sub-Pillar & Category** | Deterministic Unit Testing / Pure Algorithmic Testing |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Google Testing Practices (Flaky Tests Elimination); ISO/IEC/IEEE 29119 (Repeatability) |
| **Target Entities** | Unit test suites, random generators, time-dependent routines, async tests |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Unit tests must be **100% deterministic**. Tests must never depend on real wall-clock time, network latency, thread scheduling race conditions, or unseeded pseudo-random number generators. Running the test suite 100 consecutive times on any machine must yield 100 identical binary results (`PASS` or `FAIL`).
* **Engineering Rationale:** Flaky tests erode team confidence in CI pipelines, cause engineers to ignore actual test failures ("just re-run it, it fails sometimes"), and allow real concurrency and timing defects to slip through to production.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Flakiness Failure Rate:** Strictly `0.0%` over 100 consecutive runs.
* **Unseeded Random / Live Time Calls in Unit Tests:** Strictly `0`. Any test reading the system clock must use an injected clock mock/fake (e.g. `freezegun`, `sinon.useFakeTimers`).

---

### 4. Step-by-Step Verification Protocol
1. **Stress Flake Detection Run:**
   * Execute the test suite repeatedly in a loop:
     ```bash
     for i in {1..50}; do pytest tests/unit || exit 1; done
     ```
   * Confirm zero intermittent failures.
2. **Clock & Sleep Grep:**
   * Search tests for sleep statements (e.g. `time.sleep()`, `setTimeout` without fake timers).
   * Flag any explicit sleep in unit tests as an anti-pattern.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All unit tests pass 50/50 consecutive runs deterministically with zero dependence on unseeded randomness or wall-clock timing.
* **`FAIL`:** Any test exhibits intermittent passing/failing behavior or relies on arbitrary `sleep()` statements.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Flaky Test with Real Clock and Sleep)
```python
# Prohibited: Flaky test depends on execution speed and wall-clock sleep
import time

def test_session_expiry():
    session = create_session(ttl_seconds=1)
    time.sleep(1.05)  # Fragile: Might fail on slow CI runners!
    assert session.is_expired() is True
```

#### ✅ Compliant Canonical Pattern (Deterministic Injected Clock Fake)
```python
# Compliant: Deterministic time injection with zero real sleep
class FakeClock:
    def __init__(self, start_time: float = 1000.0):
        self.current_time = start_time

    def advance(self, seconds: float) -> None:
        self.current_time += seconds

    def now(self) -> float:
        return self.current_time

def test_session_expiry():
    clock = FakeClock()
    session = create_session(ttl_seconds=60, clock=clock)
    assert session.is_expired() is False

    clock.advance(61)  # Advances instantly and 100% deterministically
    assert session.is_expired() is True
```

---
[⬅️ Back to Pure Algorithmic Testing (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
