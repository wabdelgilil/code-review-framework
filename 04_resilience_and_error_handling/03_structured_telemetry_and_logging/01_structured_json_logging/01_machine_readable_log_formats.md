# [CHK-RES-0301] Machine-Readable Structured Log Formats
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-RES] Resilience, Error Handling & Security (Level 1)](../../../README.md) > [Structured Telemetry & Logging (Level 2)](../../README.md) > [Structured JSON Logging (Level 3)](../README.md) > **CHK-RES-0301 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-RES-0301` |
| **Sub-Pillar & Category** | Structured Telemetry & Logging / Structured JSON Logging |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Twelve-Factor App (Logs as Event Streams); OpenTelemetry Log Data Model; ISO/IEC 25010 (Operability) |
| **Target Entities** | Logging formatters, stdout streams, telemetry collectors, diagnostic loggers |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** In production environments, log messages must be emitted as **structured, machine-readable JSON lines (ndjson / JSON Lines) to standard output (`stdout`)**. Unstructured raw string formatting (e.g. `print("User logged in: " + user)` or plain text strings) is strictly prohibited.
* **Engineering Rationale:** Modern cloud logging systems (Datadog, Elastic, CloudWatch, Loki) ingest and index JSON logs automatically. Plain string logs require fragile regex parsers to extract timestamps, error codes, and request IDs, slowing incident investigations.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Unstructured Log Lines:** Strictly `0` non-JSON lines emitted to stdout in production logging mode.
* **Standard Key Presence:** `100%` of log events must include: `timestamp` (ISO 8601 UTC), `level` (INFO, WARN, ERROR), `message`, and `logger_name`.

---

### 4. Step-by-Step Verification Protocol
1. **Log Stream Parsing Audit:**
   * Run the application emitting log messages.
   * Pipe output to a JSON parser (`jq .`); confirm 100% of lines parse validly as single JSON objects.
2. **Standard Field Validation:**
   * Confirm that fields like `timestamp`, `level`, and `correlation_id` are top-level JSON keys.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All log events are emitted as valid JSON objects containing mandatory standardized metadata fields.
* **`FAIL`:** The application emits raw unformatted print statements or non-JSON text lines in production logging mode.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Unstructured Raw String Print)
```python
# Prohibited: Raw string logging - unsearchable in modern log aggregation systems!
def on_user_login(user_id: str):
    print(f"[INFO] 2026-11-01 User {user_id} logged in from 192.168.1.1")
```

#### ✅ Compliant Canonical Pattern (Structured JSON Log Event)
```python
# Compliant: Emits structured machine-parsable JSON
import json
import sys
from datetime import datetime, timezone

def emit_structured_log(level: str, message: str, **context) -> None:
    event = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "level": level.upper(),
        "message": message,
        **context
    }
    sys.stdout.write(json.dumps(event) + "\n")
    sys.stdout.flush()

# Usage:
emit_structured_log("INFO", "User authentication successful", user_id="usr_123", ip_address="192.168.1.1")
```

---
[⬅️ Back to Structured JSON Logging (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
