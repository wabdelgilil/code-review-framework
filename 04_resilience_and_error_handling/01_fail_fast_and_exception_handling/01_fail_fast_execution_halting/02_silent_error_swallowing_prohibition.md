# [CHK-RES-0102] Prohibition of Silent Error Swallowing
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-RES] Resilience, Error Handling & Security (Level 1)](../../../README.md) > [Fail-Fast & Exception Handling (Level 2)](../../README.md) > [Fail-Fast Execution Halting (Level 3)](../README.md) > **CHK-RES-0102 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-RES-0102` |
| **Sub-Pillar & Category** | Fail-Fast & Exception Handling / Fail-Fast Execution Halting |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Clean Code Chapter 7 (Error Handling); ISO/IEC 25010 (Fault Tolerance); CWE-390 |
| **Target Entities** | Exception handling blocks (`try...catch`, `try...except`), error callback handlers |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Empty `catch` or `except` blocks that catch exceptions and do nothing (or only log a generic print without recovering or propagating) are **strictly forbidden**. Every caught exception must either: (1) be fully handled via a legitimate domain recovery mechanism, or (2) be re-raised/translated into a domain exception preserving root cause.
* **Engineering Rationale:** Silent exception swallowing is the primary cause of phantom bugs: errors occur and are hidden, leaving the system in an inconsistent state while callers assume the operation succeeded, making subsequent debugging nearly impossible.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Empty / No-Op Catch Blocks:** Strictly `0`.
* **Bare Catch-Alls (`except:` or `catch(Exception e)` without rethrow):** Strictly `0` in business logic layers.

---

### 4. Step-by-Step Verification Protocol
1. **Static AST Search for Empty Catches:**
   * Run linter or static query looking for empty exception blocks:
     ```bash
     # Search for bare pass in except blocks in Python
     grep -rn -A 2 "except" src/ | grep -E "pass|continue"
     ```
2. **Review Catch Handlers:**
   * Verify that any catch block either performs active compensation or re-raises.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All caught exceptions are meaningfully recovered or propagated up the call stack with full diagnostic context.
* **`FAIL`:** The codebase contains empty `catch`/`except` blocks or logs an error message without re-raising or recovering.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Silent Exception Swallowing)
```python
# Prohibited: Catches all exceptions and does nothing!
def save_user_preferences(prefs):
    try:
        db.save(prefs)
    except Exception:
        pass  # SILENT SWALLOWING! If DB fails, caller thinks save succeeded!
```

#### ✅ Compliant Canonical Pattern (Explicit Re-throw with Context)
```python
# Compliant: Catches specific exception, adds context, and propagates
class PersistenceError(RuntimeError):
    pass

def save_user_preferences(prefs) -> None:
    try:
        db.save(prefs)
    except IOError as err:
        # Wrap into domain exception preserving root cause
        raise PersistenceError(f"Failed to persist preferences for user {prefs.user_id}") from err
```

---
[⬅️ Back to Fail-Fast Execution Halting (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
