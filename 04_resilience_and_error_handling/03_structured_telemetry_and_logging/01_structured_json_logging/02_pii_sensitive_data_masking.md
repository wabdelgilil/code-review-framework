# [CHK-RES-0302] PII and Sensitive Data Masking in Telemetry
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-RES] Resilience, Error Handling & Security (Level 1)](../../../README.md) > [Structured Telemetry & Logging (Level 2)](../../README.md) > [Structured JSON Logging (Level 3)](../README.md) > **CHK-RES-0302 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-RES-0302` |
| **Sub-Pillar & Category** | Structured Telemetry & Logging / Structured JSON Logging |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | GDPR Article 32; PCI-DSS Requirement 3; HIPAA Privacy Rule; OWASP Logging Cheat Sheet |
| **Target Entities** | Log formatters, error traces, HTTP payload logging, debug utilities |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Application logs, stack traces, and telemetry events must **never output plain-text credentials, passwords, API tokens, authorization headers, credit card numbers, or Personally Identifiable Information (PII)**. All sensitive keys must be automatically masked, redacted, or omitted prior to serialization.
* **Engineering Rationale:** Application logs are widely accessible across engineering teams, ingested into third-party cloud aggregators, and often stored in unencrypted log backups. Leaking passwords or API tokens into logs immediately compromises production security.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Plaintext Secrets in Logs:** Strictly `0` tokens, passwords, or private keys emitted.
* **Redaction Policy:** Any field named `password`, `secret`, `token`, `authorization`, `credit_card`, `ssn` must be replaced with `[REDACTED]`.

---

### 4. Step-by-Step Verification Protocol
1. **Automated Secret Scanning in Test Logs:**
   * Run the test suite with log capture enabled.
   * Run secret scanners (e.g. `trufflehog`, `gitleaks`) on the generated log output files.
2. **Payload Redaction Test:**
   * Feed a mock authentication request into the logger; verify that the output JSON replaces the password field with `[REDACTED]`.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All sensitive credentials and PII are redacted automatically before log emission.
* **`FAIL`:** Any plain-text password, authorization token, or sensitive PII field is printed or logged.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Logging Entire Request Body with Password)
```python
# Prohibited: Dumps entire raw payload into logs, leaking cleartext password!
def handle_login(payload: dict):
    # Logs password in plaintext to central log server!
    logger.info(f"Login attempt: {payload}")
```

#### ✅ Compliant Canonical Pattern (Defensive Redaction Filter)
```python
# Compliant: Log sanitizer redacts sensitive fields automatically
SENSITIVE_KEYS = {"password", "secret", "token", "authorization", "api_key"}

def sanitize_for_logging(data: dict) -> dict:
    sanitized = {}
    for key, value in data.items():
        if key.lower() in SENSITIVE_KEYS:
            sanitized[key] = "[REDACTED]"
        elif isinstance(value, dict):
            sanitized[key] = sanitize_for_logging(value)
        else:
            sanitized[key] = value
    return sanitized
```

---
[⬅️ Back to Structured JSON Logging (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
