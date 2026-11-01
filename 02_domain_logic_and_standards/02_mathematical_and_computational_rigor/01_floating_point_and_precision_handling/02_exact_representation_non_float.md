# [CHK-DOM-0202] Exact Representation for Non-Float Units
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-DOM] Domain Logic & Specifications (Level 1)](../../../README.md) > [Mathematical & Computational Rigor (Level 2)](../../README.md) > [Floating-Point & Precision Handling (Level 3)](../README.md) > **CHK-DOM-0202 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-DOM-0202` |
| **Sub-Pillar & Category** | Mathematical & Computational Rigor / Floating-Point & Precision Handling |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Martin Fowler (Money Pattern); General Financial & Discrete Quantity Standards |
| **Target Entities** | Monetary values, currency calculations, inventory item counts, discrete units |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Financial values, monetary currencies, discrete item counts, and fractional rational quantities must **never be represented as binary floating-point numbers (`float`, `double`)**. They must be represented as scaled integers (cents, micros) or exact arbitrary-precision decimal types (e.g. `Decimal`, `BigNumber`).
* **Engineering Rationale:** Binary floating-point cannot accurately represent decimal fractions like `0.10` or `0.01`. Compounding rounding errors across millions of financial transactions produce severe accounting discrepancies and audit failures.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Floats in Financial Domain:** Strictly `0` instances of `float` types used for currency or discrete inventory math.
* **Rounding Mode:** Explicit declaration of IEEE 754 / financial rounding modes (e.g. `ROUND_HALF_UP` or `ROUND_HALF_EVEN`), never relying on compiler default truncation.

---

### 4. Step-by-Step Verification Protocol
1. **Model & Schema Inspection:**
   * Review all financial and monetary entity definitions. Confirm fields use integer minor currency units or `Decimal`.
2. **Precision Drift Test:**
   * Add 10,000 increments of `0.01` currency units; verify the exact result matches integer `100.00` without fractional cent drift.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All monetary and discrete units use scaled integers or exact `Decimal` types with explicit rounding strategies.
* **`FAIL`:** Floats or doubles are utilized for monetary calculations, prices, or ledger accounting entries.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Float Used for Money)
```python
# Prohibited: Using binary float for financial transactions
def add_sales_tax(price: float) -> float:
    # 19.99 * 1.07 produces 21.389300000000003 - unpredictable float representation
    return price * 1.07
```

#### ✅ Compliant Canonical Pattern (Exact Decimal Representation)
```python
# Compliant: Exact decimal arithmetic with explicit rounding mode
from decimal import Decimal, ROUND_HALF_UP

TAX_RATE = Decimal("0.07")

def calculate_total_price_with_tax(net_price: Decimal) -> Decimal:
    """Calculates final gross price using exact fixed-point decimal arithmetic."""
    if net_price < Decimal("0.00"):
        raise ValueError(f"Price must be non-negative: received {net_price}")
    gross = net_price * (Decimal("1.00") + TAX_RATE)
    # Explicitly round to 2 decimal places (standard financial rounding)
    return gross.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
```

---
[⬅️ Back to Floating-Point & Precision Handling (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
