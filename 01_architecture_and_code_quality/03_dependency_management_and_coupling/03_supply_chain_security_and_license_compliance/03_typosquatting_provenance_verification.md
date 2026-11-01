# [CHK-ARCH-0307] Typosquatting & Package Provenance Verification
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../../README.md) > [Dependency Management & Coupling (Level 2)](../../README.md) > [Supply Chain Security & License Compliance (Level 3)](../README.md) > **CHK-ARCH-0307 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-ARCH-0307` |
| **Sub-Pillar & Category** | Dependency Management & Coupling / Supply Chain Security & License Compliance |
| **Classification** | **`[BEST PRACTICE]`** |
| **Governing Standard** | NIST SP 800-161; Supply-chain Levels for Software Artifacts (SLSA Level 3); CWE-1357 |
| **Target Entities** | Dependency resolution indices, registry URLs, lockfiles, package name audits |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Package installation must be restricted strictly to **authorized, verified official registries** (e.g. `pypi.org`, `registry.npmjs.org`, or an internal authenticated enterprise Artifactory proxy). Dependency names must be audited against known **typosquatting variations** (e.g. `reqeusts` instead of `requests`) and dependency confusion risks.
* **Engineering Rationale:** Attackers publish malicious packages with names nearly identical to legitimate popular libraries or internal corporate packages. If a developer mistypes a package name or an index falls back to public registries, malicious malware executes immediately during installation.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Unverified Registry Usage:** Strictly `0` untrusted or unencrypted (HTTP) package repositories in package managers.
* **Namespace Confusion Defense:** Internal proprietary package namespaces (e.g. `@company/*`) must be claimed and registered in both private and public indices.

---

### 4. Step-by-Step Verification Protocol
1. **Registry URL Configuration Audit:**
   * Verify `.npmrc`, `pip.conf`, or `poetry.toml` specifies only verified HTTPS registries.
2. **Dependency Name Typosquat Check:**
   * Cross-reference package names against Levenshtein distance checks for popular packages to catch mistyped library names.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All dependencies originate from verified official registries, with zero typosquatted package names.
* **`FAIL`:** The build pulls packages from unverified or insecure HTTP mirrors, or contains suspicious typosquatted package names.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Typosquatted Package Name)
```json
// Prohibited: One letter mistyped leads to malicious cryptominer installation!
{
  "dependencies": {
    "recuests": "2.28.1" // Malicious typosquatted clone of official `requests`!
  }
}
```

#### ✅ Compliant Canonical Pattern (Authenticated Registry with Verified Name)
```toml
# Compliant: Explicitly defined trusted index with verified canonical package names
[tool.poetry.source]
name = "official-pypi"
url = "https://pypi.org/simple"
priority = "default"

[tool.poetry.dependencies]
requests = "2.31.0" # Verified canonical package
```

---
[⬅️ Back to Supply Chain Security & License Compliance (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
