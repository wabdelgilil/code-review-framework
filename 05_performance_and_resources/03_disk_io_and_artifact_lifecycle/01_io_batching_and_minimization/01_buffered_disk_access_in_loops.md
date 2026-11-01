# [CHK-PERF-0301] Buffered Disk Access in Iteration Loops
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-PERF] Performance & Resource Efficiency (Level 1)](../../../README.md) > [Disk I/O & Artifact Lifecycle (Level 2)](../../README.md) > [I/O Batching & Minimization (Level 3)](../README.md) > **CHK-PERF-0301 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-PERF-0301` |
| **Sub-Pillar & Category** | Disk I/O & Artifact Lifecycle / I/O Batching & Minimization |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Buffered I/O Optimization Standards; System Call Minimization; ISO/IEC 25010 |
| **Target Entities** | File write loops, export generators, logging sinks, database batch inserts |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Performing individual disk write or read operations inside tight iteration loops (e.g. calling `file.write()` or executing single-row `INSERT` queries $N$ times inside a loop) is **strictly prohibited**. Disk access must be batched using in-memory buffers or bulk transactional writes.
* **Engineering Rationale:** Every individual disk write or database call incurs operating system context switches, kernel syscall overhead, and disk IOPS latency ($\approx 10\text{ms}$ per roundtrip). Batching 1,000 writes into a single buffer reduces execution time from 10 seconds to 10 milliseconds.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Disk Syscall Count:** Reduced by $\ge 95\%$ via batching compared to unbuffered single-element writes.
* **Buffer Flush Size:** Flushes to disk should occur in chunks of $\ge 4\text{KB}$ to $\le 1\text{MB}$.

---

### 4. Step-by-Step Verification Protocol
1. **Syscall Trace Monitoring:**
   * Run the export routine with syscall profiling (e.g. `strace -c` on Linux or process monitor).
   * Confirm the number of `write()` system calls is proportional to total data size / buffer size, NOT the number of rows.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All persistent writes in iteration loops are buffered in memory and written in bulk batches.
* **`FAIL`:** Loops perform individual unbuffered disk writes or single-record database commits on every iteration.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Unbuffered Write in Loop)
```python
# Prohibited: Issues 100,000 individual disk write calls!
def export_data(records: list[str], path: str):
    with open(path, "w") as f:
        for record in records:
            f.write(record + "\n")  # Unbuffered syscall overhead on every line!
```

#### ✅ Compliant Canonical Pattern (Buffered Bulk Batch Write)
```python
# Compliant: Buffered write grouping lines before flushing to disk
def export_data_buffered(records: list[str], path: str, batch_size: int = 5000) -> None:
    with open(path, "w", buffering=64 * 1024, encoding="utf-8") as f:
        buffer = []
        for record in records:
            buffer.append(record)
            if len(buffer) >= batch_size:
                f.write("\n".join(buffer) + "\n")
                buffer.clear()
        if buffer:
            f.write("\n".join(buffer) + "\n")
```

---
[⬅️ Back to I/O Batching & Minimization (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
