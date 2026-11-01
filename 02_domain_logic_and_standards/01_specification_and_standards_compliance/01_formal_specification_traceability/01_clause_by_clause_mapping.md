# [CHK-DOM-0101] Clause-by-Clause Specification Mapping
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-DOM] Domain Logic & Specifications (Level 1)](../../../README.md) > [Specification & Standards Compliance (Level 2)](../../README.md) > [Formal Specification Traceability (Level 3)](../README.md) > **CHK-DOM-0101 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-DOM-0101` |
| **Sub-Pillar & Category** | Specification & Standards Compliance / Formal Specification Traceability |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | ISO/IEC/IEEE 29148:2018 (Requirements Engineering); IEEE 830 / ISO/IEC 25010 (Functional Correctness) |
| **Target Entities** | Domain calculation engines, financial formulas, engineering algorithms, protocol parsers |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Every core domain calculation, state mutation rule, and algorithm must explicitly cite its **governing international standard, RFC clause, scientific paper, or formal requirements document** directly in its docstring and architectural documentation. Ad-hoc, undocumented "magic numbers" or arbitrary formula modifications are strictly prohibited.
* **Engineering Rationale:** Undocumented domain calculations become unmaintainable black boxes over time. If a formula produces unexpected output, maintainers cannot determine whether the discrepancy is a bug in the code or an intended divergence from the standard without explicit clause traceability.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Specification Citation Density:** `100%` of domain calculation routines must include formal standard citations (Standard Name, Clause/Section Number, Publication Year).
* **Magic Constant Prohibition:** Strictly `0` unexplained hardcoded floating-point coefficients in calculation formulas. All coefficients must be declared as named constants with their standard-defined derivation.

---

### 4. Step-by-Step Verification Protocol
1. **Docstring & Standard Citation Audit:**
   * Review all computational routines in the domain layer.
   * Verify that each routine cites the governing standard section (e.g., `ISO 8601 Section 4.3`, `RFC 5322 Section 3.2.3`).
2. **Standard Equation Conformance Check:**
   * Cross-reference the code implementation against the literal equation printed in the cited standard specification to confirm variable mapping and exponent parity.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Domain formulas cite explicit standard clauses and define all numeric constants with authoritative standard derivations.
* **`FAIL`:** Formulas contain unexplained numerical constants ("magic numbers") or implement domain calculations without citing a formal requirement or standard.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Ad-Hoc Formula with Magic Numbers)
```python
# Prohibited: Undocumented calculation with magic coefficients
def calc_heat_loss(temp_diff: float, area: float) -> float:
    # Where did 0.284 and 1.15 come from? What standard is this?
    return temp_diff * area * 0.284 * 1.15
```

#### ✅ Compliant Canonical Pattern (Formally Cited Standard Implementation)
```python
# Compliant: Explicit standard clause reference and documented constant derivation
# Standard Reference: ISO 6946:2017 - Building components and building elements (Clause 6.1)

THERMAL_TRANSMITTANCE_U_VALUE: float = 0.284  # ISO 6946:2017 Table 2 (W/m²·K)
SURFACE_RESISTANCE_FACTOR: float = 1.15        # ISO 6946:2017 Clause 6.1.2

def calculate_thermal_heat_flow(temperature_difference_k: float, area_m2: float) -> float:
    """Calculates steady-state heat flow rate according to ISO 6946:2017 Clause 6.1.
    
    Formula: Φ = U * A * ΔT * F_s
    
    Args:
        temperature_difference_k: Temperature delta in Kelvins.
        area_m2: Surface area in square meters.
    
    Returns:
        Heat flow rate in Watts (W).
    """
    if temperature_difference_k < 0:
        raise ValueError(f"Temperature difference must be positive: got {temperature_difference_k}")
    return temperature_difference_k * area_m2 * THERMAL_TRANSMITTANCE_U_VALUE * SURFACE_RESISTANCE_FACTOR
```

---
[⬅️ Back to Formal Specification Traceability (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
