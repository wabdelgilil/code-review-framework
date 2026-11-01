# [CHK-ARCH-0102] In-Memory Pure Calculation Boundaries
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../../README.md) > [Modularity & Separation of Concerns (Level 2)](../../README.md) > [Domain Core Isolation (Level 3)](../README.md) > **CHK-ARCH-0102 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-ARCH-0102` |
| **Sub-Pillar & Category** | Modularity & Separation of Concerns / Domain Core Isolation |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | ISO/IEC 25010 (Testability & Analyzability); Functional Core / Imperative Shell Pattern |
| **Target Entities** | Algorithmic procedures, mathematical routines, calculation engines, business evaluators |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Business calculation functions and decision routines must accept pure in-memory data structures (primitives, value objects, immutable dataclasses) as arguments and return pure values. They must **never perform direct file reading/writing, socket communication, environment variable lookups, or system clock calls** internally.
* **Engineering Rationale:** Functions that mix calculations with I/O (e.g. opening a file to read coefficients mid-computation) are difficult to unit-test, require complex mock setups, suffer from unpredictable performance due to blocking I/O, and cannot guarantee deterministic outputs across different environments.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Direct I/O Calls in Calculation Routines:** Strictly `0` disk, socket, or external environmental calls inside core calculation methods.
* **Side-Effect Purity:** Given identical in-memory input arguments, calculation functions must yield bitwise or mathematically identical outputs without mutating arguments or external environment state.

---

### 4. Step-by-Step Verification Protocol
1. **Source Inspection for I/O Calls:**
   * Scan calculation functions for direct filesystem operations (e.g., `open()`, `readFile()`, `fs.writeFileSync`), network calls (e.g., `fetch()`, `http.get`), or system clock reads (e.g., `Date.now()`, `datetime.datetime.now()`).
   * Verify that required external inputs (like configuration values or timestamps) are passed in explicitly as function parameters.
2. **Deterministic Execution Verification:**
   * Invoke the calculation procedure 100 times in memory with identical parameters.
   * Verify that execution does not create, touch, or delete any files on the filesystem, and that all 100 return values are identical.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All computation functions operate solely on in-memory parameters and return values without performing file, network, or clock I/O.
* **`FAIL`:** Any computational routine opens files, performs HTTP/socket calls, queries the system clock directly, or mutates external global state during calculation.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Calculation Mixed with File I/O)
```python
# Prohibited: Mathematical calculation routine reads coefficients directly from a file
import json

def calculate_stress_index(load: float) -> float:
    # Direct file I/O inside mathematical function ruins determinism and performance
    with open("config/coefficients.json", "r") as f:
        config = json.load(f)
    safety_factor = config["safety_factor"]
    return load * safety_factor * 1.414
```

#### ✅ Compliant Canonical Pattern (Pure In-Memory Calculation)
```python
# Compliant: Pure calculation accepting all parameters via in-memory data structure
from dataclasses import dataclass

@dataclass(frozen=True)
class StressParameters:
    safety_factor: float
    geometric_multiplier: float = 1.414

def calculate_stress_index(load: float, params: StressParameters) -> float:
    """Pure mathematical function: 100% deterministic, zero I/O side effects."""
    if load < 0:
        raise ValueError(f"Load must be non-negative: received {load}")
    return load * params.safety_factor * params.geometric_multiplier
```

---
[⬅️ Back to Domain Core Isolation (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
