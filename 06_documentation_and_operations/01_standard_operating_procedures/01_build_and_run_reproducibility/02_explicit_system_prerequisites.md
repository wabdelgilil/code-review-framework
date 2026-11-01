# [CHK-UX-0102] Explicit System Prerequisites Declaration
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-UX] Documentation, DX & Operations (Level 1)](../../../README.md) > [Standard Operating Procedures (Level 2)](../../README.md) > [Build & Run Reproducibility (Level 3)](../README.md) > **CHK-UX-0102 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-UX-0102` |
| **Sub-Pillar & Category** | Standard Operating Procedures / Build & Run Reproducibility |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Twelve-Factor App (Dependencies); ISO/IEC 25010 (Portability & Installability) |
| **Target Entities** | Root README, `.tool-versions`, `pyproject.toml`, Dockerfiles, package configs |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** All underlying system dependencies, required compiler toolchains, native libraries, and minimum language runtime versions must be **explicitly codified in checked-in version pinning files** (e.g. `.tool-versions`, `.nvmrc`, `runtime.txt`, `Dockerfile`) and prominently stated in root documentation.
* **Engineering Rationale:** Undocumented reliance on system-level packages (like assuming `libssl-dev` or `git` is pre-installed) causes build failures across different developer operating systems and leads to obscure linker errors.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Runtime Version Specificity:** Language runtime version must specify exact major and minor constraints (e.g. `Python >= 3.11, < 3.13` or `Node.js 20.x LTS`).
* **Hidden System Dependencies:** Strictly `0` undeclared native library requirements.

---

### 4. Step-by-Step Verification Protocol
1. **Prerequisite Manifest Audit:**
   * Verify that `.tool-versions` or equivalent manifest declares exact supported language and tool versions.
2. **Pre-flight Assertion Check:**
   * Verify that the startup or build script asserts runtime version constraints upfront and outputs a friendly message if the host runtime is unsupported.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All tools and runtime versions are codified in manifests with startup assertion checks.
* **`FAIL`:** The repository assumes global tools are installed without declaring versions or checking compatibility.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Vague, Undocumented Assumptions)
```markdown
# Readme:
"Requires Python and some C libraries."
<!-- Which Python version? Python 2? 3.8? 3.12? Which C libraries? -->
```

#### ✅ Compliant Canonical Pattern (Codified Runtime Tool Constraints)
```toml
# pyproject.toml - Explicit runtime version constraint
[project]
name = "enterprise-app"
version = "1.0.0"
requires-python = ">=3.11, <3.13"

# Startup pre-flight check in __init__.py / cli.py
import sys

if sys.version_info < (3, 11):
    sys.exit("CRITICAL: Python >= 3.11 is required. Current version: " + sys.version)
```

---
[⬅️ Back to Build & Run Reproducibility (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
