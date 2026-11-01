# [CHK-UX-0401] Symptom-Cause-Remedy Troubleshooting Matrix
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-UX] Documentation, DX & Operations (Level 1)](../../../README.md) > [Maintainability & Troubleshooting (Level 2)](../../README.md) > [Troubleshooting Matrices (Level 3)](../README.md) > **CHK-UX-0401 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-UX-0401` |
| **Sub-Pillar & Category** | Maintainability & Troubleshooting / Troubleshooting Matrices |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | ITSM Problem Management; Runbook Automation; ISO/IEC 25010 (Maintainability) |
| **Target Entities** | `docs/TROUBLESHOOTING.md`, operational playbooks, error catalogs |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** The repository documentation must include an indexed **Symptom-Cause-Remedy Troubleshooting Matrix**. For every known error message, abnormal symptom, or operational failure, the matrix must explicitly state: (1) Observed Symptom / Error string, (2) Root Cause, (3) Diagnostic Command to confirm, and (4) Verified Step-by-Step Remedy.
* **Engineering Rationale:** Developers and operations engineers spend hours reinventing solutions to problems colleagues already resolved. A centralized troubleshooting matrix slashes Mean Time To Recovery (MTTR) during outages.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Known Failure Coverage:** Minimum 5 documented failure syndromes in `docs/TROUBLESHOOTING.md`.
* **Remedy Completeness:** 100% of matrix entries must include exact diagnostic and resolution commands.

---

### 4. Step-by-Step Verification Protocol
1. **Troubleshooting Document Audit:**
   * Review `docs/TROUBLESHOOTING.md`.
   * Verify it contains a structured table mapping errors to root causes and verified commands.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** A structured troubleshooting matrix exists with documented symptoms, causes, and verified fixes.
* **`FAIL`:** The repository has no troubleshooting documentation, leaving operators to debug common failures from scratch.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Zero Troubleshooting Documentation)
```text
# docs/ directory has no TROUBLESHOOTING.md!
# When connection fails, operators search Slack history hoping someone solved it before!
```

#### ✅ Compliant Canonical Pattern (Structured Symptom-Cause-Remedy Matrix)
```markdown
# Troubleshooting Matrix

| Observed Symptom | Potential Root Cause | Verification Command | Verified Remedy |
| :--- | :--- | :--- | :--- |
| `ConnectionRefusedError: [Errno 111]` | Backend database service is stopped or port blocked | `nc -zv 127.0.0.1 5432` | Start service: `systemctl start postgresql` |
| `ChecksumMismatchError` on startup | Saved artifact was partially written or corrupted | `sha256sum data/cache.bin` | Re-generate cache: `app --rebuild-cache` |
| `PermissionDenied: /var/log/app` | Host process lacks write permissions to log directory | `ls -ld /var/log/app` | Fix ownership: `sudo chown -R app:app /var/log/app` |
```

---
[⬅️ Back to Troubleshooting Matrices (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
