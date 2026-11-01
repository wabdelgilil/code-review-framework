# [CHK-TEST-0102] Immutability of Golden Reference Files
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-TEST] Testing & Verification Suite (Level 1)](../../../README.md) > [Ground Truth & Benchmark Datasets (Level 2)](../../README.md) > [Immutable Golden Datasets (Level 3)](../README.md) > **CHK-TEST-0102 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-TEST-0102` |
| **Sub-Pillar & Category** | Ground Truth & Benchmark Datasets / Immutable Golden Datasets |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | ISO/IEC/IEEE 29119-3 (Test Documentation & Integrity); Falsifiability Safeguard |
| **Target Entities** | Golden snapshot fixtures, benchmark JSON/CSV files, baseline test vectors |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Golden reference fixture files and baseline datasets must be **strictly immutable**. Whenever code changes cause a benchmark test to fail, developers or AI agents are strictly prohibited from simply updating the golden file to match the new failing output without a formal, reviewed specification change.
* **Engineering Rationale:** The most common failure mode in automated AI testing and legacy maintenance is "snapshot gaming": updating test assertions to fit broken code so that tests turn green, permanently enshrining logic regressions as the new normal.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Unapproved Golden File Mod Mutation:** Strictly `0` unauthorized modifications to golden benchmark fixtures.
* **Integrity Hash Enforcement:** All golden reference files must be tracked with checked-in SHA-256 integrity hashes verified during CI execution.

---

### 4. Step-by-Step Verification Protocol
1. **Golden File Git Diff Audit:**
   * In any pull request or commit touching golden fixture files, verify that a formal specification change ticket is referenced.
2. **SHA-256 Integrity Verification:**
   * Run automated hash checks:
     ```bash
     sha256sum -c tests/benchmarks/golden_manifest.sha256
     ```

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Golden reference datasets match checked-in cryptographic hashes, and code is adjusted to satisfy benchmarks rather than vice versa.
* **`FAIL`:** Golden benchmark fixtures are arbitrarily modified or regenerated to force failing tests to pass.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Snapshot Gaming / Arbitrary Update)
```bash
# Prohibited: Updating reference fixtures solely to silence failing tests!
# Developer noticed test failed due to a rounding regression, and just re-recorded snapshot:
jest --updateSnapshot  # (Masks mathematical regression!)
```

#### ✅ Compliant Canonical Pattern (Immutable Benchmark with Integrity Check)
```python
# Compliant: Golden fixture protected by cryptographic checksum
import hashlib
from pathlib import Path

GOLDEN_FIXTURE_PATH = Path("tests/fixtures/golden_thermal_v1.json")
EXPECTED_SHA256 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"

def test_golden_dataset_integrity():
    """Guarantees the reference dataset has not been modified or tampered with."""
    content = GOLDEN_FIXTURE_PATH.read_bytes()
    actual_hash = hashlib.sha256(content).hexdigest()
    assert actual_hash == EXPECTED_SHA256, "Golden benchmark fixture has been modified!"
```

---
[⬅️ Back to Immutable Golden Datasets (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
