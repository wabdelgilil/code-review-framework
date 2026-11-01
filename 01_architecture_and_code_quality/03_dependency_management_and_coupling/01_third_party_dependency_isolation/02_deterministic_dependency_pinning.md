# [CHK-ARCH-0302] Deterministic Dependency Pinning
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../../README.md) > [Dependency Management & Coupling (Level 2)](../../README.md) > [Third-Party Dependency Isolation (Level 3)](../README.md) > **CHK-ARCH-0302 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-ARCH-0302` |
| **Sub-Pillar & Category** | Dependency Management & Coupling / Third-Party Dependency Isolation |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Twelve-Factor App (Explicit Dependencies); ISO/IEC 25010 (Reproducibility & Security); SLSA Level 2+ |
| **Target Entities** | Package manifests (`package-lock.json`, `poetry.lock`, `Cargo.lock`, `Pipfile.lock`, `go.sum`) |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** All dependencies (both direct and transitive) must be **strictly pinned to exact versions with immutable cryptographic hashes** recorded in a checked-in lockfile. Open ranges (`*`, `^`, `>=`) in installation commands or production lockfiles are strictly forbidden.
* **Engineering Rationale:** Unpinned dependencies allow upstream library updates or malicious supply-chain package compromises to enter the software during automated builds without any code changes in the host project, destroying build determinism.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Floating Ranges in Production Manifest:** Strictly `0` unpinned dependencies.
* **Lockfile Presence:** `100%` presence of an up-to-date, checked-in cryptographic lockfile.
* **Hermetic Installation Verification:** CI build installs using frozen/immutable mode (e.g. `npm ci`, `poetry install --frozen`, `cargo build --locked`).

---

### 4. Step-by-Step Verification Protocol
1. **Lockfile Presence & Freshness Check:**
   * Verify that the lockfile exists in Git and is synchronized with the manifest.
   * Run the lockfile audit check:
     ```bash
     # Example for NPM
     npm ci --dry-run
     # Example for Poetry
     poetry check
     ```
2. **Hash Integrity Verification:**
   * Confirm that package downloads are validated against SHA-256 / SHA-512 hashes in the lockfile.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All dependencies are locked with exact versions and hashes in a checked-in lockfile; build passes in frozen install mode.
* **`FAIL`:** The lockfile is missing, outdated relative to manifest, or relies on floating versions without exact hashes.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Unpinned Floating Ranges)
```json
// Prohibited: Unpinned dependency ranges lead to non-deterministic builds
{
  "dependencies": {
    "express": "^4.18.0",
    "lodash": "*",
    "axios": "latest"
  }
}
```

#### ✅ Compliant Canonical Pattern (Strict Pinning with Cryptographic Lockfile)
```json
// Compliant: Exact versioning combined with committed package-lock.json containing integrity hashes
{
  "dependencies": {
    "express": "4.19.2",
    "lodash": "4.17.21",
    "axios": "1.7.2"
  }
}
```

---
[⬅️ Back to Third-Party Dependency Isolation (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
