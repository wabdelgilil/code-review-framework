# [CHK-FE-0102] Standardized Async UI States & Error Boundaries
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-FE] Frontend, Design System & UX (Level 1)](../../README.md) > [Design System & Components (Level 2)](../README.md) > [Tokens, Primitives & Async States (Level 3)](./README.md) > **CHK-FE-0102 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-FE-0102` |
| **Sub-Pillar & Category** | Design System & Components / Tokens, Primitives & Async States |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | ISO/IEC 25010 (Fault Tolerance & Operability); Modern Web Fault-Containment Patterns |
| **Target Entities** | Data-fetching pages, dashboard widgets, tables, forms, root and route-level layout wrappers |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Every asynchronous data view must explicitly handle all four UI states using standardized components: **Loading (skeleton/spinner)**, **Error (actionable message + retry trigger)**, **Empty (contextual guidance + primary CTA)**, and **Populated**. All major routes and independent widgets must be wrapped in **UI Error Boundaries** that capture runtime render exceptions, report telemetry, and render a safe fallback without crashing the entire application shell.
* **Engineering Rationale:** Leaving async states unhandled produces blank white screens ("white screen of death"), silent network failures, or confusing empty tables that users mistake for lost data.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Unhandled Render Crashes:** Strictly `0` top-level routes lacking an Error Boundary (`error.tsx` / `<ErrorBoundary>`).
* **Async State Completeness:** `100%` of remote data views explicitly branch on `isLoading`, `isError`, and empty-dataset states.

---

### 4. Step-by-Step Verification Protocol
1. **Network Failure Simulation:**
   * Simulate HTTP `500` and offline network states in browser DevTools or Playwright tests; verify an actionable error state with a working Retry button renders (zero blank screen).
2. **Empty Dataset Simulation:**
   * Return `[]` from list endpoints; verify a standardized Empty State component renders cleanly.
3. **Error Boundary Verification:**
   * Verify route layouts and isolated dashboard widgets are wrapped in Error Boundaries that log errors to production telemetry.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All data views render standardized Loading, Error (with retry), and Empty states, and route/widget Error Boundaries isolate render failures.
* **`FAIL`:** Any network failure or render error produces a blank screen, unhandled exception overlay, or silent failure with no user recovery path.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Blank Screen on Failure or Empty Data)
```tsx
// Prohibited: Crashes or renders blank table when loading, errored, or empty
export function AssetsPage() {
  const { data } = useAssets();
  return <AssetsTable rows={data!.items} />;
}
```

#### ✅ Compliant Canonical Pattern (Explicit 4-State Rendering + Error Boundary)
```tsx
// Compliant: Deterministic Loading, Error (retryable), Empty, and Populated states
export function AssetsPage() {
  const { data, isLoading, isError, refetch } = useAssets();

  if (isLoading) return <TableSkeleton rows={8} />;
  if (isError) return <ErrorState message={t('assets.loadFailed')} onRetry={refetch} />;
  if (!data || data.items.length === 0) {
    return <EmptyState title={t('assets.emptyTitle')} action={<CreateAssetButton />} />;
  }

  return (
    <ErrorBoundary fallback={<WidgetErrorFallback />}>
      <AssetsTable rows={data.items} />
    </ErrorBoundary>
  );
}
```

---
[⬅️ Back to Tokens, Primitives & Async States (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
