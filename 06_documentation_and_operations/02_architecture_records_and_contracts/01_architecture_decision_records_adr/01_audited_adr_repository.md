# [CHK-UX-0201] Audited Architecture Decision Records (ADR) Repository
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-UX] Documentation, DX & Operations (Level 1)](../../../README.md) > [Architecture Records & Contracts (Level 2)](../../README.md) > [Architecture Decision Records (ADR) (Level 3)](../README.md) > **CHK-UX-0201 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-UX-0201` |
| **Sub-Pillar & Category** | Architecture Records & Contracts / Architecture Decision Records (ADR) |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Michael Nygard Architecture Decision Record (ADR) Standard; ISO/IEC 42010 (Architecture Description) |
| **Target Entities** | `docs/adr/` repository, structural refactoring plans, design documents |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Every major architectural choice, core library selection, database paradigm, structural refactoring, or protocol design must be documented as an **immutable, numbered Architecture Decision Record (ADR)** saved in `docs/adr/`. Each ADR must define: Context, Decision, Alternatives Considered, and Consequences (positive and negative).
* **Engineering Rationale:** Without ADRs, teams forget *why* technical decisions were made, leading to repetitive debates ("Chesterton's Fence"), accidental reversal of intentional trade-offs, and loss of historical engineering context.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Major Architectural Shift ADR Coverage:** `100%` of architectural alterations must have an associated ADR.
* **Standard ADR Sections:** Every ADR must contain all 5 standard sections: Status, Context, Decision, Alternatives, Consequences.

---

### 4. Step-by-Step Verification Protocol
1. **ADR Directory Audit:**
   * Verify that `docs/adr/` exists and contains consecutively numbered markdown documents (`0001-record-architecture-decisions.md`, `0002-...`).
2. **Review Structural Commits:**
   * When major framework or architectural changes occur, verify that a corresponding ADR is included in the commit.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Architectural decisions are captured in structured ADRs documenting trade-offs and alternatives.
* **`FAIL`:** Fundamental architectural choices or core library migrations occur without any written ADR record.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Undocumented Radical Refactor)
```text
Commit: "Swapped ORM for raw SQL"
Description: ""
<!-- Why? What alternatives were explored? What are the consequences on migrations? Completely lost! -->
```

#### ✅ Compliant Canonical Pattern (Michael Nygard Standard ADR)
```markdown
# 0004. Use SQLite for In-Memory Analytical Testing

Date: 2026-11-01
Status: Accepted

## Context
Running unit tests against external database instances adds 45 seconds of network overhead per run.

## Decision
We will use in-memory SQLite instances wrapped in our DBAdapter interface for fast unit tests.

## Alternatives Considered
- Dockerized Testcontainers: Slower startup times.
- In-memory mock dictionaries: Insufficient SQL dialect fidelity.

## Consequences
- Positive: Test execution drops from 45s to 1.2s.
- Negative: Tests must avoid vendor-specific PostgreSQL extensions in core unit paths.
```

---
[⬅️ Back to Architecture Decision Records (ADR) (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
