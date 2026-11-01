# [CHK-RES-0202] Rejection of Unknown or Extra Input Fields
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-RES] Resilience, Error Handling & Security (Level 1)](../../../README.md) > [Input Boundary Validation (Level 2)](../../README.md) > [Schema & Type Enforcement (Level 3)](../README.md) > **CHK-RES-0202 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-RES-0202` |
| **Sub-Pillar & Category** | Input Boundary Validation / Schema & Type Enforcement |
| **Classification** | **`[BEST PRACTICE]`** |
| **Governing Standard** | OWASP Top 10: Mass Assignment Prevention; CWE-915 (Improperly Controlled Modification of Dynamically Determined Object Attributes) |
| **Target Entities** | Ingress models, JSON deserializers, request parsers |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Ingress data schemas should be configured to **strictly reject (`extra="forbid"`) or silently strip any unrecognized, superfluous fields** in incoming payloads. Clients submitting undocumented fields must receive a validation error.
* **Engineering Rationale:** Accepting arbitrary unknown fields exposes the system to Mass Assignment / Parameter Tampering vulnerabilities, where an attacker injects fields like `is_admin: true` or `role: "superuser"` into an update payload that an unconstrained model binds directly to internal state.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Mass Assignment Exposure:** Strictly `0` domain models that bind raw untrusted dictionaries directly to internal state attributes.
* **Strict Schema Configuration:** `100%` of ingress DTO schemas must have explicit extra field handling policies defined.

---

### 4. Step-by-Step Verification Protocol
1. **Extra Field Payload Injection:**
   * Send a test request containing a valid payload plus an unexpected field: `{"valid_param": 10, "injected_evil_field": "exploit"}`.
2. **Rejection Verification:**
   * Verify the boundary parser rejects the payload with HTTP 422 / validation exception or strips the field completely from the parsed DTO.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Ingress schemas reject or strictly strip unrecognized fields; mass assignment into domain entities is impossible.
* **`FAIL`:** The system dynamically copies arbitrary unvalidated request keys into internal domain attributes.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Vulnerable Dynamic Kwarg Binding)
```python
# Prohibited: Binds all arbitrary incoming dictionary keys to object attributes!
class User:
    def __init__(self, **kwargs):
        # Attacker sends {"is_admin": True} and becomes admin immediately!
        for k, v in kwargs.items():
            setattr(self, k, v)
```

#### ✅ Compliant Canonical Pattern (Strict Forbidden Extra Fields Schema)
```python
# Compliant: Schema strictly forbids extra unrecognized attributes
from pydantic import BaseModel, ConfigDict, Field

class UserProfileUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")  # Rejects unknown keys!

    display_name: str = Field(min_length=1, max_length=50)
    bio: str | None = Field(default=None, max_length=500)
```

---
[⬅️ Back to Schema & Type Enforcement (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
