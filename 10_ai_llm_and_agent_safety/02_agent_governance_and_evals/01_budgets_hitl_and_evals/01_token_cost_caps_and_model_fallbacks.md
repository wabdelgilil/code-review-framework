# [CHK-AI-0201] Token/Cost Caps & Model Fallbacks
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-AI] AI/LLM Systems & Agent Safety (Level 1)](../../README.md) > [Agent Governance & Evals (Level 2)](../README.md) > [Budgets, HITL Gates & Automated Evals (Level 3)](./README.md) > **CHK-AI-0201 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-AI-0201` |
| **Sub-Pillar & Category** | Agent Governance & Evals / Budgets, HITL Gates & Automated Evals |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | OWASP LLM10 (Unbounded Consumption); FinOps for AI Workloads |
| **Target Entities** | LLM gateways, agent execution loops, per-tenant quota managers, model routing configs |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Every LLM invocation and autonomous agent run must enforce explicit **maximum input/output token caps (`maxTokens`)**, **maximum agent step limits (`maxSteps`)**, **per-request timeouts**, and **per-tenant daily/monthly spend quotas**. Production AI gateways must configure **automated fallback models/providers** (or graceful deterministic degradation) when the primary provider returns `429` or `5xx`.
* **Engineering Rationale:** An unbounded agent loop retrying a failing tool call can burn thousands of dollars in API tokens in minutes and exhaust rate limits for every other tenant.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Unbounded Agent Loops:** Strictly `0` agent loops lacking an explicit `maxSteps` ceiling (e.g., $\le 10\text{–}20$ steps) and `maxTokens` limit.
* **Quota Enforcement:** `100%` of tenant LLM calls meter token usage and fail fast with HTTP `429` / `402` once budget ceilings are reached.

---

### 4. Step-by-Step Verification Protocol
1. **Configuration Audit:**
   * Inspect all LLM client calls for explicit `maxTokens`, `timeoutMs`, and `maxSteps` bounds.
2. **Failover & Budget Simulation Test:**
   * Simulate a primary provider `503` error and verify automatic routing to the configured fallback model; simulate an exhausted tenant token quota and verify immediate rejection before calling the upstream provider.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All LLM/agent calls enforce explicit token, step, timeout, and tenant-cost caps with automated fallback routing.
* **`FAIL`:** Agent loops run without step limits, calls omit `maxTokens`/timeouts, or no spend quota/fallback exists.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Infinite Agent Loop & Unbounded Tokens)
```typescript
// Prohibited: No maxSteps, no maxTokens, no timeout, no fallback
while (!done) {
  const res = await openai.chat.completions.create({ model: 'gpt-4o', messages });
  // Loops indefinitely if tool returns an error
}
```

#### ✅ Compliant Canonical Pattern (Bounded Steps, Token Caps, Quota & Fallback)
```typescript
// Compliant: Strict step cap, token limit, tenant quota check, and fallback chain
await tenantQuota.assertWithinBudget(ctx.tenantId);

const result = await aiGateway.runAgent({
  models: ['primary-model', 'fallback-model'],
  maxSteps: 8,
  maxOutputTokens: 1_500,
  timeoutMs: 25_000,
  messages,
});

await tenantQuota.recordUsage(ctx.tenantId, result.usage.totalTokens);
```

---
[⬅️ Back to Budgets, HITL Gates & Automated Evals (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
