# [CHK-ARCH-0403] Isolated Temporary Workspace
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../../README.md) > [Environment Isolation & Sandboxing (Level 2)](../../README.md) > [Filesystem Sandboxing & Lifecycle Cleanup (Level 3)](../README.md) > **CHK-ARCH-0403 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-ARCH-0403` |
| **Sub-Pillar & Category** | Environment Isolation & Sandboxing / Filesystem Sandboxing & Lifecycle Cleanup |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | CWE-377 (Insecure Temporary File); POSIX `mkstemp` / `mkdtemp` Standards; ISO/IEC 25010 (Security & Reliability) |
| **Target Entities** | Temporary file generation, intermediate export processors, scratch caches |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** All transient operations, scratch calculations, and intermediate export files must be created within a **strictly isolated, uniquely named temporary workspace directory** allocated via OS-level secure temporary primitives. Never write scratch files directly into the repository root, system root, or predictable global folders.
* **Engineering Rationale:** Writing temporary files into shared or predictable paths causes race conditions, file collisions between concurrent worker processes, security vulnerabilities (symlink attacks), and permanently litters the source code repository with untracked junk.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Repository Litter Metric:** Strictly `0` untracked temporary files or scratch directories created in `src/` or repository root after running tests or execution routines.
* **Namespace Isolation:** Temporary directories must use randomized cryptographic or UUID suffixes to guarantee isolation during concurrent execution.

---

### 4. Step-by-Step Verification Protocol
1. **Pre-Execution vs Post-Execution Git Status:**
   * Run full test and execution suites:
     ```bash
     git status --porcelain
     ```
   * Verify that `git status` reports completely clean (zero new untracked temporary files generated in working tree).
2. **Concurrency Collision Verification:**
   * Run two parallel test processes writing temporary artifacts simultaneously; confirm neither process collides or fails due to shared file lock contention.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All scratch artifacts reside inside unique OS temporary directories; working tree remains 100% clean following execution.
* **`FAIL`:** The application writes scratch or cache files directly into the project source tree or into hardcoded predictable paths like `/tmp/temp.txt`.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Hardcoded Predictable Scratch File)
```python
# Prohibited: Writing temporary scratch file directly to repository or fixed path
def generate_report():
    # Vulnerable to collisions and permanently litters repository!
    with open("temp_output.txt", "w") as f:
        f.write("data...")
```

#### ✅ Compliant Canonical Pattern (Secure Temporary Directory Sandbox)
```python
# Compliant: Isolated, unique temporary directory with context management
import tempfile
from pathlib import Path

def generate_report() -> bytes:
    with tempfile.TemporaryDirectory(prefix="app_scratch_") as tmpdir:
        scratch_path = Path(tmpdir) / "output.bin"
        scratch_path.write_bytes(b"data...")
        # Process output...
        return scratch_path.read_bytes()
    # Directory automatically destroyed upon exiting context!
```

---
[⬅️ Back to Filesystem Sandboxing & Lifecycle Cleanup (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
