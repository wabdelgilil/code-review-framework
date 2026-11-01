# [CHK-RES-0402] Explicit Directory & Buffer Syncing (fsync)
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-RES] Resilience, Error Handling & Security (Level 1)](../../../README.md) > [Data Safety & Atomic I/O (Level 2)](../../README.md) > [Atomic Write Operations (Level 3)](../README.md) > **CHK-RES-0402 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-RES-0402` |
| **Sub-Pillar & Category** | Data Safety & Atomic I/O / Atomic Write Operations |
| **Classification** | **`[BEST PRACTICE]`** |
| **Governing Standard** | POSIX `fsync()` Standards; Database Durability (ACID "D"); SQLite WAL / PostgreSQL fsync Design |
| **Target Entities** | Critical transaction logs, state snapshot engines, database journals |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** In persistence paths where durability is strictly required, writing data must be accompanied by explicit calls to `os.fsync(fd)` (to flush OS kernel page caches to non-volatile physical storage), followed by syncing the containing parent directory descriptor.
* **Engineering Rationale:** Calling `file.write()` or `file.close()` only moves bytes into the operating system's volatile page cache. If physical host power cuts before the kernel flushes to disk (which can take up to 30 seconds), the file on disk remains empty or corrupted despite the application having closed it cleanly.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Durability Flush Compliance:** Critical persistent write paths must issue `flush()` + `fsync()` prior to signaling success to the user.
* **Kernel Cache Vulnerability Window:** Reduced to `0` milliseconds for mission-critical write boundaries.

---

### 4. Step-by-Step Verification Protocol
1. **Source Code Audit for fsync:**
   * Review persistence modules. Verify that file writes invoke `flush()` followed by `os.fsync()` before renaming or committing transactions.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Critical file write operations explicitly sync file descriptors to physical hardware prior to returning success.
* **`FAIL`:** The application relies on asynchronous kernel flushing without `fsync` for critical financial or state journal files.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Closing File Without fsync)
```python
# Prohibited: Closes file without flushing OS kernel page cache
with open("critical_journal.log", "w") as f:
    f.write("TX_COMMITTED")
# If power drops 1 second later, data in kernel cache is lost!
```

#### ✅ Compliant Canonical Pattern (Guaranteed Physical Flush via fsync)
```python
# Compliant: Explicitly forces OS to flush page buffers to physical storage
import os

def write_durable_record(file_path: str, content: str) -> None:
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
        f.flush()
        # Force kernel to write bytes to physical storage medium
        os.fsync(f.fileno())
```

---
[⬅️ Back to Atomic Write Operations (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
