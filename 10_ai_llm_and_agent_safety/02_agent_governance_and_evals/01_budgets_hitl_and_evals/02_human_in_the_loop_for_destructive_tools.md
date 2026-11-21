# [CHK-AI-0202] Human-in-the-Loop for Destructive Tools
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-AI] AI/LLM Systems & Agent Safety (Level 1)](../../README.md) > [Agent Governance & Evals (Level 2)](../README.md) > [Budgets, HITL Gates & Automated Evals (Level 3)](./README.md) > **CHK-AI-0202 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-AI-0202` |
| **Sub-Pillar & Category** | Agent Governance & Evals / Budgets, HITL Gates & Automated Evals |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | OWASP Top 10 for LLM Applications (LLM06: Excessive Agency); Principle of Least Privilege |
| **Target Entities** | Agent tool registries, MCP tool handlers, autonomous workflow executors |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** AI agents must operate with **least-privilege, scoped tool permissions** (read-only by default). Any tool capable of **destructive, irreversible, financial, or externally visible side effects** (e.g., deleting records, executing payments, sending mass emails, modifying RBAC permissions, deploying to production) must pause execution and require **explicit, server-verified Human-in-the-Loop (HITL) approval** displaying the exact parameters before executing.
* **Engineering Rationale:** Hallucinations or indirect prompt injections can trick an autonomous agent into invoking high-impact tools. Enforcing server-side HITL approval gates prevents catastrophic, irreversible autonomous damage.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Unconfirmed Destructive Tool Calls:** Strictly `0` irreversible/financial/external-comms tools executable autonomously without an explicit signed human confirmation token.
* **Tool Permission Scoping:** Agent tools execute strictly under the invoking user's RBAC & tenant context—never a global super-admin credential.

---

### 4. Step-by-Step Verification Protocol
1. **Tool Registry Classification Audit:**
   * Inspect every registered agent tool and verify each is tagged with its risk tier (`READ_ONLY`, `REVERSIBLE_WRITE`, `DESTRUCTIVE_HITL_REQUIRED`).
2. **HITL Bypass Test:**
   * Attempt to invoke a `DESTRUCTIVE_HITL_REQUIRED` tool directly from the agent runtime without a valid server-issued human approval token; assert strict `403` / `APPROVAL_REQUIRED` rejection.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Agent tools enforce least privilege under the caller's RBAC/tenant scope, and all destructive/irreversible tools require server-verified human approval before execution.
* **`FAIL`:** Agents hold super-admin credentials or can autonomously execute irreversible deletions, payments, or external broadcasts without human confirmation.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Autonomous Destructive Execution)
```typescript
// Prohibited: Agent can autonomously delete production records via tool call
const deleteInvoiceTool = {
  name: 'delete_invoice',
  execute: async ({ invoiceId }: { invoiceId: string }) => {
    await db.invoices.delete({ where: { id: invoiceId } });
  },
};
```

#### ✅ Compliant Canonical Pattern (Risk-Tiered Tool + Server-Verified HITL Gate)
```typescript
// Compliant: High-risk tool creates a pending approval request; executes only after human sign-off
const cancelInvoiceTool = {
  name: 'cancel_invoice',
  riskTier: 'DESTRUCTIVE_HITL_REQUIRED' as const,
  execute: async (ctx: AgentAuthContext, args: { invoiceId: string; reason: string }) => {
    if (!ctx.verifiedApprovalToken) {
      return approvalQueue.requestHumanConfirmation(ctx, 'cancel_invoice', args);
    }
    await approvalQueue.assertValidToken(ctx.verifiedApprovalToken, 'cancel_invoice', args);
    return invoiceService.cancelWithAudit(ctx, args.invoiceId, args.reason);
  },
};
```

---
[⬅️ Back to Budgets, HITL Gates & Automated Evals (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
