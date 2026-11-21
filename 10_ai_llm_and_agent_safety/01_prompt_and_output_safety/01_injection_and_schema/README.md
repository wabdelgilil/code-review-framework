# [AI-01-01] Injection Defense, Schemas & PII Egress
## Level 3 Category Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-AI] AI/LLM Systems & Agent Safety (Level 1)](../../README.md) > [Prompt, Output & Privacy Safety (Level 2)](../README.md) > **Injection Defense, Schemas & PII Egress (Level 3)**

---

### 🎯 Purpose & Scope
Prevent indirect prompt injection, unvalidated LLM JSON crashes, and unauthorized personal data leakage to third-party inference providers.

---

### 📜 Governing Standards
OWASP Top 10 for LLM Applications (LLM01, LLM02, LLM05); NIST AI Risk Management Framework (AI RMF 1.0).

---

### 📋 Level 4: Atomic Checkpoints Specification

| Checkpoint Code | Atomic Checkpoint Name | Classification | Verification Specification Link |
| :---: | :--- | :---: | :---: |
| `CHK-AI-0101` | **Prompt Injection & Boundary Isolation** | `[MANDATORY]` | [📄 View Checkpoint Specification](./01_prompt_injection_and_boundary_isolation.md) |
| `CHK-AI-0102` | **Structured Output Schema Validation** | `[MANDATORY]` | [📄 View Checkpoint Specification](./02_structured_output_schema_validation.md) |
| `CHK-AI-0103` | **PII Scrubbing Before LLM Egress** | `[MANDATORY]` | [📄 View Checkpoint Specification](./03_pii_scrubbing_before_llm_egress.md) |

---
[⬅️ Back to Sub-Pillar (Level 2)](../README.md) | [🏠 Back to Root Index](../../../README.md)
