# [CHK-ARCH-0106] Dependency Inversion & Constructor Injection
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../../README.md) > [Modularity & Separation of Concerns (Level 2)](../../README.md) > [Interface-Driven Boundaries (Level 3)](../README.md) > **CHK-ARCH-0106 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-ARCH-0106` |
| **Sub-Pillar & Category** | Modularity & Separation of Concerns / Interface-Driven Boundaries |
| **Classification** | **`[BEST PRACTICE]`** |
| **Governing Standard** | Dependency Inversion Principle (DIP); Inversion of Control (IoC); ISO/IEC 25010 Testability |
| **Target Entities** | Application services, workers, pipelines, repositories, orchestrators |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Classes and orchestrators must receive their dependencies from the outside via constructor injection or factory composition, rather than instantiating dependencies internally with `new` or `ClassName()`.
* **Engineering Rationale:** Hardcoded internal instantiation bonds components rigidly to specific implementations, prevents swapping components for testing or alternate execution profiles, and obscures the true dependencies of a class.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Hardcoded Concrete Instantiations in Service Constructors:** Strictly `0`.
* **Explicit Dependency Visibility:** All required collaborators must be visible in the class initializer signature.

---

### 4. Step-by-Step Verification Protocol
1. **Constructor Analysis:**
   * Review service and orchestrator constructors (`__init__`, `constructor`).
   * Verify that collaborator instances are received as typed arguments rather than created locally via concrete instantiations.
2. **Composition Root Verification:**
   * Verify that object graphs are wired together at a clear "Composition Root" (e.g. `main.py`, bootstrap module, or DI container), keeping business modules free of wiring code.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Collaborators are injected via constructor parameters; the class can be instantiated with mock or alternate collaborators without modifying its source code.
* **`FAIL`:** The class instantiates its own dependencies internally using concrete classes, preventing substitution.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Hardcoded Internal Instantiation)
```python
# Prohibited: Class creates its own concrete dependencies inside constructor
from infrastructure.database_client import PostgresClient
from infrastructure.email_client import SmtpClient

class UserRegistrationService:
    def __init__(self):
        # Hardcoded dependencies: impossible to test without real Postgres and SMTP!
        self.db = PostgresClient()
        self.mailer = SmtpClient()
```

#### ✅ Compliant Canonical Pattern (Constructor Injection)
```python
# Compliant: Collaborators injected via constructor
from typing import Protocol

class UserRepository(Protocol):
    def save(self, user_data: dict) -> None: ...

class NotificationService(Protocol):
    def notify(self, email: str, message: str) -> None: ...

class UserRegistrationService:
    def __init__(self, db: UserRepository, mailer: NotificationService):
        self._db = db
        self._mailer = mailer
```

---
[⬅️ Back to Interface-Driven Boundaries (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
