# [CHK-API-0301] Pre-Implementation Entity Impact Analysis
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-API] API Governance, Delivery & Execution (Level 1)](../../README.md) > [Engineering Governance & Specs (Level 2)](../README.md) > [Planning & Living Specifications (Level 3)](./README.md) > **CHK-API-0301 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-API-0301` |
| **Sub-Pillar & Category** | Engineering Governance & Specs / Planning & Living Specifications |
| **Classification** | **`[BEST PRACTICE]`** |
| **Governing Standard** | IEEE 29148 (Change Impact Analysis); Enterprise Systems Engineering Governance |
| **Target Entities** | Substantial feature proposals, schema changes, cross-module refactors, execution plan documents |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Before writing implementation code for any substantial feature, entity addition, or schema/workflow modification, engineers must document a **Pre-Implementation Entity Impact Analysis** mapping every affected cross-cutting layer: **Database Schema & Migrations**, **ORM/Repository**, **API Contracts**, **UI & Bidirectional Navigation**, **Search & Filters**, **RBAC/RLS Permissions**, **Reports/Exports**, **Notifications**, **Audit Logs**, and **Offline Sync** (if applicable).
* **Engineering Rationale:** Jumping directly into code without cross-layer impact analysis is the primary cause of half-integrated features—such as adding a new status enum in the database while forgetting to update reports, search filters, permissions, and audit log formatters.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Impact Matrix Coverage:** `100%` of substantial multi-file initiatives or schema changes include a written impact checklist prior to implementation.
* **Cross-Layer Omissions in PR Review:** Target `0` missed layers (e.g., forgotten RLS policy, missing audit log event, or missing i18n keys) caught post-merge.

---

### 4. Step-by-Step Verification Protocol
1. **Plan Artifact Inspection:**
   * Verify the active initiative's execution plan or RFC contains an Entity Impact Analysis table explicitly marking each cross-cutting layer as `Impacted (Action Plan)` or `N/A (Verified)`.
2. **PR-to-Impact Reconciliation:**
   * Cross-check the pull request diff against every `Impacted` row in the analysis to confirm complete delivery before merge.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Substantial features include a pre-implementation cross-layer impact analysis, and the delivered PR satisfies every impacted layer.
* **`FAIL`:** Complex schema or feature changes are implemented ad-hoc, leaving broken reports, missing permissions, or un-audited mutations across adjacent layers.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Ad-Hoc Coding Without Cross-Layer Check)
```text
PR: "Add Contractor entity"
  - Added contractors table and POST /contractors
  - Forgot RLS policy on contractors table
  - Forgot audit log event on contractor assignment
  - Forgot reverse link from WorkOrder detail view to Contractor
  - Forgot global search indexing and i18n keys
```

#### ✅ Compliant Canonical Pattern (Pre-Implementation Entity Impact Matrix)
```markdown
### Entity Impact Analysis: `Contractor`
| System Layer | Impacted? | Required Action |
| :--- | :---: | :--- |
| Database & Migrations | Yes | `contractors` table + FK on `work_orders.contractor_id` + partial unique index |
| RLS & RBAC Permissions | Yes | Enable PostgreSQL RLS (`tenant_id`) + `contractors.read/write` permissions |
| API & Bidirectional UI | Yes | `/api/v1/contractors/:id/work-orders` + link in Work Order detail view |
| Audit Trail & Exports | Yes | Emit `CONTRACTOR_CREATED/ASSIGNED` diffs + add column to Work Order CSV export |
| i18n & Search | Yes | Add `en.json` & `ar.json` keys + include contractor name in search query |
```

---
[⬅️ Back to Planning & Living Specifications (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
