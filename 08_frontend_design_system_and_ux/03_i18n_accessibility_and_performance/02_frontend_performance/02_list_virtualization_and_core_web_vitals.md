# [CHK-FE-0304] List Virtualization & Core Web Vitals Budgets
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-FE] Frontend, Design System & UX (Level 1)](../../README.md) > [i18n, Accessibility & Performance (Level 2)](../README.md) > [Frontend Performance Budgets (Level 3)](./README.md) > **CHK-FE-0304 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-FE-0304` |
| **Sub-Pillar & Category** | i18n, Accessibility & Performance / Frontend Performance Budgets |
| **Classification** | **`[BEST PRACTICE]`** |
| **Governing Standard** | Google Core Web Vitals (LCP, INP, CLS); ISO/IEC 25010 (Performance Efficiency) |
| **Target Entities** | Large data tables, Kanban/planning boards, media assets, web fonts, production frontend builds |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Any UI list, table, or dropdown capable of rendering $> 100$ visible items simultaneously must enforce **server-side pagination** or **DOM windowing/virtualization** (e.g., `@tanstack/react-virtual`). Production web applications must reserve explicit dimensions for media/fonts to eliminate layout shifts and satisfy Core Web Vitals thresholds (**LCP**, **INP**, **CLS**).
* **Engineering Rationale:** Rendering thousands of DOM nodes simultaneously freezes browser main threads, spikes memory usage, and causes input lag exceeding 500ms. Unsized images and blocking fonts cause jarring Cumulative Layout Shift (CLS).

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Largest Contentful Paint (LCP):** $\le 2.5\text{ s}$ (75th percentile).
* **Interaction to Next Paint (INP):** $\le 200\text{ ms}$ (75th percentile).
* **Cumulative Layout Shift (CLS):** $\le 0.1$.
* **Unvirtualized DOM Nodes in Lists:** Strictly $\le 100$ rows rendered simultaneously in the DOM without windowing/pagination.

---

### 4. Step-by-Step Verification Protocol
1. **Lighthouse CI / Web Vitals Audit:**
   * Execute Lighthouse CI against production builds of core routes and verify LCP, INP/TBT, and CLS meet green thresholds.
2. **Large Dataset DOM Stress Test:**
   * Load a table/list with 1,000 items and inspect DOM node count in DevTools; confirm either pagination limits visible rows or virtualization keeps rendered DOM rows constant ($\approx 20\text{–}40$).

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Large tables/lists use server pagination or DOM virtualization, images/fonts declare explicit sizing/preloading, and Core Web Vitals meet budget thresholds.
* **`FAIL`:** Tables dump thousands of unpaginated/unvirtualized DOM nodes, or pages exhibit severe layout shifts ($CLS > 0.1$) or slow interactions ($INP > 200\text{ms}$).

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Unbounded DOM Rendering & Unsized Media)
```tsx
// Prohibited: Renders 5,000 DOM rows at once and causes CLS with unsized image
export function AssetCatalog({ items }: { items: Asset[] }) {
  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          <img src={item.thumbnailUrl} />
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
}
```

#### ✅ Compliant Canonical Pattern (DOM Virtualization + Explicit Media Dimensions)
```tsx
// Compliant: Virtualizes rows to ~25 DOM nodes regardless of dataset size + explicit image dimensions
export function AssetCatalog({ items }: { items: Asset[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((vRow) => {
          const item = items[vRow.index];
          return (
            <div key={item.id} style={{ transform: `translateY(${vRow.start}px)` }} className="absolute top-0 w-full flex items-center gap-3">
              <img src={item.thumbnailUrl} alt={item.name} width={40} height={40} loading="lazy" />
              <span>{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---
[⬅️ Back to Frontend Performance Budgets (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
