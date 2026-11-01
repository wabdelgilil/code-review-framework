# [CHK-PERF-0302] Automated Artifact Retention & Pruning Policy
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-PERF] Performance & Resource Efficiency (Level 1)](../../../README.md) > [Disk I/O & Artifact Lifecycle (Level 2)](../../README.md) > [Artifact Retention & Pruning (Level 3)](../README.md) > **CHK-PERF-0302 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-PERF-0302` |
| **Sub-Pillar & Category** | Disk I/O & Artifact Lifecycle / Artifact Retention & Pruning |
| **Classification** | **`[BEST PRACTICE]`** |
| **Governing Standard** | Data Lifecycle Management (DLM); Storage Capacity Planning; ISO/IEC 25010 |
| **Target Entities** | Temporary run outputs, export files, build artifacts, log archives |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Any subsystem that generates artifacts on disk (reports, exports, temporary cache directories, logs) must provide an **automated retention and pruning mechanism** governed by explicit expiration policies (e.g. prune artifacts older than 14 days or retain maximum 50 most recent runs).
* **Engineering Rationale:** Systems without automated artifact lifecycle management experience "death by disk fill": disk storage quietly exhausts over months of production runs, eventually causing sudden database crashes and filesystem write lockouts.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Maximum Artifact Age (Scratch/Temp):** $\le 7$ days (or configurable TTL).
* **Disk Quota Alert:** Systems must alert or prune automatically when temporary disk consumption exceeds defined limits (e.g. 5GB).

---

### 4. Step-by-Step Verification Protocol
1. **Pruning Routine Verification:**
   * Run the automated cleanup or pruning job against a simulated directory of aged files.
   * Verify files exceeding the retention window are deleted while newer files remain intact.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** An automated pruning routine exists and correctly purges expired artifacts based on retention policies.
* **`FAIL`:** Artifacts accumulate on disk indefinitely without any retention cap or cleanup mechanism.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Indefinite Disk Accumulation)
```python
# Prohibited: Generates new file on every run, never cleans up old files!
def export_job_report(data: dict):
    filename = f"/var/reports/report_{uuid.uuid4()}.json"
    with open(filename, "w") as f:
        json.dump(data, f)
    # Never pruned! Over 1 year, creates 100,000 files and exhausts disk inodes!
```

#### ✅ Compliant Canonical Pattern (Automated Age-Based Pruning Policy)
```python
# Compliant: Automated pruning of files exceeding retention threshold
import time
from pathlib import Path

def prune_expired_artifacts(directory: Path, retention_days: int = 14) -> int:
    cutoff_time = time.time() - (retention_days * 86400)
    pruned_count = 0
    for file_path in directory.glob("*.json"):
        if file_path.stat().st_mtime < cutoff_time:
            file_path.unlink()
            pruned_count += 1
    return pruned_count
```

---
[⬅️ Back to Artifact Retention & Pruning (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
