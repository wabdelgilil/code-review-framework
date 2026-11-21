# [CHK-API-0202] Centralized Technical Debt Register
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-API] API Governance, Delivery & Execution (Level 1)](../../README.md) > [Release Control & Tech Debt (Level 2)](../README.md) > [Progressive Delivery & Tech Debt (Level 3)](./README.md) > **CHK-API-0202 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-API-0202` |
| **Sub-Pillar & Category** | Release Control & Tech Debt / Progressive Delivery & Tech Debt |
| **Classification** | **`[BEST PRACTICE]`** |
| **Governing Standard** | ISO/IEC 25010 (Maintainability); Martin Fowler's Technical Debt Quadrant |
| **Target Entities** | Source code comments (`TODO`/`FIXME`/`HACK`), `docs/tech-debt/` or issue tracker, sprint/release capacity plans |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Intentional engineering trade-offs and structural debt must be tracked in a **centralized, prioritized Technical Debt Register** (with severity, operational impact, owner, and remediation trigger) rather than abandoned as untracked `// TODO` or `// FIXME` comments in source files. Any inline `TODO` permitted temporarily must reference a tracked ticket ID (e.g., `TODO(DEBT-142)`).
* **Engineering Rationale:** Untracked inline `TODO`s rot indefinitely while architectural bottlenecks silently compound until delivery velocity collapses and emergency rewrites become unavoidable.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Untracked Inline `TODO`/`FIXME`/`HACK` Comments:** Strictly `0` unlinked `TODO`/`FIXME` comments without an issue/register ID.
* **Remediation Allocation:** Active technical debt register reviewed at every release/milestone with scheduled paydown capacity.

---

### 4. Step-by-Step Verification Protocol
1. **Untracked `TODO` Scan:**
   * Run a static scan flagging any `TODO`/`FIXME`/`HACK` lacking a ticket reference:
     ```bash
     grep -rEn "(TODO|FIXME|HACK)(?!\([A-Z]+-[0-9]+\))" src/
     ```
2. **Register Review:**
   * Inspect the centralized technical debt register (or issue tracker label `tech-debt`) to confirm items have severity ratings, impact notes, and active remediation milestones.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Technical debt is explicitly tracked in a prioritized central register, zero untracked `TODO`/`FIXME` placeholders exist in source code, and structural debt is actively remediated.
* **`FAIL`:** Source code accumulates dozens of unowned `TODO`/`HACK` comments with no central visibility or paydown cadence.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Abandoned Untracked `TODO`)
```typescript
// Prohibited: Unowned, untracked shortcut that silently stays in production forever
// TODO: fix this hack later, it slows down when tenant has > 500 assets
const allAssets = await db.assets.findMany();
```

#### ✅ Compliant Canonical Pattern (Tracked Register Entry + Scoped Ticket Reference)
```typescript
// Compliant: Linked to prioritized Technical Debt Register entry with explicit sunset milestone
// TODO(DEBT-048): Replace offset pagination with keyset cursor before Q3 10k-asset onboarding.
const page = await assetRepo.findPage(ctx.tenantId, { limit: 50, offset });
```

---
[⬅️ Back to Progressive Delivery & Tech Debt (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
