# [CHK-ARCH-0204] Function Length and Nesting Limits
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../../README.md) > [Clean Code & SOLID Principles (Level 2)](../../README.md) > [Cognitive Load & Complexity Bounds (Level 3)](../README.md) > **CHK-ARCH-0204 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-ARCH-0204` |
| **Sub-Pillar & Category** | Clean Code & SOLID Principles / Cognitive Load & Complexity Bounds |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Clean Code (Robert C. Martin); Google Engineering Practices; ISO/IEC 25010 Readability |
| **Target Entities** | All function bodies, methods, lambdas, and closures |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Functions must be concise and easily readable on a single screen without vertical scrolling:
  * Maximum length: **40 logical lines of code (LLOC)** (excluding comments and docstrings).
  * Maximum indentation nesting depth: strictly **$\le 3$ levels**.
* **Engineering Rationale:** Deeply nested code (arrow anti-pattern) forces the human reader and AI models to maintain a deep mental stack of condition contexts, making logic verification error-prone and hiding edge-case vulnerabilities.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Maximum Function Length:** $\text{LLOC} \le 40$ lines.
* **Maximum Nesting Depth:** $\text{Depth} \le 3$ indentation levels.
* **Maximum Parameter Count:** $\le 4$ positional parameters (parameters $> 4$ must be bundled into a typed parameter object/dataclass).

---

### 4. Step-by-Step Verification Protocol
1. **Linter Nesting Depth Scan:**
   * Configure static analysis to enforce maximum nesting depth:
     ```bash
     # Example ESLint rule: "max-depth": ["error", 3], "max-lines-per-function": ["error", 40]
     # Example Flake8: flake8 --max-complexity 10 --select C901
     ```
2. **Visual Inspection of Long Routines:**
   * Invert conditionals using early returns (Bouncer Pattern) to eliminate nested `else` and inner `if` blocks.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All functions strictly adhere to $\le 40$ LLOC, nesting depth $\le 3$, and parameter count $\le 4$.
* **`FAIL`:** Any function exceeds 40 lines of logic, has 4 or more nested indentation levels, or accepts more than 4 raw arguments.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Deep Nesting > 3 Levels)
```python
# Prohibited: Nesting depth = 4 levels
def validate_and_save(record):
    if record is not None:
        if record.is_valid():
            if record.has_permission("admin"):
                for item in record.items:
                    if item.quantity > 0:  # Level 4 nesting!
                        db.save(item)
```

#### ✅ Compliant Canonical Pattern (Guard Clauses Bouncer Pattern)
```python
# Compliant: Nesting depth strictly <= 2 via early guard bailouts
def validate_and_save(record) -> None:
    if record is None or not record.is_valid():
        raise ValueError("Invalid record provided")
    if not record.has_permission("admin"):
        raise PermissionError("Admin permission required")

    valid_items = [item for item in record.items if item.quantity > 0]
    db.save_batch(valid_items)
```

---
[⬅️ Back to Cognitive Load & Complexity Bounds (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
