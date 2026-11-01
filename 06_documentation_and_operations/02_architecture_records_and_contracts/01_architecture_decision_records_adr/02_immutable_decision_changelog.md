# [CHK-UX-0202] Immutable Decision Changelog & Deprecation Linking
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-UX] Documentation, DX & Operations (Level 1)](../../../README.md) > [Architecture Records & Contracts (Level 2)](../../README.md) > [Architecture Decision Records (ADR) (Level 3)](../README.md) > **CHK-UX-0202 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-UX-0202` |
| **Sub-Pillar & Category** | Architecture Records & Contracts / Architecture Decision Records (ADR) |
| **Classification** | **`[BEST PRACTICE]`** |
| **Governing Standard** | ADR Immutability Pattern; ISO/IEC 42010; Semantic Versioning |
| **Target Entities** | Historical ADR files, decision registries, architecture index |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Historical Architecture Decision Records must **never be rewritten, retroactively edited, or deleted**. When an architectural decision is overturned, a **new ADR must be drafted** that explicitly marks the prior ADR as `Superseded by ADR-XXXX`, and the prior ADR's status header must be updated with a link to the superseding decision.
* **Engineering Rationale:** Modifying historical decision records distorts the historical record of the codebase, confusing maintainers about when and why architectural directions evolved.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Retroactive Text Modifications in Accepted ADRs:** Strictly `0` (only status transition headers may be updated).
* **Supersession Bidirectional Linking:** `100%` of superseded ADRs must contain bidirectional links to the new ADR.

---

### 4. Step-by-Step Verification Protocol
1. **ADR Git History Verification:**
   * Review git diffs of existing accepted ADRs; confirm that historical contexts and decisions are never deleted or rewritten.
2. **Link Parity Check:**
   * Verify that any ADR with status `Superseded` links to the valid, numbered replacement ADR.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Architectural history is immutable; superseded decisions are formally linked to their replacements.
* **`FAIL`:** Past ADRs are deleted or retroactively rewritten to reflect current design changes.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Deleting or Rewriting Historical ADR)
```text
# Developer deletes 0002-use-rest-api.md and writes 0002-use-graphql.md over it!
# Historical record of why REST was chosen and used for 2 years is LOST!
```

#### ✅ Compliant Canonical Pattern (Status Update with Superseded Link)
```markdown
# 0002. Use REST API for Client Ingestion

Date: 2024-03-15
Status: Superseded by [ADR-0012](0012-migrate-ingestion-to-grpc.md)
```

---
[⬅️ Back to Architecture Decision Records (ADR) (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
