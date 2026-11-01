# [CHK-UX-0301] Three-Part Actionable Error Diagnostics
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-UX] Documentation, DX & Operations (Level 1)](../../../README.md) > [User Diagnostics & Feedback (Level 2)](../../README.md) > [Actionable Error Messages (Level 3)](../README.md) > **CHK-UX-0301 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-UX-0301` |
| **Sub-Pillar & Category** | User Diagnostics & Feedback / Actionable Error Messages |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Nielsen Norman Group: Error Message Guidelines; Rust Compiler Diagnostic Pattern; ISO/IEC 25010 |
| **Target Entities** | User-facing exceptions, CLI error formatters, API error responses |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Any error message surfaced to users or developers must follow the **Three-Part Actionable Diagnostic Format**:
  1. **What failed:** An objective description of the failed action.
  2. **Why it failed:** The exact cause and the offending input value or missing resource.
  3. **How to fix it:** A concrete, actionable recommendation or command to resolve the failure.
  Vague error messages like "An error occurred" or "Invalid input" are strictly prohibited.
* **Engineering Rationale:** Unclear error messages force users and developers into prolonged debugging sessions trying to guess which parameter or file was rejected. Actionable messages resolve issues immediately at the point of failure.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Three-Part Format Adherence:** `100%` of user-facing error messages must contain: (1) Failed Action, (2) Root Cause with context, and (3) Concrete Remediation Step.
* **Generic Error Ban:** Strictly `0` instances of bare generic errors ("Something went wrong", "Failed to parse").

---

### 4. Step-by-Step Verification Protocol
1. **Error Output Message Audit:**
   * Review all user-facing exception templates and error formatters.
   * Confirm that each error provides specific context and fix recommendations.
2. **Failure Simulation:**
   * Trigger deliberate errors (e.g. missing config file, invalid argument); verify the output guides the user on how to fix it.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All error messages state what failed, why, and provide concrete resolution steps.
* **`FAIL`:** The system emits vague errors without context or fails to instruct the user on how to resolve the problem.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Vague, Cryptic Error Message)
```text
Error: Failed to process config file.
<!-- Which config file? What was wrong with it? How do I fix it? Zero clues! -->
```

#### ✅ Compliant Canonical Pattern (Three-Part Actionable Diagnostic Format)
```text
ERROR: Could not load project configuration.
CAUSE: The configuration file at '/app/config.json' is missing the mandatory 'api_port' key on line 12.
REMEDY: Add '"api_port": 8080' to '/app/config.json' or set the PORT environment variable.
```

---
[⬅️ Back to Actionable Error Messages (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
