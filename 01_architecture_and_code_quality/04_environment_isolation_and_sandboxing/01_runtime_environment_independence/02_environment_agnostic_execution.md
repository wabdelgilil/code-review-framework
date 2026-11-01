# [CHK-ARCH-0402] Environment-Agnostic Execution & Working Directory Hygiene
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../../README.md) > [Environment Isolation & Sandboxing (Level 2)](../../README.md) > [Runtime Environment Independence (Level 3)](../README.md) > **CHK-ARCH-0402 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-ARCH-0402` |
| **Sub-Pillar & Category** | Environment Isolation & Sandboxing / Runtime Environment Independence |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Twelve-Factor App (Processes & Statelessness); POSIX Process Standards; ISO/IEC 25010 Portability |
| **Target Entities** | CLI runners, background jobs, test suites, startup bootstrap scripts |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** The application and test suite must execute correctly **regardless of the current working directory (`cwd`) from which the process was launched**. Code must never rely on implicit relative assumptions (such as assuming the terminal was opened inside a specific subfolder).
* **Engineering Rationale:** Command-line tools and daemons are frequently invoked from arbitrary working directories by cron, CI runners, or parent wrapper processes. If code assumes `cwd` is the repository root, relative imports or asset reads fail unpredictably.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Execution Invariance:** Launching CLI commands or running test suites from `root/`, `root/tests/`, or an arbitrary `/tmp/sandbox/` must produce identical behavior and pass rates.
* **Process Working Directory Mutation:** Strictly `0` calls to `os.chdir()` inside shared libraries or multi-threaded runtime paths.

---

### 4. Step-by-Step Verification Protocol
1. **Multi-CWD Execution Verification:**
   * Execute the test suite from root:
     ```bash
     python -m unittest discover tests/
     ```
   * Change directory to an arbitrary external path and execute targeting the module:
     ```bash
     cd .. && python -m unittest discover path/to/project/tests/
     ```
   * Confirm identical test results regardless of launch location.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** The system behaves identically when executed from any parent, child, or external working directory.
* **`FAIL`:** The application crashes or cannot locate its assets unless the user manually runs `cd` into a specific folder first.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Implicit CWD Dependency)
```python
# Prohibited: Assumes user launched terminal directly from the repository root
def load_data_file():
    # Crashes if run from `tests/` or external scheduler directory!
    with open("data/input.csv", "r") as f:
        return f.read()
```

#### ✅ Compliant Canonical Pattern (Anchor to File Anchor / Explicit Manifest)
```python
# Compliant: Path is anchored securely to known file anchor
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent / "data"

def load_data_file() -> str:
    with open(DATA_DIR / "input.csv", "r", encoding="utf-8") as f:
        return f.read()
```

---
[⬅️ Back to Runtime Environment Independence (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
