# [CHK-RES-0303] Persistent Operation Correlation ID
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-RES] Resilience, Error Handling & Security (Level 1)](../../../README.md) > [Structured Telemetry & Logging (Level 2)](../../README.md) > [Traceability & Correlation IDs (Level 3)](../README.md) > **CHK-RES-0303 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-RES-0303` |
| **Sub-Pillar & Category** | Structured Telemetry & Logging / Traceability & Correlation IDs |
| **Classification** | **`[BEST PRACTICE]`** |
| **Governing Standard** | W3C Trace Context Specification; OpenTelemetry Distributed Tracing; ISO/IEC 25010 (Analyzability) |
| **Target Entities** | Request context managers, task runners, transaction coordinators, log adapters |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Every incoming request, CLI execution, or background transaction must be assigned a **unique, immutable Correlation ID (UUID / traceparent)** generated at entry. This ID must be bound to the execution context (e.g. `AsyncLocalStorage`, Python `contextvars`, or thread-local storage) and automatically appended to **all** log lines, database queries, and downstream calls emitted during that operation.
* **Engineering Rationale:** In concurrent or multi-threaded systems where dozens of operations execute simultaneously, logs from different users interleave on stdout. Without a persistent Correlation ID, isolating the exact sequence of events for a single failed transaction is nearly impossible.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Log Lines Missing Correlation ID:** Strictly `0%` during active request/job execution.
* **ID Uniqueness:** Generated via UUIDv4 or W3C 128-bit trace ID standard (collision probability $\approx 0$).

---

### 4. Step-by-Step Verification Protocol
1. **Concurrent Request Log Filter Test:**
   * Fire 5 concurrent requests with distinct correlation IDs into the system.
   * Filter the log output by one specific correlation ID using `jq 'select(.correlation_id == "...")'`.
   * Verify that exactly the complete lifecycle for that single operation is extracted.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Every transaction carries a unique correlation ID that appears on all log messages emitted throughout its lifecycle.
* **`FAIL`:** Logs from concurrent operations lack correlation IDs, making single-transaction tracing impossible.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Uncorrelated Interleaved Logs)
```text
{"timestamp": "2026-11-01T22:00:00Z", "msg": "Starting payment"}
{"timestamp": "2026-11-01T22:00:01Z", "msg": "Starting payment"}
{"timestamp": "2026-11-01T22:00:02Z", "msg": "Payment failed: timeout"}
# Which user's payment failed? The logs cannot tell!
```

#### ✅ Compliant Canonical Pattern (Context-Bound Correlation ID)
```python
# Compliant: Using contextvars to propagate correlation ID across async calls
import contextvars
import uuid

correlation_id_ctx: contextvars.ContextVar[str] = contextvars.ContextVar("correlation_id", default="SYSTEM")

def execute_with_correlation(func, *args, **kwargs):
    req_id = str(uuid.uuid4())
    token = correlation_id_ctx.set(req_id)
    try:
        return func(*args, **kwargs)
    finally:
        correlation_id_ctx.reset(token)

def log_event(message: str) -> dict:
    return {
        "correlation_id": correlation_id_ctx.get(),
        "message": message
    }
```

---
[⬅️ Back to Traceability & Correlation IDs (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
