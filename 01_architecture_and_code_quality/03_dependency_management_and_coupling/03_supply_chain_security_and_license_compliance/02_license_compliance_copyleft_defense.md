# [CHK-ARCH-0306] Open-Source License Compliance & Viral Copyleft Prevention
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../../README.md) > [Dependency Management & Coupling (Level 2)](../../README.md) > [Supply Chain Security & License Compliance (Level 3)](../README.md) > **CHK-ARCH-0306 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-ARCH-0306` |
| **Sub-Pillar & Category** | Dependency Management & Coupling / Supply Chain Security & License Compliance |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Open Source Initiative (OSI); SPDX License List; Software Legal Compliance Guidelines |
| **Target Entities** | Dependency licenses, package manifests, license metadata scanners |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** All imported third-party packages must have their open-source software (OSS) licenses validated against an approved organizational license policy. In proprietary or enterprise commercial software, **viral strong-copyleft licenses (e.g. GNU GPLv2, GPLv3, AGPLv3) are strictly prohibited** unless the codebase is explicitly intended to be open-sourced under the same license.
* **Engineering Rationale:** Strong-copyleft licenses mandate that any software linking to them must have its entire source code made publicly available under the same license, exposing enterprise proprietary IP to severe legal liabilities and forced source disclosure.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Prohibited Copyleft Licenses in Proprietary Repositories:** Strictly `0` AGPL, GPL, or SSPL dependencies linked to closed-source distribution artifacts.
* **Permitted License Allowlist:** MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC, Python-2.0, Unlicense.

---

### 4. Step-by-Step Verification Protocol
1. **Automated License Scanner Execution:**
   * Run a license compliance tool:
     ```bash
     # Example for Python
     pip-licenses --from=mixed --format=markdown --summary
     # Example for Node.js
     npx license-checker --onlyAllow "MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC"
     ```
2. **Flag Violations:**
   * Verify that any package with an unknown, unlisted, or GPL/AGPL license triggers an immediate CI failure.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** 100% of direct and transitive dependencies conform to the permitted permissive license allowlist.
* **`FAIL`:** Any dependency introduces an unapproved strong-copyleft license (GPL/AGPL) into proprietary software.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Accidental Viral AGPL Ingestion)
```json
// Prohibited: Ingesting an AGPL library into proprietary closed software!
{
  "dependencies": {
    "some-useful-library": "1.2.0" // Licensed under GNU AGPLv3 -> Violates commercial policy!
  }
}
```

#### ✅ Compliant Canonical Pattern (Approved Permissive License Allowlist)
```yaml
# Compliant: Automated CI license gate enforcing approved permissive SPDX licenses
name: License Compliance Audit
on: [push, pull_request]
jobs:
  license-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Verify License Allowlist
        run: |
          pip-licenses --ignore-packages pip,setuptools --fail-on "GPL;AGPL;LGPL"
```

---
[⬅️ Back to Supply Chain Security & License Compliance (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
