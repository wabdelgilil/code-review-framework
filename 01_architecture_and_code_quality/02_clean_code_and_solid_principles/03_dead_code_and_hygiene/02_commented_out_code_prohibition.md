# [CHK-ARCH-0206] Prohibition of Commented-Out Code
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../../README.md) > [Clean Code & SOLID Principles (Level 2)](../../README.md) > [Dead Code & Source Hygiene (Level 3)](../README.md) > **CHK-ARCH-0206 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-ARCH-0206` |
| **Sub-Pillar & Category** | Clean Code & SOLID Principles / Dead Code & Source Hygiene |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Clean Code Chapter 4 (Comments as Failures); ISO/IEC 25010 Maintainability |
| **Target Entities** | All source code files, configuration files, test scripts |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Commented-out blocks of executable code are **strictly forbidden** in source repositories. Version control systems (Git) serve as the sole authoritative history for discarded, legacy, or experimental code.
* **Engineering Rationale:** Commented-out code rots quickly as surrounding signatures evolve, pollutes search results, confuses future maintainers who hesitate to delete it out of uncertainty, and degrades the signal-to-noise ratio of code reviews.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Commented-Out Code Blocks:** Strictly `0` blocks of commented-out syntax in checked-in branches.
* **Permitted Comments:** Only explanatory intent notes, algorithmic references, or formal documentation strings (docstrings/JSDoc).

---

### 4. Step-by-Step Verification Protocol
1. **Automated Regex / Pattern Scanning:**
   * Scan comments for programming language syntax (e.g., `# def `, `// const `, `/* class `):
     ```bash
     # Example scan for commented out statements in Python
     grep -rEn "^\s*#\s*(def |class |return |import |if |for |while |self\.)" src/
     ```
2. **Pre-Commit / CI Hook Enforcement:**
   * Block pull requests that contain commented-out code blocks via pre-commit or CI linters.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Source files contain only legitimate documentation comments; zero commented-out code statements exist.
* **`FAIL`:** Any file contains commented-out code lines or inactive logic blocks left behind from refactoring.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Commented-out Legacy Logic)
```python
# Prohibited: Commented-out code left in source
def process_invoice(invoice):
    # Old calculation logic - do not delete just in case!
    # old_total = invoice.subtotal * 1.10
    # if invoice.has_coupon:
    #     old_total -= 5.0
    # return old_total

    return invoice.subtotal * 1.15
```

#### ✅ Compliant Canonical Pattern (Clean Code Relying on Git History)
```python
# Compliant: Solely current production logic is retained; history preserved in Git
def process_invoice(invoice) -> float:
    """Calculates final invoice total using standard tax rate."""
    return invoice.subtotal * 1.15
```

---
[⬅️ Back to Dead Code & Source Hygiene (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
