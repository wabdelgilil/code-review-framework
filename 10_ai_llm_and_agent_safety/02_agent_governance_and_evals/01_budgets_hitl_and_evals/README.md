# [AI-02-01] Budgets, HITL Gates & Automated Evals
## Level 3 Category Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-AI] AI/LLM Systems & Agent Safety (Level 1)](../../README.md) > [Agent Governance & Evals (Level 2)](../README.md) > **Budgets, HITL Gates & Automated Evals (Level 3)**

---

### 🎯 Purpose & Scope
Prevent infinite agent loops, runaway API bills, unauthorized mutations, and silent prompt quality regressions in production AI systems.

---

### 📜 Governing Standards
OWASP Top 10 for LLM Applications (LLM06 Excessive Agency, LLM10 Unbounded Consumption); NIST AI RMF 1.0.

---

### 📋 Level 4: Atomic Checkpoints Specification

| Checkpoint Code | Atomic Checkpoint Name | Classification | Verification Specification Link |
| :---: | :--- | :---: | :---: |
| `CHK-AI-0201` | **Token/Cost Caps & Model Fallbacks** | `[MANDATORY]` | [📄 View Checkpoint Specification](./01_token_cost_caps_and_model_fallbacks.md) |
| `CHK-AI-0202` | **Human-in-the-Loop for Destructive Tools** | `[MANDATORY]` | [📄 View Checkpoint Specification](./02_human_in_the_loop_for_destructive_tools.md) |
| `CHK-AI-0203` | **Automated Golden Eval Regression Gates** | `[BEST PRACTICE]` | [📄 View Checkpoint Specification](./03_automated_golden_eval_regression_gates.md) |

---
[⬅️ Back to Sub-Pillar (Level 2)](../README.md) | [🏠 Back to Root Index](../../../README.md)
