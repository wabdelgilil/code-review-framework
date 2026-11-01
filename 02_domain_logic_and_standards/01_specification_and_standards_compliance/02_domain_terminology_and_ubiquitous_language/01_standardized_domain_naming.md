# [CHK-DOM-0103] Standardized Domain Terminology & Ubiquitous Language
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-DOM] Domain Logic & Specifications (Level 1)](../../../README.md) > [Specification & Standards Compliance (Level 2)](../../README.md) > [Domain Terminology & Ubiquitous Language (Level 3)](../README.md) > **CHK-DOM-0103 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-DOM-0103` |
| **Sub-Pillar & Category** | Specification & Standards Compliance / Domain Terminology & Ubiquitous Language |
| **Classification** | **`[BEST PRACTICE]`** |
| **Governing Standard** | Domain-Driven Design (Eric Evans); ISO/IEC 25010 (Analyzability & Learnability) |
| **Target Entities** | Variable names, class names, domain glossaries, database columns, API parameters |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Code identifiers (classes, variables, functions, arguments) must use **authoritative domain terms** matching the formal standard glossary. Ambiguous abbreviations, informal developer slang, or synonyms for identical domain concepts are strictly forbidden.
* **Engineering Rationale:** Divergent terminology creates cognitive friction and severe communication breakdown between domain experts and software engineers, leading to incorrect assumptions about unit scales and lifecycle meanings.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Concept Synonym Count:** Exactly `1` canonical term per domain concept (e.g. if the standard calls it `kinematic_viscosity`, never mix `viscosity`, `kv`, and `fluid_thickness` across files).
* **Unit Suffix Mandate:** `100%` of scalar quantities with physical or temporal dimensions must include their unit in the identifier (e.g., `timeout_seconds`, `pressure_pascals`, `duration_ms`).

---

### 4. Step-by-Step Verification Protocol
1. **Domain Glossary Cross-Check:**
   * Compare codebase symbols against the project's domain dictionary.
   * Search for colloquial abbreviations (e.g. `tmp`, `val`, `calc_stuff`, `hndlr`).
2. **Unit Suffix Audit:**
   * Review mathematical calculation inputs; verify all temporal and physical units are explicit in parameter names.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Identifiers strictly conform to domain glossary terms, with explicit unit suffixes on dimensional variables.
* **`FAIL`:** Multiple synonyms are used interchangeably for the same entity, or scalar physical/temporal variables lack explicit unit suffixes.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Vague, Inconsistent Naming Without Units)
```python
# Prohibited: Ambiguous abbreviations; unclear whether time is seconds or ms
def run_job(t: float, press: float, flag: bool) -> float:
    # Is `t` seconds? minutes? milliseconds? Is `press` PSI or Bar or Pascals?
    return press * t
```

#### ✅ Compliant Canonical Pattern (Ubiquitous Language with Explicit Units)
```python
# Compliant: Standard nomenclature with explicit SI units in parameter names
def compute_pressure_accumulation(
    duration_seconds: float,
    inlet_pressure_pascals: float,
    is_purge_valve_open: bool
) -> float:
    """Calculates accumulated pressure according to standard pneumatic fluid dynamics."""
    if duration_seconds < 0:
        raise ValueError(f"duration_seconds must be >= 0: received {duration_seconds}")
    if is_purge_valve_open:
        return 0.0
    return inlet_pressure_pascals * duration_seconds * 0.05
```

---
[⬅️ Back to Domain Terminology & Ubiquitous Language (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
