# [CHK-ARCH-0205] Zero Dead or Unreachable Code
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../../README.md) > [Clean Code & SOLID Principles (Level 2)](../../README.md) > [Dead Code & Source Hygiene (Level 3)](../README.md) > **CHK-ARCH-0205 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-ARCH-0205` |
| **Sub-Pillar & Category** | Clean Code & SOLID Principles / Dead Code & Source Hygiene |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | ISO/IEC 25010 (Analyzability & Maintainability); CWE-561 (Dead Code); Google Clean Code Standards |
| **Target Entities** | Production source code, helper utilities, private methods, parameter lists |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** The production codebase must contain **zero dead, unreachable, or obsolete code**. This includes uncalled functions, unused private methods, unused variables/parameters, orphaned files, and unexecuted branches following unconditional returns or throws.
* **Engineering Rationale:** Dead code creates confusion during code audits, wastes testing and compilation time, obscures security evaluations, and tricks developers into maintaining code paths that are never actually run.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Dead / Unreferenced Functions:** Strictly `0`.
* **Unused Imported Modules:** Strictly `0`.
* **Unreachable Statements:** Strictly `0`.

---

### 4. Step-by-Step Verification Protocol
1. **Static Dead Code Analysis:**
   * Run automated dead-code detection across the codebase:
     ```bash
     # Example for Python using vulture
     vulture src/ --min-confidence 80
     # Example for TypeScript using ts-prune or unimported
     npx ts-prune
     ```
2. **Linter Warning Zero-Tolerance Gate:**
   * Ensure linters treat unused variables and unused imports as build-breaking errors (e.g., `no-unused-vars: "error"`, `F401` in Flake8).

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Static analysis confirms zero unreachable statements, zero unreferenced functions, and zero unused imports in production modules.
* **`FAIL`:** The repository contains unused functions, orphaned files, uncalled private helpers, or unused variables.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Unreachable Code & Unused Helpers)
```python
# Prohibited: Unused parameters, dead branch after return, uncalled helper
def compute_rate(base: float, unused_multiplier: float) -> float:
    return base * 1.05
    # Unreachable dead code below!
    print("Computation finished")

def _legacy_helper_v1():
    # Dead function: 0 references across entire codebase!
    pass
```

#### ✅ Compliant Canonical Pattern (Pruned, Lean Source Tree)
```python
# Compliant: All parameters are utilized; no dead statements or orphaned routines
def compute_rate(base: float) -> float:
    if base < 0:
        raise ValueError(f"Base must be non-negative: {base}")
    return base * 1.05
```

---
[⬅️ Back to Dead Code & Source Hygiene (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
