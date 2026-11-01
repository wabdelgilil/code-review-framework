# [CHK-ARCH-0301] Adapter Wrapper for External Libraries
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../../README.md) > [Dependency Management & Coupling (Level 2)](../../README.md) > [Third-Party Dependency Isolation (Level 3)](../README.md) > **CHK-ARCH-0301 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-ARCH-0301` |
| **Sub-Pillar & Category** | Dependency Management & Coupling / Third-Party Dependency Isolation |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | GoF Adapter Pattern; ISO/IEC 25010 (Replaceability & Modifiability); Twelve-Factor App |
| **Target Entities** | Third-party utility libraries, cryptographic libraries, serializers, HTTP clients |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Third-party libraries (external open-source or proprietary packages) must never be imported directly across business logic. They must be encapsulated behind internal adapter classes or wrapper modules.
* **Engineering Rationale:** If a third-party library introduces breaking API changes in a major version, ceases maintenance, or is found to contain a severe vulnerability (CVE), having 50 direct imports across the codebase requires massive risky refactoring. An internal adapter confines changes to a single translation file.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Direct External Package Usage Outside Adapters:** Strictly `0` non-standard library external imports in domain or application service modules.
* **Adapter Blast Radius:** Swapping an external vendor library for an alternative must touch $\le 1$ adapter module file in the codebase.

---

### 4. Step-by-Step Verification Protocol
1. **Dependency Infiltration Grep:**
   * Run a static check comparing third-party package names listed in `package.json`, `requirements.txt`, or `Cargo.toml` against imports in `src/domain/` or `src/core/`.
   * Any direct import outside `src/infrastructure/adapters/` fails the check.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** External libraries are strictly imported within designated adapter modules; application code consumes only in-house adapter interfaces.
* **`FAIL`:** Third-party package imports are scattered directly throughout domain and business services.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Scattered External Library Usage)
```python
# Prohibited: Multiple business files directly import external 'requests' library
import requests  # Vendor lock-in directly in business service

class PaymentService:
    def charge(self, amount: float):
        resp = requests.post("https://payment.example.com/charge", json={"amt": amount})
        return resp.json()
```

#### ✅ Compliant Canonical Pattern (Encapsulated Adapter Wrapper)
```python
# Compliant: Adapter module wraps the external client behind an internal interface

# File: infrastructure/adapters/http_client.py
import requests
from typing import Any

class HttpAdapter:
    """Sole module in repository permitted to import 'requests'."""
    def post_json(self, url: str, payload: dict[str, Any]) -> dict[str, Any]:
        response = requests.post(url, json=payload, timeout=10)
        response.raise_for_status()
        return response.json()
```

---
[⬅️ Back to Third-Party Dependency Isolation (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
