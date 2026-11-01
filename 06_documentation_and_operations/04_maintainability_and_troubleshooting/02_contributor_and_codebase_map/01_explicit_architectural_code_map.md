# [CHK-UX-0402] Explicit Architectural Codebase Map
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-UX] Documentation, DX & Operations (Level 1)](../../../README.md) > [Maintainability & Troubleshooting (Level 2)](../../README.md) > [Contributor & Codebase Map (Level 3)](../README.md) > **CHK-UX-0402 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-UX-0402` |
| **Sub-Pillar & Category** | Maintainability & Troubleshooting / Contributor & Codebase Map |
| **Classification** | **`[BEST PRACTICE]`** |
| **Governing Standard** | Open Source Contributor Standards (CONTRIBUTING.md); C4 Model (Context & Containers); ISO/IEC 25010 |
| **Target Entities** | `CONTRIBUTING.md`, `ARCHITECTURE.md`, root README directory guides |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** The repository must maintain an explicit **Architectural Codebase Map** (in `CONTRIBUTING.md` or `ARCHITECTURE.md`) linking physical directories and packages to their functional responsibilities, architectural layer, and domain purpose.
* **Engineering Rationale:** In large codebases, new contributors suffer from severe cognitive overload trying to deduce where new features, domain calculations, or adapters belong, often leading to files being placed in incorrect, ad-hoc locations.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Directory Responsibility Coverage:** `100%` of top-level source directories must be cataloged in the architectural map.
* **Onboarding Cognitive Bound:** A new engineer must be able to locate the correct directory for any proposed feature within $\le 2$ minutes of reading the map.

---

### 4. Step-by-Step Verification Protocol
1. **Codebase Map Audit:**
   * Review `CONTRIBUTING.md` or `ARCHITECTURE.md`.
   * Verify every directory under `src/` has a documented responsibility description.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** A clear directory-to-responsibility map exists and is kept synchronized with repository structure.
* **`FAIL`:** The repository contains directories whose purpose is undocumented, leaving contributors to guess module organization.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Zero Repository Navigation Guidance)
```markdown
# CONTRIBUTING.md
"Send pull requests. Follow clean code."
<!-- Where do services go? Where do domain models go? Where do test fixtures live? Undocumented! -->
```

#### ✅ Compliant Canonical Pattern (Visual Tabular Codebase Map)
```markdown
## Repository Architecture Map

| Directory | Layer | Functional Responsibility | Permitted Dependencies |
| :--- | :--- | :--- | :--- |
| `src/domain/` | Domain / Core | Pure mathematical models, business rules, entities | Standard library primitives only |
| `src/application/` | Application | Service orchestrators, use cases, workflow pipelines | `src/domain/`, abstract ports |
| `src/infrastructure/` | Infrastructure | Adapters for filesystem, database, third-party APIs | `src/application/` ports, external SDKs |
| `src/presentation/` | Presentation | CLI commands, API controllers, output formatters | `src/application/` |
```

---
[⬅️ Back to Contributor & Codebase Map (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
