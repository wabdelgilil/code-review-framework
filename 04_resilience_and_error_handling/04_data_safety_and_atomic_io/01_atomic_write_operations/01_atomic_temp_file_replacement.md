# [CHK-RES-0401] Atomic Temporary File Replacement
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-RES] Resilience, Error Handling & Security (Level 1)](../../../README.md) > [Data Safety & Atomic I/O (Level 2)](../../README.md) > [Atomic Write Operations (Level 3)](../README.md) > **CHK-RES-0401 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-RES-0401` |
| **Sub-Pillar & Category** | Data Safety & Atomic I/O / Atomic Write Operations |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | POSIX `rename()` Atomicity Guarantee; ACID File Storage Principles; ISO/IEC 25010 (Data Integrity) |
| **Target Entities** | File persistence routines, configuration writers, state cache exporters |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Critical files, configurations, database dumps, and model artifacts must **never be written directly in-place to their destination filename**. Data must be written completely to a temporary file in the same filesystem directory and then atomically replaced using `os.replace()` / POSIX `rename()`.
* **Engineering Rationale:** Directly writing in-place (`open("file.json", "w")`) truncates the destination file to 0 bytes immediately. If the process is terminated, loses power, or runs out of disk space midway, the original file is permanently destroyed and replaced by corrupted partial data.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Direct In-Place Truncating Writes:** Strictly `0` for critical persistent files.
* **Atomic Replacement Guarantee:** Temporary file and destination file must reside on the exact same physical mount point to prevent cross-device non-atomic copies.

---

### 4. Step-by-Step Verification Protocol
1. **Source Code Inspection:**
   * Scan file export routines for `write-temp-then-rename` pattern.
   * Verify usage of `os.replace()` or `atomicwrites` utilities.
2. **Crash-Mid-Write Simulation:**
   * Inject a process abort midway through file serialization.
   * Verify that the original destination file remains completely intact and uncorrupted.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All file persistence routines write to a sibling temp file and replace destination atomically.
* **`FAIL`:** Critical files are truncated and written directly in-place, risking truncation upon crash.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Direct In-Place Truncation)
```python
# Prohibited: If process dies on line 4, previous config is DESTROYED!
def save_critical_config(path: str, data: str):
    with open(path, "w") as f:  # Truncates file immediately to 0 bytes!
        f.write(data)           # If power cuts here, file is empty/corrupt!
```

#### ✅ Compliant Canonical Pattern (Atomic Write-Temp-Then-Rename)
```python
# Compliant: Atomic replacement guaranteed by OS filesystem rename
import os
import tempfile
from pathlib import Path

def save_critical_config_atomic(target_path: Path, data: str) -> None:
    target_dir = target_path.parent
    target_dir.mkdir(parents=True, exist_ok=True)

    # Must create temp file in the SAME directory to guarantee same filesystem partition
    with tempfile.NamedTemporaryFile("w", dir=target_dir, delete=False, encoding="utf-8") as tmp_file:
        tmp_file.write(data)
        tmp_file.flush()
        os.fsync(tmp_file.fileno())  # Flush OS disk buffers
        temp_path = Path(tmp_file.name)

    # Atomic rename: target_path is either 100% old version or 100% new version
    os.replace(temp_path, target_path)
```

---
[⬅️ Back to Atomic Write Operations (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
