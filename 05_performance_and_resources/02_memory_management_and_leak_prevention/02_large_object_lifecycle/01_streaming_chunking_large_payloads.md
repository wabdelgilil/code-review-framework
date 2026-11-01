# [CHK-PERF-0203] Streaming and Chunking for Large Payloads
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-PERF] Performance & Resource Efficiency (Level 1)](../../../README.md) > [Memory Management & Leak Prevention (Level 2)](../../README.md) > [Large Object Lifecycle (Level 3)](../README.md) > **CHK-PERF-0203 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-PERF-0203` |
| **Sub-Pillar & Category** | Memory Management & Leak Prevention / Large Object Lifecycle |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Streaming I/O Design Patterns (Reactive Streams); Node.js / POSIX Stream Standards |
| **Target Entities** | File parsers, CSV/JSON ingest routines, bulk export engines, database cursor readers |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Data files, network payloads, or export batches whose size can exceed **10 Megabytes (10MB)** must be processed using **streaming iterators or chunked buffers**. Reading entire unbounded files or full database result sets completely into memory (`file.read()`, `SELECT *` without limit/cursor) is strictly prohibited.
* **Engineering Rationale:** Loading a 500MB CSV file completely into memory via `read()` consumes 2GB+ of RAM due to object wrapping and string representations, instantly triggering OOM crashes on containers running with modest memory allocations.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Maximum In-Memory Buffer Chunk Size:** $\le 64\text{KB}$ per read chunk.
* **Full-Payload Readall Prohibition:** Strictly `0` unbounded `.read()` or `.fetchall()` invocations on files/queries exceeding 10MB.

---

### 4. Step-by-Step Verification Protocol
1. **Source Inspection for Unbounded Reads:**
   * Search for `file.read()` without size arguments or `.fetchall()` on database queries:
     ```bash
     grep -rEn "\.read\(\)" src/
     ```
2. **Large File Streaming Test:**
   * Feed a 100MB synthetic dataset into the pipeline while monitoring memory.
   * Verify process memory usage remains flat ($\le 50\text{MB}$ peak RSS) throughout the entire processing run.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Large inputs are consumed via streaming iterators with peak memory consumption remaining flat.
* **`FAIL`:** The system buffers complete large files into RAM, causing memory spikes proportional to input file size.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Loading Entire File into Memory Buffer)
```python
# Prohibited: Loading entire multi-gigabyte file into memory at once!
def parse_huge_file(file_path: str):
    with open(file_path, "r") as f:
        content = f.read()  # Allocates entire file size in RAM simultaneously!
    for line in content.splitlines():
        process(line)
```

#### ✅ Compliant Canonical Pattern (Streaming Generator Iteration)
```python
# Compliant: Reads file line-by-line using constant memory streaming
from collections.abc import Iterator

def stream_huge_file(file_path: str) -> Iterator[str]:
    """Streams file lazily line-by-line: O(1) memory usage regardless of file size."""
    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:  # Stream buffered by OS, constant memory
            yield line.strip()
```

---
[⬅️ Back to Large Object Lifecycle (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
