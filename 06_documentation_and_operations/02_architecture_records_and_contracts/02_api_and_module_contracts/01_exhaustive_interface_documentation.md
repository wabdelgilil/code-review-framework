# [CHK-UX-0203] Exhaustive Public Interface Documentation
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-UX] Documentation, DX & Operations (Level 1)](../../../README.md) > [Architecture Records & Contracts (Level 2)](../../README.md) > [API & Module Contracts (Level 3)](../README.md) > **CHK-UX-0203 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-UX-0203` |
| **Sub-Pillar & Category** | Architecture Records & Contracts / API & Module Contracts |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | OpenAPI / AsyncAPI Specifications; PEP 257 (Docstring Conventions); JSDoc Standards; ISO/IEC 25010 |
| **Target Entities** | Public classes, exported functions, public API routes, CLI command parameters |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Every public class, exported function, public API endpoint, and CLI argument must have an **exhaustive, typed documentation block (docstring/JSDoc/OpenAPI schema)** detailing: (1) purpose, (2) all input parameters with types and constraints, (3) return type and structure, and (4) all potential exceptions raised.
* **Engineering Rationale:** Undocumented public functions force developers to read implementation code to understand how to call them, leading to incorrect assumptions about acceptable parameter ranges and unhandled exceptions.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Public Function Docstring Coverage:** `100%` of public methods/classes in core packages must have complete docstrings.
* **Missing Parameter Documentation:** Strictly `0` parameters omitted from docstring argument lists.

---

### 4. Step-by-Step Verification Protocol
1. **Automated Documentation Linter:**
   * Run docstring linting tools:
     ```bash
     # Example using pydocstyle or darglint for Python
     pydocstyle src/ --convention=google
     darglint src/
     ```
2. **Type Hint & Schema Completeness:**
   * Verify that static type checkers (`mypy`, `tsc`) pass with zero untyped public definitions (`disallow_untyped_defs = true`).

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All public interfaces, classes, and methods have full typed docstrings covering inputs, outputs, and exceptions.
* **`FAIL`:** Public functions lack documentation or document parameters without types or exception definitions.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Undocumented Public Function)
```python
# Prohibited: Zero documentation on inputs, outputs, or error conditions
def process_payout(user_id, amount, mode="standard"):
    # What is the format of user_id? What are valid modes? What exceptions can occur?
    pass
```

#### ✅ Compliant Canonical Pattern (Exhaustive Google-Style Docstring with Types)
```python
# Compliant: Full parameter descriptions, constraints, return schema, and exceptions
def process_payout(user_id: str, amount_cents: int, mode: str = "standard") -> str:
    """Processes an account payout transaction.

    Args:
        user_id: Unique UUID identifier of the recipient account.
        amount_cents: Non-negative payout amount in integer cents.
        mode: Dispatch mode; must be one of "standard" (T+2) or "instant".

    Returns:
        A unique 64-character transaction reference hash.

    Raises:
        ValueError: If amount_cents is <= 0 or mode is unrecognized.
        InsufficientFundsError: If account balance is insufficient for amount.
    """
    pass
```

---
[⬅️ Back to API & Module Contracts (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
