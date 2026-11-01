# [CHK-RES-0203] Numeric Range and String Length Validation
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-RES] Resilience, Error Handling & Security (Level 1)](../../../README.md) > [Input Boundary Validation (Level 2)](../../README.md) > [Sanitization & Range Clamping (Level 3)](../README.md) > **CHK-RES-0203 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-RES-0203` |
| **Sub-Pillar & Category** | Input Boundary Validation / Sanitization & Range Clamping |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | CWE-1287 (Improper Validation of Input Range); CWE-400 (Uncontrolled Resource Consumption); OWASP Top 10 |
| **Target Entities** | Ingress validation schemas, parameter binders, collection size counters |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Every scalar input (string, integer, float, collection) must enforce explicit **minimum and maximum bounds**. Strings must have maximum lengths, collections must have maximum item caps, and numbers must be bounded to valid physical/business domains.
* **Engineering Rationale:** Unbounded strings (e.g. sending a 50MB string into a `username` field) cause memory exhaustion (Denial of Service), while unbounded numbers cause database integer overflow crashes or invalid domain calculations.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Unbounded String Inputs:** Strictly `0`. All string ingress fields must declare `max_length`.
* **Unbounded Collection Inputs:** Strictly `0`. Arrays/lists must declare maximum allowed item counts (e.g. `max_items=1000`).

---

### 4. Step-by-Step Verification Protocol
1. **Schema Range Verification:**
   * Review all ingress models. Confirm every field has explicit bounds (e.g. `gt=0`, `le=1000`, `max_length=255`).
2. **Payload Flooding Stress Test:**
   * Send a payload with a 10MB string to a text endpoint; verify immediate rejection by the boundary validator before allocation in memory.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All numerical and string inputs have documented and enforced maximum bounds.
* **`FAIL`:** Any ingress field permits unbounded string lengths, negative numbers where prohibited, or uncapped array sizes.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Unbounded Input Allocations)
```python
# Prohibited: String length is unbounded; susceptible to ReDoS and memory exhaustion
def register_comment(comment: str):
    # What if comment is 100MB of whitespace? Memory exhausts immediately!
    db.save(comment)
```

#### ✅ Compliant Canonical Pattern (Strict Upper and Lower Bounds)
```python
# Compliant: Explicitly bounded length and whitespace stripping
MAX_COMMENT_LENGTH: int = 2000

def register_comment(comment: str) -> None:
    if not isinstance(comment, str):
        raise TypeError("Comment must be a string")
    sanitized = comment.strip()
    if len(sanitized) == 0:
        raise ValueError("Comment cannot be empty")
    if len(sanitized) > MAX_COMMENT_LENGTH:
        raise ValueError(f"Comment exceeds maximum allowed length of {MAX_COMMENT_LENGTH} characters")
    db.save(sanitized)
```

---
[⬅️ Back to Sanitization & Range Clamping (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
