# [CHK-AI-0203] Automated Golden Eval Regression Gates
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-AI] AI/LLM Systems & Agent Safety (Level 1)](../../README.md) > [Agent Governance & Evals (Level 2)](../README.md) > [Budgets, HITL Gates & Automated Evals (Level 3)](./README.md) > **CHK-AI-0203 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-AI-0203` |
| **Sub-Pillar & Category** | Agent Governance & Evals / Budgets, HITL Gates & Automated Evals |
| **Classification** | **`[BEST PRACTICE]`** |
| **Governing Standard** | NIST AI RMF (Measure & Manage); Evidence-Based LLM Evaluation Practices |
| **Target Entities** | System prompts, RAG retrieval pipelines, model version upgrades, agent tool definitions |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Any modification to production system prompts, RAG chunking/retrieval parameters, tool schemas, or underlying LLM model versions must be gated by an **automated Golden Evaluation Suite** measuring objective metrics (schema validity rate, tool-selection accuracy, groundedness/faithfulness, refusal accuracy on adversarial prompts, and latency) against a version-controlled benchmark dataset.
* **Engineering Rationale:** Changing a single sentence in a system prompt or upgrading a model snapshot can silently degrade edge-case accuracy or break tool calling. "Vibe-checking" two manual prompts is insufficient for production AI systems.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Golden Dataset Size:** Minimum $\ge 25\text{–}50$ curated real-world + adversarial edge-case examples per critical AI workflow.
* **Regression Tolerance:** Zero drop in schema validity (`100%` required) and $\le 2\%$ tolerance on groundedness/accuracy metrics before merge approval.

---

### 4. Step-by-Step Verification Protocol
1. **Eval Dataset Inspection:**
   * Confirm version-controlled golden eval datasets and grading rubrics exist under `evals/` alongside the prompt templates.
2. **CI Gate Execution:**
   * Run the eval suite on PRs modifying `prompts/` or model configuration and verify pass/fail threshold enforcement.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Prompt, RAG, and model changes are evaluated against a versioned golden dataset with explicit minimum accuracy, schema, and safety thresholds.
* **`FAIL`:** Prompts or models are modified directly in production based solely on ad-hoc manual chat checks with zero automated eval coverage.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Unverified Prompt Edits in Production)
```text
Commit: "tweaked system prompt to sound friendlier"
- Zero eval cases executed
- Accidentally broke JSON tool-calling on 18% of Arabic support tickets
```

#### ✅ Compliant Canonical Pattern (Versioned Prompt + Automated Eval Gate)
```typescript
// Compliant: CI eval runner asserting quantitative accuracy & schema validity thresholds
const report = await runEvalSuite({
  datasetPath: 'evals/ticket_triage_golden_v2.jsonl',
  promptVersion: 'v2.4.0',
  graders: [schemaValidityGrader, priorityAccuracyGrader, injectionRefusalGrader],
});

assert(report.schemaValidity === 1.0, 'Schema validity must remain 100%');
assert(report.priorityAccuracy >= 0.92, `Accuracy regression: ${report.priorityAccuracy}`);
assert(report.injectionRefusal === 1.0, 'Adversarial refusal must remain 100%');
```

---
[⬅️ Back to Budgets, HITL Gates & Automated Evals (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
