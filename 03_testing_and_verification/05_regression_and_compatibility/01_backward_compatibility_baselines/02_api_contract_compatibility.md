# [CHK-TEST-0502] API Contract & Signature Compatibility
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-TEST] Testing & Verification Suite (Level 1)](../../../README.md) > [Regression & Backward Compatibility (Level 2)](../../README.md) > [Backward Compatibility Baselines (Level 3)](../README.md) > **CHK-TEST-0502 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-TEST-0502` |
| **Sub-Pillar & Category** | Regression & Backward Compatibility / Backward Compatibility Baselines |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Semantic Versioning (SemVer 2.0.0 Clause 6-8); ISO/IEC 25010 (Interoperability) |
| **Target Entities** | Public interfaces, exported SDK functions, library APIs, CLI flags |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** In minor and patch releases ($x.Y.z$), public API signatures, method names, parameter order, and return structures must remain strictly **backward-compatible**. Adding mandatory positional parameters or renaming existing methods without deprecation warnings is strictly forbidden.
* **Engineering Rationale:** Breaking public API contracts without major version bumps causes downstream client applications to crash immediately upon library update.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Breaking Changes in Minor/Patch Releases:** Strictly `0` breaking changes to public signatures.
* **Deprecation Notice Horizon:** Any method scheduled for removal must emit a formal runtime deprecation warning for at least `1` full minor release cycle prior to deletion.

---

### 4. Step-by-Step Verification Protocol
1. **API Signature Diffing:**
   * Run automated API boundary diffing tools (e.g. `api-extractor`, `griffe`, or `cargo-semver-checks`):
     ```bash
     # Verify public API surface against previous release tag
     griffe dump src/ -o current_api.json
     ```
2. **Deprecation Warning Verification:**
   * Verify that calling deprecated methods issues a `DeprecationWarning` rather than throwing `AttributeError`.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Public method signatures maintain full backward compatibility; all new parameters are optional with sane defaults.
* **`FAIL`:** A public method changes its parameter order, removes an existing parameter, or introduces an unbackwards-compatible return type in a non-major release.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Breaking Existing Public Method Signature)
```python
# Prohibited: Adding a mandatory positional parameter breaks all existing callers!
# Version 1.0: def send_notification(recipient: str, message: str)
# Version 1.1 BREAKING CHANGE:
def send_notification(priority: int, recipient: str, message: str):
    # Existing client code calling send_notification("user@test.com", "hello")
    # now passes string into priority -> CRASHES!
    pass
```

#### ✅ Compliant Canonical Pattern (Non-Breaking Signature Evolution)
```python
# Compliant: New parameter appended as optional keyword argument with default
DEFAULT_PRIORITY: int = 2

def send_notification(
    recipient: str,
    message: str,
    priority: int = DEFAULT_PRIORITY  # Backward compatible! Existing callers unaffected
) -> bool:
    """Sends notification with non-breaking parameter addition."""
    return True
```

---
[⬅️ Back to Backward Compatibility Baselines (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
