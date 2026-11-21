# [CHK-FE-0303] Code Splitting & Heavy Module Lazy Loading
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-FE] Frontend, Design System & UX (Level 1)](../../README.md) > [i18n, Accessibility & Performance (Level 2)](../README.md) > [Frontend Performance Budgets (Level 3)](./README.md) > **CHK-FE-0303 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-FE-0303` |
| **Sub-Pillar & Category** | i18n, Accessibility & Performance / Frontend Performance Budgets |
| **Classification** | **`[BEST PRACTICE]`** |
| **Governing Standard** | ISO/IEC 25010 (Time Behaviour & Resource Utilization); Web Performance Working Group Guidelines |
| **Target Entities** | Route entry bundles, charting libraries, GIS/map canvases, rich text editors, PDF/Excel export modules |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Heavy third-party visualization, mapping, rich-text editing, CAD/canvas, and PDF/Excel export libraries must **never** be statically bundled into the initial application entry chunk. They must be dynamically imported (`React.lazy` / `next/dynamic` / dynamic `import()`) on route or user-interaction boundaries with explicit loading fallbacks.
* **Engineering Rationale:** Bundling megabytes of rarely used export or charting libraries into the main entry chunk blocks JavaScript parsing and hydration on every page load—severely degrading Time to Interactive (TTI) and mobile usability on constrained networks.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Initial Entry JS Bundle (Gzipped/Brotli):** Target $\le 200\text{ KB}$ (hard review escalation $> 350\text{ KB}$ for standard web apps).
* **Heavy Optional Dependencies in Entry Chunk:** Strictly `0` heavy modules ($> 50\text{ KB}$ gzipped, e.g., `echarts`, `leaflet`, `xlsx`, `pdfmake`, `monaco-editor`) statically imported into root layouts or shared entry chunks.

---

### 4. Step-by-Step Verification Protocol
1. **Bundle Analyzer Inspection:**
   * Run production build with bundle analyzer (`ANALYZE=true npm run build` / `vite-bundle-visualizer`) and inspect the initial entry chunk composition.
2. **Static Import Audit:**
   * Grep root layouts and common modules for static top-level imports of heavy export/charting/map packages.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Initial JS bundle stays within budget and all heavy visualization/export modules are dynamically code-split into on-demand chunks.
* **`FAIL`:** Heavy charting, mapping, or export libraries are eagerly loaded in the initial entry chunk for all routes.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Eager Static Import in Entry Bundle)
```tsx
// Prohibited: Forces every user on the login/dashboard page to download Excel/PDF engines
import * as XLSX from 'xlsx';
import { HeavyFloorPlanCanvas } from '@/components/FloorPlanCanvas';
```

#### ✅ Compliant Canonical Pattern (On-Demand Dynamic Import & Lazy Component)
```tsx
// Compliant: Heavy canvas loaded only when route/tab renders; XLSX loaded only on click
import dynamic from 'next/dynamic';

const FloorPlanCanvas = dynamic(() => import('@/components/FloorPlanCanvas'), {
  ssr: false,
  loading: () => <CanvasSkeleton />,
});

async function handleExportExcel(rows: ReportRow[]) {
  const XLSX = await import('xlsx'); // Fetched strictly on user action
  const sheet = XLSX.utils.json_to_sheet(rows);
  // ...
}
```

---
[⬅️ Back to Frontend Performance Budgets (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
