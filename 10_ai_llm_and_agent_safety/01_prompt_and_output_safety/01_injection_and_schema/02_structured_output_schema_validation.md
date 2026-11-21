# [CHK-AI-0102] Structured Output Schema Validation
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-AI] AI/LLM Systems & Agent Safety (Level 1)](../../README.md) > [Prompt, Output & Privacy Safety (Level 2)](../README.md) > [Injection Defense, Schemas & PII Egress (Level 3)](./README.md) > **CHK-AI-0102 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-AI-0102` |
| **Sub-Pillar & Category** | Prompt, Output & Privacy Safety / Injection Defense, Schemas & PII Egress |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | OWASP Top 10 for LLM Applications (LLM05: Improper Output Handling) |
| **Target Entities** | LLM response parsers, agent tool argument handlers, AI-driven database/UI writers |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Every LLM output consumed programmatically (JSON payloads, classifications, tool arguments, SQL/query parameters) must be constrained via **native structured output / JSON Schema mode** AND **validated at runtime with a strict schema parser** (e.g., Zod, Pydantic) before any downstream use. Raw LLM text must never be passed into `eval()`, raw SQL, shell commands, or unsanitized `dangerouslySetInnerHTML`.
* **Engineering Rationale:** LLMs are probabilistic and routinely emit markdown code fences, extra keys, wrong types, or hallucinated enum values. Unvalidated LLM output causes runtime crashes, XSS vulnerabilities, and silent database corruption.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Unvalidated `JSON.parse` on LLM Output:** Strictly `0` programmatic LLM consumers relying on raw `JSON.parse` or regex extraction without strict schema validation.
* **Direct Execution of LLM Output:** Strictly `0` calls passing raw LLM output into `eval`, `exec`, or unsanitized HTML/SQL.

---

### 4. Step-by-Step Verification Protocol
1. **Parser Audit:**
   * Inspect every LLM invocation site; confirm structured outputs pass through `schema.safeParse()` / `Model.model_validate()` with bounded retry or deterministic error handling on failure.
2. **Malformed Output Unit Test:**
   * Mock the LLM provider returning truncated JSON, markdown-wrapped text, and invalid enum values; verify the service fails safely without crashing or mutating state.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All programmatic LLM outputs are strictly schema-validated at runtime with safe error/retry handling and zero unsafe execution sinks.
* **`FAIL`:** Application code trusts raw LLM strings, uses unvalidated `JSON.parse`, or renders/executes unescaped LLM output.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Trusting Raw LLM JSON)
```typescript
// Prohibited: Crashes on markdown fences or hallucinated priority values
const raw = await llm.complete(prompt);
const parsed = JSON.parse(raw);
await db.tickets.create({ data: { priority: parsed.priority, summary: parsed.summary } });
```

#### ✅ Compliant Canonical Pattern (Schema-Constrained Generation + Runtime Validation)
```typescript
// Compliant: Strict Zod contract verified before persistence
const TicketClassificationSchema = z.object({
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  summary: z.string().min(10).max(280),
  confidence: z.number().min(0).max(1),
});

const result = await generateObject({
  model,
  schema: TicketClassificationSchema,
  prompt,
});

const validated = TicketClassificationSchema.parse(result.object);
await db.tickets.create({ data: validated });
```

---
[⬅️ Back to Injection Defense, Schemas & PII Egress (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
