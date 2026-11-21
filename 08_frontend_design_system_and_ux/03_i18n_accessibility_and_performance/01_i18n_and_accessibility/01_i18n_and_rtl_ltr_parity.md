# [CHK-FE-0301] i18n Hygiene & Native RTL/LTR Parity
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-FE] Frontend, Design System & UX (Level 1)](../../README.md) > [i18n, Accessibility & Performance (Level 2)](../README.md) > [i18n & Accessibility (Level 3)](./README.md) > **CHK-FE-0301 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-FE-0301` |
| **Sub-Pillar & Category** | i18n, Accessibility & Performance / i18n & Accessibility |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | W3C Internationalization (i18n) Standards; CSS Logical Properties & Values Level 1 |
| **Target Entities** | All user-facing UI templates, validation messages, toast alerts, CSS/Tailwind classes, date/number formatters |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Multi-language applications must contain **zero hardcoded user-facing strings** inside components; all labels, placeholders, aria-labels, and error messages must be resolved from structured localization dictionaries with 100% key parity across supported locales. Directional layouts must use **CSS Logical Properties** (`margin-inline-start` / `ms-*`, `padding-inline-end` / `pe-*`, `text-start`, `inset-inline-start`) rather than physical `left`/`right` properties to guarantee native RTL (Arabic, Hebrew) and LTR (English) parity.
* **Engineering Rationale:** Mixing hardcoded strings breaks locale switching and produces half-translated enterprise screens. Using physical `ml-4` / `text-left` / `right-0` classes breaks alignment, overlaps icons, and clips drawers when rendered in RTL (`dir="rtl"`).

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Missing Translation Keys:** Strictly `0` keys present in the primary locale dictionary (`en.json`) missing from secondary locales (`ar.json`).
* **Physical Directional Overrides:** `0` unjustified physical `left`/`right` layout utilities (`ml-`, `mr-`, `pl-`, `pr-`, `text-left`, `text-right`) in RTL-enabled applications.

---

### 4. Step-by-Step Verification Protocol
1. **Dictionary Key Parity Script:**
   * Run an automated diff comparing flattened key paths across all locale JSON/ARB files; fail CI if any key is missing or empty.
2. **Physical Direction Linter Check:**
   * Grep stylesheets/JSX for physical directional classes (`ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`, `margin-left`, `padding-right`) and verify logical equivalents (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) are used.
3. **Visual RTL Smoke Test:**
   * Toggle `<html dir="rtl" lang="ar">` and verify navigation bars, tables, modals, form labels, and chevrons mirror cleanly without overflow.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All UI text is sourced from verified i18n dictionaries with 100% locale key parity, and layouts use logical properties rendering cleanly in both LTR and RTL.
* **`FAIL`:** Hardcoded user-facing strings appear in components, translation dictionaries are out of sync, or RTL mode suffers visual misalignment or clipping.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Hardcoded Text & Physical `left`/`right`)
```tsx
// Prohibited: Hardcoded English string + physical margin-left/text-left breaks RTL
<div className="ml-4 pl-2 text-left border-l-2">
  <span>Save Changes</span>
</div>
```

#### ✅ Compliant Canonical Pattern (i18n Keys + CSS Logical Properties)
```tsx
// Compliant: Structured translation key + logical start/end properties for native RTL/LTR
<div className="ms-4 ps-2 text-start border-s-2">
  <span>{t('common.actions.saveChanges')}</span>
</div>
```

---
[⬅️ Back to i18n & Accessibility (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
