# [CHK-RES-0104] Preservation of Root Cause Chaining
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-RES] Resilience, Error Handling & Security (Level 1)](../../../README.md) > [Fail-Fast & Exception Handling (Level 2)](../../README.md) > [Exception Hierarchy & Propagation (Level 3)](../README.md) > **CHK-RES-0104 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-RES-0104` |
| **Sub-Pillar & Category** | Fail-Fast & Exception Handling / Exception Hierarchy & Propagation |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | PEP 3134 (Exception Chaining); Java Chained Exceptions (JDK 1.4+); ISO/IEC 25010 (Analyzability) |
| **Target Entities** | Exception translation layers, adapter catch blocks, gateway proxies |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** When translating a low-level technical exception (e.g. `psycopg2.OperationalError` or `socket.timeout`) into a high-level domain exception (e.g. `DatabaseUnavailableError`), the **original exception and stack trace must be explicitly preserved** using language chaining mechanisms (`raise DomainError(...) from err` or `new DomainError(msg, cause)`).
* **Engineering Rationale:** Discarding the underlying cause during exception translation destroys the original stack trace and error message, leaving engineers with only a generic domain message and zero visibility into the exact network socket, query syntax, or host failure that caused the problem.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Severed Exception Chains:** Strictly `0` exception re-throws that discard original lower-level exceptions.
* **Stack Trace Preservation:** `100%` of translated exceptions must retain access to `__cause__` or `.cause`.

---

### 4. Step-by-Step Verification Protocol
1. **Exception Translation Grep:**
   * Scan for catch-and-raise blocks in adapter modules:
     ```bash
     # Check for `raise DomainError` without `from err` in Python
     grep -rn -A 3 "except " src/infrastructure/ | grep "raise "
     ```
2. **StackTrace Diagnostic Audit:**
   * Trigger an underlying network timeout; verify that the printed traceback contains both the domain exception AND the original causal socket exception.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All translated exceptions explicitly chain the original cause, preserving full stack trace diagnostics.
* **`FAIL`:** Any catch block instantiates and raises a new exception without attaching or referencing the caught lower-level exception.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Severed Root Cause Traceback)
```python
# Prohibited: Drops original error and stack trace!
try:
    socket.connect(("10.0.0.1", 5432))
except socket.error as err:
    # Original socket error, IP, and line number are LOST forever!
    raise ConnectionFailedError("Could not connect to database")
```

#### ✅ Compliant Canonical Pattern (Explicit Root Cause Chaining)
```python
# Compliant: Uses `from err` to preserve full causal traceback
try:
    socket.connect(("10.0.0.1", 5432))
except socket.error as err:
    raise ConnectionFailedError("Could not connect to database") from err
```

---
[⬅️ Back to Exception Hierarchy & Propagation (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
