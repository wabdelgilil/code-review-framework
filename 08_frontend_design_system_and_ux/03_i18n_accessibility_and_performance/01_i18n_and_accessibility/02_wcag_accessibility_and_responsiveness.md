# [CHK-FE-0302] WCAG 2.1 AA Accessibility & Responsiveness
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-FE] Frontend, Design System & UX (Level 1)](../../README.md) > [i18n, Accessibility & Performance (Level 2)](../README.md) > [i18n & Accessibility (Level 3)](./README.md) > **CHK-FE-0302 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-FE-0302` |
| **Sub-Pillar & Category** | i18n, Accessibility & Performance / i18n & Accessibility |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | W3C WCAG 2.1 Level AA; WAI-ARIA 1.2 Authoring Practices; ISO/IEC 25010 (Accessibility) |
| **Target Entities** | Semantic HTML layouts, forms, modals/drawers, icon buttons, navigation menus, responsive breakpoints |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** All user-facing pages and interactive components must satisfy **WCAG 2.1 Level AA** fundamentals: semantic HTML landmarks (`<main>`, `<nav>`, `<header>`), native interactive controls (`<button>`, `<a href>` instead of clickable `<div>`), explicit accessible labels (`<label htmlFor>`, `aria-label` on icon-only buttons), visible focus indicators, keyboard navigation (Tab/Escape/Enter + focus trapping in modals), minimum **4.5:1** text contrast ratio, and responsive adaptation across desktop, tablet, and mobile viewports without horizontal overflow.
* **Engineering Rationale:** Inaccessible UI excludes keyboard and assistive-technology users, fails government/enterprise procurement compliance (Section 508, EN 301 549, Saudi DGA digital accessibility standards), and degrades usability for power users.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Automated `axe-core` Critical/Serious Violations:** Strictly `0` across all core application routes.
* **Color Contrast Ratio:** $\ge 4.5:1$ for normal text and $\ge 3.0:1$ for large text and UI components.
* **Horizontal Overflow:** `0px` unintended horizontal scroll at standard viewports (`375px`, `768px`, `1280px`, `1440px`).

---

### 4. Step-by-Step Verification Protocol
1. **Automated Accessibility Scan:**
   * Run `@axe-core/playwright` or Lighthouse Accessibility audit across core routes in CI; assert `0` Critical and Serious violations.
2. **Keyboard-Only Navigation Audit:**
   * Navigate primary workflows (login, filter table, open/close modal, submit form) using only `Tab`, `Shift+Tab`, `Enter`, `Space`, and `Escape`.
3. **Responsive Viewport Audit:**
   * Verify layout integrity at `375px` (mobile), `768px` (tablet), and `1440px` (desktop).

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Core routes report 0 critical/serious `axe-core` violations, support full keyboard navigation with visible focus rings, meet contrast ratios, and adapt cleanly across viewports.
* **`FAIL`:** Clickable `<div>`s replace buttons, icon buttons lack `aria-label`, modals trap no focus or ignore `Escape`, contrast falls below 4.5:1, or mobile layouts break.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Clickable `div` & Unlabeled Icon Button)
```tsx
// Prohibited: Unreachable via keyboard, no accessible name, non-semantic element
<div onClick={onDelete} className="cursor-pointer">
  <TrashIcon />
</div>
```

#### ✅ Compliant Canonical Pattern (Semantic Button + Accessible Label + Focus Ring)
```tsx
// Compliant: Native button, accessible name, decorative icon hidden from screen readers
<button
  type="button"
  onClick={onDelete}
  aria-label={t('assets.actions.deleteAsset', { name: asset.name })}
  className="rounded p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
>
  <TrashIcon aria-hidden="true" className="h-4 w-4" />
</button>
```

---
[⬅️ Back to i18n & Accessibility (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
