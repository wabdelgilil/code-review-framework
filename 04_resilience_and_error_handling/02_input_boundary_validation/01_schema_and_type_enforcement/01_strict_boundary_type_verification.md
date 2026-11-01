# [CHK-RES-0201] Strict Boundary Type Verification
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-RES] Resilience, Error Handling & Security (Level 1)](../../../README.md) > [Input Boundary Validation (Level 2)](../../README.md) > [Schema & Type Enforcement (Level 3)](../README.md) > **CHK-RES-0201 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-RES-0201` |
| **Sub-Pillar & Category** | Input Boundary Validation / Schema & Type Enforcement |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | OWASP Input Validation Cheat Sheet; Parse, Don't Validate Pattern (Alexis King); ISO/IEC 25010 |
| **Target Entities** | Ingress endpoints, CLI argument parsers, webhook consumers, file loaders |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** All untrusted external data (HTTP payloads, CLI strings, CSV files, environment variables) must be **immediately parsed and validated into strongly typed domain models or data transfer objects (DTOs) at the system boundary**. Raw, unvalidated dictionaries, maps, or generic strings must never be passed into internal services.
* **Engineering Rationale:** Adopting "Parse, Don't Validate" ensures that once data crosses the system ingress boundary, internal domain modules can safely assume the data is completely valid, eliminating defensive null checks and repetitive parsing scattered across the entire codebase.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Unvalidated Ingress Payloads Passed to Domain:** Strictly `0`.
* **Type Safety Coverage:** `100%` of ingress fields must be coerced into explicit primitive or composite types (int, float, datetime, enum, boolean).

---

### 4. Step-by-Step Verification Protocol
1. **Entry Point Schema Audit:**
   * Review all ingress handlers. Confirm that an explicit schema validator (e.g. `Pydantic`, `Zod`, `serde`, or JSON Schema) parses raw request data before domain logic is called.
2. **Type Coercion Stress Test:**
   * Send strings for integer fields (e.g. `"amount": "not_a_number"`); confirm the schema validator rejects the request at the boundary with HTTP 400 / Exit Code 1.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** External inputs are strictly parsed into validated, strongly typed objects before reaching domain components.
* **`FAIL`:** Domain functions receive raw untyped dictionaries, unstructured JSON, or unvalidated string maps directly.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Passing Raw Dictionary into Domain Logic)
```python
# Prohibited: Raw unvalidated dict passed directly into business logic
def process_order_request(raw_payload: dict):
    # If "customer_id" is missing or "qty" is negative, crashes deep in domain!
    order = Order(raw_payload["customer_id"], raw_payload["qty"])
```

#### ✅ Compliant Canonical Pattern (Parse, Don't Validate at Boundary)
```python
# Compliant: Boundary validation parsing raw input into strongly typed schema
from dataclasses import dataclass

@dataclass(frozen=True)
class CreateOrderRequest:
    customer_id: str
    quantity: int

    @classmethod
    def from_raw(cls, payload: dict) -> "CreateOrderRequest":
        if "customer_id" not in payload or not isinstance(payload["customer_id"], str):
            raise ValueError("customer_id must be a non-empty string")
        if "quantity" not in payload or not isinstance(payload["quantity"], int) or payload["quantity"] <= 0:
            raise ValueError("quantity must be a positive integer")
        return cls(customer_id=payload["customer_id"], quantity=payload["quantity"])
```

---
[⬅️ Back to Schema & Type Enforcement (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
