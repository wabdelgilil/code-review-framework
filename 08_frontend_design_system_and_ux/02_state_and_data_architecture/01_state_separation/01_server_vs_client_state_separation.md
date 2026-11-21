# [CHK-FE-0201] Server vs. Client State Separation
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-FE] Frontend, Design System & UX (Level 1)](../../README.md) > [State & Data Architecture (Level 2)](../README.md) > [State Separation & Component Decomposition (Level 3)](./README.md) > **CHK-FE-0201 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-FE-0201` |
| **Sub-Pillar & Category** | State & Data Architecture / State Separation & Component Decomposition |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | ISO/IEC 25010 (Maintainability & Reliability); Clean Frontend State Architecture |
| **Target Entities** | React/Vue/Angular/Flutter pages, custom data hooks, global stores, API client layers |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Remote **server state** (asynchronous fetching, caching, deduplication, background revalidation, cache invalidation on mutation) must be strictly separated from **local UI state** (modal open flags, active tabs, form drafts) and managed via a dedicated server-state layer (e.g., TanStack Query, SWR, Riverpod AsyncNotifier, or Server Components)—never via raw `useEffect` + `fetch` + `useState` waterfalls scattered inside presentational components.
* **Engineering Rationale:** Manual `useEffect` data fetching lacks request cancellation (`AbortController`), causes race conditions on rapid filter changes, duplicates identical network requests across components, and leaves stale data on screen after mutations.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Raw `fetch` Calls in Presentational Components:** Strictly `0` direct `fetch()` / `axios` calls inside JSX/UI view components; all remote calls must route through typed API client modules and server-state hooks.
* **Race Condition Protection:** `100%` of search/filter queries cancel or discard stale out-of-order responses.

---

### 4. Step-by-Step Verification Protocol
1. **Static Grep Audit:**
   * Scan UI component directories for `useEffect` blocks invoking `fetch(` or `axios.` directly.
2. **Cache Invalidation Verification:**
   * Trigger a create/update/delete mutation and confirm related list/detail views refresh deterministically via query key invalidation or optimistic update rollback.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Server state is managed through dedicated typed hooks/query caches with deterministic invalidation; local UI state remains cleanly scoped.
* **`FAIL`:** Components orchestrate raw `useEffect` + `fetch` calls with manual loading/error booleans, causing race conditions or stale post-mutation UI.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Raw `useEffect` Fetch with Race Condition)
```tsx
// Prohibited: No abort handling, race condition on filter change, no cache invalidation
export function WorkOrderList({ status }: { status: string }) {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    fetch(`/api/work-orders?status=${status}`)
      .then((r) => r.json())
      .then((data) => setItems(data));
  }, [status]);
  return <Table rows={items} />;
}
```

#### ✅ Compliant Canonical Pattern (Typed API Service + Server-State Hook)
```tsx
// Compliant: Encapsulated server-state hook with cancellation, caching, and typed contract
export function useWorkOrders(filters: WorkOrderFilters) {
  return useQuery({
    queryKey: ['work-orders', filters] as const,
    queryFn: ({ signal }) => workOrderApi.list(filters, { signal }),
    staleTime: 30_000,
  });
}

export function WorkOrderList({ filters }: { filters: WorkOrderFilters }) {
  const { data, isLoading, isError, refetch } = useWorkOrders(filters);
  // Render deterministic loading / error / empty / populated states
}
```

---
[⬅️ Back to State Separation & Component Decomposition (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
