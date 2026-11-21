# [CHK-API-0303] Triple-Tier Governance & Pristine Root Policy
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-API] API Governance, Delivery & Execution (Level 1)](../../README.md) > [Engineering Governance & Specs (Level 2)](../README.md) > [Planning & Living Specifications (Level 3)](./README.md) > **CHK-API-0303 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-API-0303` |
| **Sub-Pillar & Category** | Engineering Governance & Specs / Planning & Living Specifications |
| **Classification** | **`[BEST PRACTICE]`** |
| **Governing Standard** | Enterprise Project Governance; Clean Repository & Evidence-Gated Definition of Done (DoD) |
| **Target Entities** | Repository root directory, `project_management/` tracking hierarchy (`MASTER_PLAN.md`, `COMPLETED_WORK.md`, task plans) |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Active engineering initiatives must be governed via a clean **triple-tier tracking structure**—an active-only `MASTER_PLAN.md` (pruned upon milestone closure), per-initiative detailed execution plans, and a searchable `COMPLETED_WORK.md` executive archive—paired with a **Pristine Root Directory Policy** restricting the repository root strictly to standard operational manifests (`README.md`, `SRS.md`, `.gitignore`, `.env.example`, package/build configs) with zero stray scratch scripts, raw dumps, or temporary logs. No milestone may be closed without passing automated **Definition of Done (DoD)** verification gates.
* **Engineering Rationale:** Bloated master plans obscure active priorities, stray root scripts pollute version control and break CI context, and closing tasks on superficial manual checks allows silent regressions to accumulate across sprints.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Stray Root Files:** Strictly `0` scratch scripts, temporary dumps, ad-hoc logs, or `_final`/`_temp` files in the repository root.
* **Master Plan Hygiene:** `0` already-completed and archived milestones lingering in the active `MASTER_PLAN.md`.
* **Evidence-Gated Closure:** `100%` of closed milestones record verifiable build, lint, typecheck, and test pass evidence.

---

### 4. Step-by-Step Verification Protocol
1. **Root Directory Hygiene Check:**
   * Inspect top-level repository files; confirm all scripts live under `scripts/` or `tools/`, docs under `docs/`, raw data under `data/`, and plans under `project_management/`.
2. **Governance & DoD Audit:**
   * Confirm `MASTER_PLAN.md` contains only active/upcoming initiatives, completed work is indexed in `COMPLETED_WORK.md`, and milestone closure reports cite concrete verification outputs.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Repository root contains only standard operational manifests, project tracking separates active plans from completed archives, and milestones close only after automated DoD verification.
* **`FAIL`:** Repository root is cluttered with stray scripts/logs/dumps, master plans are bloated with unarchived history, or tasks are closed without automated verification.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Polluted Root & Unarchived Plan Sprawl)
```text
repo-root/
├── fix_db_temp.py
├── test_output_final_v2.json
├── debug_dump.sql
├── old_notes.txt
└── MASTER_PLAN.md  (4,500 lines mixing 2024 completed tasks with active bugs)
```

#### ✅ Compliant Canonical Pattern (Pristine Root & Triple-Tier Governance)
```text
repo-root/
├── README.md
├── SRS.md
├── .gitignore
├── .env.example
├── package.json
├── src/
├── docs/
├── scripts/
└── project_management/
    ├── MASTER_PLAN.md          # Lean, active-only radar
    ├── COMPLETED_WORK.md       # Searchable archive index of closed milestones
    ├── tasks/                  # Granular execution plans & impact analyses
    └── completed_tasks/        # Detailed verification reports
```

---
[⬅️ Back to Planning & Living Specifications (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
