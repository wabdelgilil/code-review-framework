# [CHK-FE-0101] Unified Design Tokens & UI Primitives
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-FE] Frontend, Design System & UX (Level 1)](../../README.md) > [Design System & Components (Level 2)](../README.md) > [Tokens, Primitives & Async States (Level 3)](./README.md) > **CHK-FE-0101 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-FE-0101` |
| **Sub-Pillar & Category** | Design System & Components / Tokens, Primitives & Async States |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | W3C Design Tokens Community Group Spec; ISO 9241-110 (Conformity with User Expectations) |
| **Target Entities** | Theme configurations, CSS variables, shared UI component libraries (buttons, tables, modals, badges, forms) |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Visual properties (colors, typography scales, spacing, border radii, elevation/shadows) must be consumed from centralized **semantic design tokens**—never scattered raw hex values or ad-hoc pixel numbers. Core interactive controls (buttons, inputs, data tables, modals, drawers, status badges) must use the shared UI primitive library rather than bespoke per-page re-implementations.
* **Engineering Rationale:** Copy-pasting tables, modals, and inline hex colors across pages creates visual drift, breaks dark-mode or high-contrast theming, and multiplies accessibility bug-fix effort across every screen.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Raw Hex/RGB Literals in Feature Components:** Strictly `0` un-tokenized inline hex colors (`#xxxxxx`) in feature-level UI files outside the theme/token definition directory.
* **Primitive Reuse:** `100%` of buttons, dialogs, form inputs, and data tables consume shared design system primitives.

---

### 4. Step-by-Step Verification Protocol
1. **Token Audit:**
   * Grep feature component directories (`src/features/`, `src/app/`, `src/pages/`) for raw hex colors (`#[0-9a-fA-F]{3,6}`) and ad-hoc inline style objects.
2. **Component Duplication Inspection:**
   * Verify there is a single canonical implementation of core primitives (e.g., `Button`, `DataTable`, `Modal`, `StatusBadge`) imported consistently across modules.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Feature screens consume semantic design tokens and shared UI primitives consistently with zero ad-hoc duplicate modals/tables or raw hex overrides.
* **`FAIL`:** Feature pages hardcode raw color hexes, duplicate core interactive widgets, or diverge in spacing/typography from the design system.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Hardcoded Hexes & Bespoke Controls)
```tsx
// Prohibited: Raw hex colors and ad-hoc button markup duplicated per page
export function ApproveAction({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: '#1d4ed8', color: '#ffffff', padding: '7px 13px', borderRadius: '5px' }}
    >
      Approve
    </button>
  );
}
```

#### ✅ Compliant Canonical Pattern (Semantic Design Tokens & Shared Primitive)
```tsx
// Compliant: Consumes centralized Button primitive and semantic tokens
import { Button } from '@/components/ui/button';

export function ApproveAction({ onClick, isPending }: { onClick: () => void; isPending: boolean }) {
  return (
    <Button variant="primary" size="md" loading={isPending} onClick={onClick}>
      {t('actions.approve')}
    </Button>
  );
}
```

---
[⬅️ Back to Tokens, Primitives & Async States (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
