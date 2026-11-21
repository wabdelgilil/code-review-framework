# [CHK-FE-0202] Anti-Monolith Component Decomposition
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-FE] Frontend, Design System & UX (Level 1)](../../README.md) > [State & Data Architecture (Level 2)](../README.md) > [State Separation & Component Decomposition (Level 3)](./README.md) > **CHK-FE-0202 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-FE-0202` |
| **Sub-Pillar & Category** | State & Data Architecture / State Separation & Component Decomposition |
| **Classification** | **`[BEST PRACTICE]`** |
| **Governing Standard** | ISO/IEC 25010 (Modularity & Analysability); Single Responsibility Principle |
| **Target Entities** | Page components, complex forms, interactive dashboards, custom hooks, frontend feature modules |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Frontend source files must remain focused and cohesive, adhering to a target size ceiling of **$\le 400\text{–}500$ lines**. Complex pages must be decomposed into single-responsibility submodules: pure presentational subcomponents, domain-specific custom hooks, validation schemas, and typed API adapters.
* **Engineering Rationale:** 1,000+ line page files that interleave state management, validation logic, API orchestration, modal markup, and table column definitions cause unnecessary full-tree re-renders, severe merge conflicts, and high defect rates during maintenance.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Component File Size Ceiling:** $\le 400$ lines ideal; hard review escalation threshold at $> 500$ lines (unless generated code).
* **Props & Hook Cohesion:** Presentational subcomponents receive typed domain props rather than monolithic kitchen-sink context objects.

---

### 4. Step-by-Step Verification Protocol
1. **Automated Line-Count Scan:**
   * Run a line-count check across `src/` (`.tsx`, `.vue`, `.dart`, `.svelte`) to flag any file exceeding `500` lines:
     ```bash
     find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec wc -l {} + | awk '$1 > 500 {print}'
     ```
2. **Responsibility Separation Review:**
   * Confirm complex forms and pages separate schema definitions (`schema.ts`), data hooks (`use*.ts`), and UI subcomponents (`components/`).

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Feature pages and components stay within the 500-line ceiling with clean separation of hooks, schemas, and presentational subcomponents.
* **`FAIL`:** Oversized monolithic UI files ($> 500$ lines) mix data fetching, complex transformations, multiple modals, and table rendering in a single file.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (1,200-Line Monolithic Page)
```text
src/pages/WorkOrdersPage.tsx  (1,240 lines)
  ├── 14 useState declarations
  ├── 6 raw fetch functions + CSV export builder
  ├── Inline Zod validation + permission checks
  ├── Filter bar + Data table + Create modal + Edit drawer + Delete dialog
```

#### ✅ Compliant Canonical Pattern (Cohesive Feature Module Decomposition)
```text
src/features/work-orders/
  ├── WorkOrdersPage.tsx           (~110 lines: layout & composition only)
  ├── api/workOrdersApi.ts         (~80 lines: typed HTTP client)
  ├── hooks/useWorkOrders.ts       (~75 lines: query/mutation hooks)
  ├── schemas/workOrderSchema.ts   (~60 lines: Zod validation contracts)
  └── components/
      ├── WorkOrderFilters.tsx     (~90 lines)
      ├── WorkOrderTable.tsx       (~120 lines)
      └── WorkOrderFormModal.tsx   (~140 lines)
```

---
[⬅️ Back to State Separation & Component Decomposition (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
