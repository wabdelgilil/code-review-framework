# [CHK-RES-0403] SHA-256 Digest Verification for Persistent State
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-RES] Resilience, Error Handling & Security (Level 1)](../../../README.md) > [Data Safety & Atomic I/O (Level 2)](../../README.md) > [Data Corruption Defense (Level 3)](../README.md) > **CHK-RES-0403 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-RES-0403` |
| **Sub-Pillar & Category** | Data Safety & Atomic I/O / Data Corruption Defense |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | RFC 6234 (Secure Hash Algorithms); ISO/IEC 10118; ISO/IEC 25010 (Integrity) |
| **Target Entities** | Saved model checkpoints, persistent snapshot dumps, cached calculation artifacts |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Saved model states, data backups, and persistent artifacts must be accompanied by an **immutable SHA-256 cryptographic digest**. Upon subsequent loading, the application must recompute the file's digest and verify it matches before deserializing or executing code against the data.
* **Engineering Rationale:** Bitrot, storage hardware silent data corruption, transmission dropouts, or malicious tampering can alter stored files. Loading a corrupt file without checksum verification leads to erratic calculations or crashes long after the file was read.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Unverified Artifact Loads:** Strictly `0`. Any persistent model state loaded from disk must have its hash verified.
* **Cryptographic Strength:** SHA-256 or SHA-512 required. MD5 and SHA-1 are strictly forbidden due to collision vulnerabilities.

---

### 4. Step-by-Step Verification Protocol
1. **Digest Calculation Verification:**
   * Verify that state saving routines calculate and persist a `.sha256` sidecar or embedded digest.
2. **Corrupted File Injection Test:**
   * Deliberately flip 1 bit in a serialized state file.
   * Attempt to load the file; verify that the loader raises a `ChecksumMismatchError` and refuses to parse corrupted bytes.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All persistent artifacts are verified with SHA-256 digests prior to ingestion; altered files are immediately rejected.
* **`FAIL`:** The system loads state files from disk without integrity hash validation.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Loading Raw State Without Hash Check)
```python
# Prohibited: Loads file without verifying integrity
def load_checkpoint(file_path: Path):
    # If file was corrupted on disk by bitrot, parses corrupted state into memory!
    return pickle.loads(file_path.read_bytes())
```

#### ✅ Compliant Canonical Pattern (SHA-256 Digest Verification)
```python
# Compliant: Recalculates and verifies cryptographic hash prior to parsing
import hashlib
from pathlib import Path

class ChecksumMismatchError(ValueError):
    pass

def load_verified_artifact(data_path: Path, expected_sha256: str) -> bytes:
    raw_bytes = data_path.read_bytes()
    actual_hash = hashlib.sha256(raw_bytes).hexdigest()
    if actual_hash.lower() != expected_sha256.lower():
        raise ChecksumMismatchError(
            f"Integrity check failed for {data_path.name}: "
            f"expected {expected_sha256}, got {actual_hash}"
        )
    return raw_bytes
```

---
[⬅️ Back to Data Corruption Defense (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
