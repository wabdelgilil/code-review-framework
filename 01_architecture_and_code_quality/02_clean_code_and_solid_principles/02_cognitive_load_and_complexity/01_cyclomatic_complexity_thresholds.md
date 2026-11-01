# [CHK-ARCH-0203] Cyclomatic Complexity Thresholds
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../../README.md) > [Clean Code & SOLID Principles (Level 2)](../../README.md) > [Cognitive Load & Complexity Bounds (Level 3)](../README.md) > **CHK-ARCH-0203 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-ARCH-0203` |
| **Sub-Pillar & Category** | Clean Code & SOLID Principles / Cognitive Load & Complexity Bounds |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | McCabe Cyclomatic Complexity Metric; NIST Special Publication 500-235; ISO/IEC 25010 (Analyzability) |
| **Target Entities** | All methods, functions, routines, and algorithmic blocks |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** No individual function or method in the codebase may exceed a **Cyclomatic Complexity (CC) score of 10**. Any function with a complexity score between 11 and 15 triggers a mandatory refactoring flag. Any function with a score exceeding 15 is a **CRITICAL BLOCKING DEFECT**.
* **Engineering Rationale:** McCabe Cyclomatic Complexity directly measures the number of linearly independent paths through program source code. Functions with CC $> 10$ exponentially increase defect rates, require an excessive number of test cases to achieve full branch coverage, and impose prohibitive cognitive load on maintainers.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Maximum Permissible CC (Standard Functions):** $\text{CC} \le 10$ (`PASS`).
* **Warning / Refactor Threshold:** $11 \le \text{CC} \le 15$ (`WARNING` - must have explicit refactoring issue).
* **Critical Blocking Cap:** $\text{CC} > 15$ (`CRITICAL FAIL` - blocks build/merge).

---

### 4. Step-by-Step Verification Protocol
1. **Automated Static Analysis Tooling:**
   * Run an automated complexity scanner across the entire repository.
   * Command example:
     ```bash
     # Example using radon for Python (checking for Grade C, D, E, F)
     radon cc src/ -s -n C
     # Example using eslint for JS/TS
     npx eslint --rule '{"complexity": ["error", 10]}' src/
     ```
2. **Review High-Complexity Functions:**
   * Break down offending routines by extracting sub-routines, lookup tables, or strategy patterns until CC drops $\le 10$.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** 100% of methods and functions have a Cyclomatic Complexity $\le 10$.
* **`FAIL`:** One or more functions have a Cyclomatic Complexity $> 15$, or $> 10$ without an approved architectural exemption.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (High Cyclomatic Complexity CC > 12)
```python
# Prohibited: Deeply nested branching logic with CC = 13
def process_transaction(user, tx, env):
    if user.is_active:
        if tx.amount > 0:
            if tx.currency == "USD":
                if env == "prod":
                    if user.has_tier("gold"):
                        fee = 0.01
                    else:
                        fee = 0.02
                else:
                    fee = 0.0
            elif tx.currency == "EUR":
                fee = 0.03
            else:
                return "UNSUPPORTED_CURRENCY"
        else:
            return "INVALID_AMOUNT"
    else:
        return "INACTIVE_USER"
    return tx.amount * (1 + fee)
```

#### ✅ Compliant Canonical Pattern (Extracted Guards and Lookup Table CC <= 2)
```python
# Compliant: Guard clauses and declarative configuration keep CC <= 2
FEE_RATES = {
    ("prod", "gold", "USD"): 0.01,
    ("prod", "standard", "USD"): 0.02,
    ("prod", "any", "EUR"): 0.03,
}

def get_fee_rate(env: str, tier: str, currency: str) -> float:
    if env != "prod":
        return 0.0
    return FEE_RATES.get((env, tier, currency), FEE_RATES.get((env, "any", currency), 0.05))

def process_transaction(user, tx, env: str) -> float:
    """Refactored with early guard exits: CC = 2."""
    if not user.is_active:
        raise ValueError("User is not active")
    if tx.amount <= 0:
        raise ValueError("Transaction amount must be positive")
    
    tier = "gold" if user.has_tier("gold") else "standard"
    fee_rate = get_fee_rate(env, tier, tx.currency)
    return tx.amount * (1.0 + fee_rate)
```

---
[⬅️ Back to Cognitive Load & Complexity Bounds (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
