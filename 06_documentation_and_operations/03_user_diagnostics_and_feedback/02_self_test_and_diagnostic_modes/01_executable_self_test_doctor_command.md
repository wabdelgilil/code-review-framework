# [CHK-UX-0302] Executable Self-Test & Diagnostic Doctor Command
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-UX] Documentation, DX & Operations (Level 1)](../../../README.md) > [User Diagnostics & Feedback (Level 2)](../../README.md) > [Self-Test & Diagnostic Modes (Level 3)](../README.md) > **CHK-UX-0302 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-UX-0302` |
| **Sub-Pillar & Category** | User Diagnostics & Feedback / Self-Test & Diagnostic Modes |
| **Classification** | **`[BEST PRACTICE]`** |
| **Governing Standard** | Homebrew / Flutter `doctor` Pattern; SRE Diagnostic Standards; ISO/IEC 25010 (Operability) |
| **Target Entities** | CLI entry points, diagnostic commands, system health probes |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** The application should provide a dedicated self-diagnostic command (e.g. `app --doctor` or `app check`) that validates: (1) runtime environment prerequisites, (2) database/network connectivity, (3) file permissions and directory presence, and (4) version compatibility, outputting a clear visual status checklist.
* **Engineering Rationale:** When a user or deployment fails, running a self-diagnostic command isolates whether the failure is an internal code bug or an external environment misconfiguration (such as missing write permissions or unreached hostnames) in seconds.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Diagnostic Check Duration:** $\le 3\text{ seconds}$ for full local environment doctor verification.
* **Exit Code Conformance:** Exit code `0` if all checks pass; non-zero exit code if any mandatory prerequisite is missing.

---

### 4. Step-by-Step Verification Protocol
1. **Doctor Command Invocation:**
   * Run the diagnostic command:
     ```bash
     python -m app.cli --doctor
     ```
2. **Missing Prerequisite Simulation:**
   * Delete or restrict permissions on a required directory; run the doctor command and verify it explicitly flags the missing directory with remediation steps.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** The system provides an executable self-test command that validates environment health and reports actionable pass/fail items.
* **`FAIL`:** The system provides no automated diagnostic self-test mechanism for diagnosing runtime environment failures.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Zero Environment Diagnostics)
```text
$ app --doctor
Unknown command: --doctor
# Users must manually guess which dependency or port is failing!
```

#### ✅ Compliant Canonical Pattern (Self-Diagnostic Checklist Output)
```text
$ app --doctor
[✓] Python Runtime: 3.11.8 (Compatible)
[✓] Configuration File: /etc/app/config.json (Valid schema)
[✓] Storage Directory: /var/data/app (Writable, 42GB free)
[✗] Database Connectivity: Connection refused at db.local:5432
    REMEDY: Verify PostgreSQL daemon is running on port 5432.
```

---
[⬅️ Back to Self-Test & Diagnostic Modes (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
