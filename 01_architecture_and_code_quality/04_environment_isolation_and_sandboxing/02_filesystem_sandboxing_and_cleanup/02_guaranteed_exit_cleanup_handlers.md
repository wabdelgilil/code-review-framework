# [CHK-ARCH-0404] Guaranteed Exit Cleanup Handlers
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../../README.md) > [Environment Isolation & Sandboxing (Level 2)](../../README.md) > [Filesystem Sandboxing & Lifecycle Cleanup (Level 3)](../README.md) > **CHK-ARCH-0404 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-ARCH-0404` |
| **Sub-Pillar & Category** | Environment Isolation & Sandboxing / Filesystem Sandboxing & Lifecycle Cleanup |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | RAII (Resource Acquisition Is Initialization); ISO/IEC 25010 (Resource Utilization & Reliability) |
| **Target Entities** | File handles, child subprocesses, temporary lockfiles, socket bindings |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Any resource allocated during execution (temporary files, network ports, subprocesses, database locks) must be guaranteed to be released and cleaned up upon process termination, **even when the process encounters unhandled exceptions, assertions, or SIGINT / SIGTERM signals**.
* **Engineering Rationale:** Applications that do not clean up on unexpected failures leave orphaned zombie processes holding ports, unreleased lockfiles preventing system restart, and leaked temporary files that eventually exhaust disk inodes.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Orphaned Resource Count on Unhandled Abort:** Strictly `0` leftover locks, child processes, or temporary files following abnormal crash.
* **Cleanup Architecture:** `100%` of resource lifecycles must be bound to language context managers (`try...finally`, `using`, Python `with`, Rust Drop, or process signal traps).

---

### 4. Step-by-Step Verification Protocol
1. **Crash Simulation Injection:**
   * Execute a worker routine that opens temporary files and launches a subprocess.
   * Inject a deliberate unhandled exception or kill signal mid-execution.
2. **Resource Leak Audit:**
   * Verify that signal/exit hooks fire, child processes are terminated, and temporary scratch directories are unlinked.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Resources and temporary files are deterministically deleted upon both clean exit and abnormal crash.
* **`FAIL`:** Abruptly crashing the process leaves orphaned lockfiles, unclosed file descriptors, or lingering temporary files on the host system.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Vulnerable Manual Cleanup)
```python
# Prohibited: If process raises exception midway, file remains orphaned permanently
def process_data():
    tmp_file = open("/tmp/job.lock", "w")
    tmp_file.write("locked")
    # If a bug occurs here, close() is NEVER called, and the lock remains forever!
    do_unstable_calculation()
    tmp_file.close()
```

#### ✅ Compliant Canonical Pattern (Guaranteed Deterministic Cleanup via Context Manager)
```python
# Compliant: Deterministic release via context manager and atexit handler
import atexit
from contextlib import contextmanager
from pathlib import Path

@contextmanager
def locked_workspace(lock_path: Path):
    lock_path.touch(exist_ok=False)
    # Register defensive fallback for abrupt termination
    cleanup = lambda: lock_path.unlink(missing_ok=True)
    atexit.register(cleanup)
    try:
        yield lock_path
    finally:
        cleanup()
        atexit.unregister(cleanup)
```

---
[⬅️ Back to Filesystem Sandboxing & Lifecycle Cleanup (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
