# [CHK-UX-0101] Single-Command Deterministic Build
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-UX] Documentation, DX & Operations (Level 1)](../../../README.md) > [Standard Operating Procedures (Level 2)](../../README.md) > [Build & Run Reproducibility (Level 3)](../README.md) > **CHK-UX-0101 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-UX-0101` |
| **Sub-Pillar & Category** | Standard Operating Procedures / Build & Run Reproducibility |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Twelve-Factor App (Build, Release, Run); ISO/IEC 25010 (Operability & Installability) |
| **Target Entities** | Root build manifests, Makefiles, package scripts, build scripts |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** The entire project must build, package, and execute its test suite from scratch using a **single, standardized root command** (e.g. `make build`, `npm run build`, `poetry run build`). Multi-step manual setup instructions or implicit undocumented steps are strictly prohibited.
* **Engineering Rationale:** When building software requires 8 manual steps scattered across a README, developers set up environments inconsistently, CI pipelines break on environment drift, and onboarding a new engineer takes days instead of minutes.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Build Command Count:** Exactly `1` unambiguous root command.
* **Zero-Touch Success:** Executing the build command in a clean container must yield exit code `0` with zero human interactive prompts.

---

### 4. Step-by-Step Verification Protocol
1. **Clean Container Build Test:**
   * Launch a sterile, vanilla container/environment containing only standard base tools.
   * Clone repository and run the documented root build command:
     ```bash
     make build && make test
     ```
   * Confirm complete success with exit code 0.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** The application builds and passes all tests via a single command in a clean environment without manual steps.
* **`FAIL`:** The build fails unless an undocumented manual command or manual file copy is performed first.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Manual Undocumented Steps)
```text
# README.md extract:
1. First, install libxyz manually from github
2. Then copy config.sample to /etc/config.json and edit line 15
3. Run python setup.py build
4. If it fails, chmod +x some_script.sh and run it twice
# Brittle, non-deterministic, fails on automated CI!
```

#### ✅ Compliant Canonical Pattern (Deterministic Single Makefile / Command)
```makefile
# Makefile - Single command orchestrates entire verified build
.PHONY: all install build test

all: install build test

install:
	poetry install --no-root --sync

build:
	poetry run python -m build

test:
	poetry run pytest tests/
```

---
[⬅️ Back to Build & Run Reproducibility (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
