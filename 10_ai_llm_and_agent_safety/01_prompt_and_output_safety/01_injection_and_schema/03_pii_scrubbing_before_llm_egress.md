# [CHK-AI-0103] PII Scrubbing Before LLM Egress
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-AI] AI/LLM Systems & Agent Safety (Level 1)](../../README.md) > [Prompt, Output & Privacy Safety (Level 2)](../README.md) > [Injection Defense, Schemas & PII Egress (Level 3)](./README.md) > **CHK-AI-0103 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-AI-0103` |
| **Sub-Pillar & Category** | Prompt, Output & Privacy Safety / Injection Defense, Schemas & PII Egress |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | OWASP LLM02 (Sensitive Information Disclosure); Saudi PDPL; EU GDPR (Art. 5, 28) |
| **Target Entities** | LLM gateway middleware, prompt pre-processors, RAG indexing pipelines, external model provider configs |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Before transmitting prompts, documents, or logs to any external third-party LLM provider, an automated **PII/Secret Scrubbing layer** must strip or pseudonymize sensitive identifiers (national IDs, emails, phone numbers, IBANs, credentials, API keys). External inference providers must be configured with **zero-data-retention / zero-training agreements** verified in vendor config.
* **Engineering Rationale:** Sending unredacted customer PII or internal secrets to external model APIs violates PDPL/GDPR data-transfer obligations and risks permanent exposure in vendor logs or future model weights.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Unredacted PII in Outbound LLM Payloads:** Strictly `0` raw emails, national IDs, credit card numbers, or bearer tokens transmitted to external LLM endpoints in automated redaction tests.
* **Data-Minimization Scope:** Only fields strictly necessary for inference are serialized into prompts (never full `SELECT *` user records).

---

### 4. Step-by-Step Verification Protocol
1. **Egress Middleware Inspection:**
   * Verify all outbound LLM calls route through a centralized gateway/adapter applying PII redaction and secret scrubbing.
2. **Redaction Unit Test:**
   * Pass sample strings containing emails, phone numbers, national IDs, and JWTs through the prompt pre-processor and assert all sensitive tokens are replaced with deterministic placeholders (`[EMAIL_1]`, `[REDACTED_SECRET]`).

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All outbound LLM traffic passes through automated PII/secret redaction with field minimization and verified zero-training provider configuration.
* **`FAIL`:** Raw database rows containing PII or credentials are serialized directly into external LLM API calls.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Raw PII Sent to External LLM)
```typescript
// Prohibited: Transmits customer national ID, email, and phone directly to external API
const prompt = `Summarize complaint from ${JSON.stringify(customerRecord)}: ${ticket.body}`;
await externalLlm.generate(prompt);
```

#### ✅ Compliant Canonical Pattern (Field Minimization + Automated PII Redaction)
```typescript
// Compliant: Minimize fields and scrub PII/secrets before external egress
const sanitizedBody = piiScrubber.redact(ticket.body);
const prompt = `Summarize support issue for ticket #${ticket.code}:\n${sanitizedBody}`;
await llmGateway.generate({ prompt, zeroRetention: true });
```

---
[⬅️ Back to Injection Defense, Schemas & PII Egress (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
