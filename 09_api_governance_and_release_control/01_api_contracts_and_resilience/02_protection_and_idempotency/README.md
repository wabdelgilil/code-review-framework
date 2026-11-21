# [API-01-02] Protection & Idempotency
## Level 3 Category Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-API] API Governance, Delivery & Execution (Level 1)](../../README.md) > [API Contracts & Resilience (Level 2)](../README.md) > **Protection & Idempotency (Level 3)**

---

### 🎯 Purpose & Scope
Prevent duplicate financial/operational writes under network retries or offline sync, and defend public, auth, search, and export endpoints against abuse and resource exhaustion.

---

### 📜 Governing Standards
IETF Draft `Idempotency-Key` HTTP Header; OWASP API4 (Unrestricted Resource Consumption).

---

### 📋 Level 4: Atomic Checkpoints Specification

| Checkpoint Code | Atomic Checkpoint Name | Classification | Verification Specification Link |
| :---: | :--- | :---: | :---: |
| `CHK-API-0103` | **Idempotency Keys for Critical Mutations** | `[MANDATORY]` | [📄 View Checkpoint Specification](./01_idempotency_keys_for_mutations.md) |
| `CHK-API-0104` | **Endpoint Rate Limiting & Throttling** | `[MANDATORY]` | [📄 View Checkpoint Specification](./02_endpoint_rate_limiting_and_throttling.md) |

---
[⬅️ Back to Sub-Pillar (Level 2)](../README.md) | [🏠 Back to Root Index](../../../README.md)
