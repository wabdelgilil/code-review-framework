# [RES-03-01] Structured JSON Logging
## Level 3 Category Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-RES] Resilience, Error Handling & Security (Level 1)](../../README.md) > [Structured Telemetry & Logging (Level 2)](../README.md) > **Structured JSON Logging (Level 3)**

---

### 🎯 Purpose & Scope
Format application logs as machine-readable, structured JSON events emitted to stdout, and enforce automated masking of credentials, tokens, and PII.

---

### 📜 Governing Standards
Twelve-Factor App: Treat logs as event streams; OpenTelemetry Log Data Model; GDPR Article 32; PCI-DSS.

---

### 📋 Level 4: Atomic Checkpoints Specification

| Checkpoint Code | Atomic Checkpoint Name | Classification | Verification Specification Link |
| :---: | :--- | :---: | :---: |
| `CHK-RES-0301` | **Machine-Readable Structured Log Formats** | `[MANDATORY]` | [📄 View Checkpoint Specification](./01_machine_readable_log_formats.md) |
| `CHK-RES-0302` | **PII and Sensitive Data Masking** | `[MANDATORY]` | [📄 View Checkpoint Specification](./02_pii_sensitive_data_masking.md) |

---
[⬅️ Back to Sub-Pillar (Level 2)](../README.md) | [🏠 Back to Root Index](../../../README.md)
