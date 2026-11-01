# [CHK-ARCH-0401] Zero Hardcoded Host File Paths
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../../README.md) > [Environment Isolation & Sandboxing (Level 2)](../../README.md) > [Runtime Environment Independence (Level 3)](../README.md) > **CHK-ARCH-0401 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-ARCH-0401` |
| **Sub-Pillar & Category** | Environment Isolation & Sandboxing / Runtime Environment Independence |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Twelve-Factor App (Portability); POSIX Path Standards; ISO/IEC 25010 (Portability & Adaptability) |
| **Target Entities** | Path resolution routines, configuration loaders, script launchers, asset loaders |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Source code, configuration files, and test scripts must contain **zero hardcoded machine-specific absolute file paths** (such as `/Users/name/...`, `C:\Users\username\...`, or `/home/...`). All file paths must be resolved dynamically relative to the application root or injected via environment variables.
* **Engineering Rationale:** Hardcoded host paths instantly break builds when code is run on a colleague's workstation, inside a continuous integration runner, or in a Docker container, causing catastrophic "works on my machine" failures.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Hardcoded Machine Absolute Paths:** Strictly `0` occurrences across all repository files.
* **Path Construction Standard:** `100%` of path concatenation must utilize platform-neutral path joining utilities (e.g. `pathlib.Path`, `os.path.join`, or `path.resolve`), never hardcoded slash or backslash string formatting.

---

### 4. Step-by-Step Verification Protocol
1. **Automated Host Path Regex Grep:**
   * Scan all repository files for user home directory patterns and drive root paths:
     ```bash
     # Search for Windows absolute drive paths and Unix user paths
     grep -rEn "(C:\\\\Users|/home/|/Users/|/tmp/)" src/ tests/
     ```
   * Confirm zero matches in production and test suites.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All file and directory operations use relative paths or environment-configured base directories with platform-agnostic path resolution.
* **`FAIL`:** Any occurrence of a hardcoded personal user path, hardcoded absolute drive letter, or non-portable path string.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Hardcoded Machine Path)
```python
# Prohibited: Hardcoded absolute developer path
def load_configuration():
    # Fails immediately on any machine other than original developer workstation!
    with open("C:\\Users\\alice\\projects\\app\\config.json", "r") as f:
        return json.load(f)
```

#### ✅ Compliant Canonical Pattern (Dynamic Root Path Resolution)
```python
# Compliant: Path dynamically anchored relative to module location
from pathlib import Path
import json

APP_ROOT = Path(__file__).resolve().parent.parent

def load_configuration() -> dict:
    config_path = APP_ROOT / "config" / "config.json"
    with open(config_path, "r", encoding="utf-8") as f:
        return json.load(f)
```

---
[⬅️ Back to Runtime Environment Independence (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
