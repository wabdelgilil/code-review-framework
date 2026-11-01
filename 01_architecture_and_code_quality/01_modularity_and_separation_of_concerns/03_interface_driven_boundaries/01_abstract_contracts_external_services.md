# [CHK-ARCH-0105] Abstract Contracts for External Services
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../../README.md) > [Modularity & Separation of Concerns (Level 2)](../../README.md) > [Interface-Driven Boundaries (Level 3)](../README.md) > **CHK-ARCH-0105 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-ARCH-0105` |
| **Sub-Pillar & Category** | Modularity & Separation of Concerns / Interface-Driven Boundaries |
| **Classification** | **`[BEST PRACTICE]`** |
| **Governing Standard** | SOLID Interface Segregation & Dependency Inversion; ISO/IEC 25010 (Interoperability & Replaceability) |
| **Target Entities** | External API gateways, email dispatchers, telemetry collectors, filesystem access adapters |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Any interaction with external infrastructure (e.g. cloud services, message queues, storage systems, time providers) must be accessed through a cohesive abstract interface or protocol defined within the caller's boundary. Concrete implementations reside in adapter modules.
* **Engineering Rationale:** Binding code directly to concrete vendor SDKs (e.g., AWS S3 SDK, Twilio) creates severe vendor lock-in and makes automated unit testing impossible without live network access or brittle SDK mocking.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Direct Vendor SDK Calls in Domain/Application Services:** Strictly `0`.
* **Interface Cohesion:** Interfaces should contain only the minimal set of methods required by the calling client (Interface Segregation Principle).

---

### 4. Step-by-Step Verification Protocol
1. **Interface Contract Verification:**
   * Locate the calling service. Verify that its constructor or initializer accepts an abstract type (e.g. `NotificationSender`, `FileStorageGateway`) rather than a concrete third-party client.
2. **Mockability & Test Independence Test:**
   * Verify that a lightweight test double (mock or in-memory stub) can be passed to the calling service in a unit test without initializing external SDK credentials or connecting to network ports.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** External service dependencies are mediated through abstract interfaces, enabling trivial test stubbing and backend replacement.
* **`FAIL`:** Calling code instantiates or references concrete third-party SDK classes directly inside business orchestration paths.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Coupled to Concrete Vendor SDK)
```python
# Prohibited: Business service directly calls concrete third-party cloud SDK
import boto3  # Direct vendor lock-in

class ReportDeliveryService:
    def deliver_report(self, report_bytes: bytes, filename: str):
        # Directly invoking AWS S3 client inside business logic
        s3 = boto3.client("s3")
        s3.put_object(Bucket="company-reports", Key=filename, Body=report_bytes)
```

#### ✅ Compliant Canonical Pattern (Interface-Driven Port and Adapter)
```python
# Compliant: Abstract protocol defined by the application layer
from typing import Protocol

class BlobStorageGateway(Protocol):
    """Abstract contract decoupling business logic from concrete storage provider."""
    def save_file(self, filename: str, content: bytes) -> str:
        ...

class ReportDeliveryService:
    def __init__(self, storage: BlobStorageGateway):
        self._storage = storage

    def deliver_report(self, report_bytes: bytes, filename: str) -> str:
        return self._storage.save_file(filename, report_bytes)
```

---
[⬅️ Back to Interface-Driven Boundaries (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
