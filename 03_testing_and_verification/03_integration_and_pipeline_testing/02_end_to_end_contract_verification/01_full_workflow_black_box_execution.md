# [CHK-TEST-0303] Full Workflow Black-Box Execution
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-TEST] Testing & Verification Suite (Level 1)](../../../README.md) > [Integration & Pipeline Testing (Level 2)](../../README.md) > [End-to-End Contract Verification (Level 3)](../README.md) > **CHK-TEST-0303 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-TEST-0303` |
| **Sub-Pillar & Category** | Integration & Pipeline Testing / End-to-End Contract Verification |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Black-Box System Verification (ISO/IEC/IEEE 29119); End-to-End Workflow Acceptance |
| **Target Entities** | CLI workflows, complete API cycles, ingestion-to-report generation cycles |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** The verification suite must include at least one **pure black-box End-to-End (E2E) integration test** that executes a full business cycle from the entry boundary (CLI arguments, raw input file) to final output artifacts, without mocking internal domain components or bypassing operational layers.
* **Engineering Rationale:** Unit tests can achieve 100% code coverage while the integrated application completely fails to run due to mismatched method signatures, misconfigured dependency injection roots, or malformed configuration files.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **E2E Cycle Coverage:** Minimum `1` end-to-end black-box test covering the primary "Happy Path" and `1` covering a critical failure scenario.
* **Internal Mocking Allowance:** Strictly `0` internal domain mocks in the E2E verification test (only external third-party network egress may be stubbed).

---

### 4. Step-by-Step Verification Protocol
1. **Subprocess / External Invocation Test:**
   * Invoke the application from the outside using its published CLI or entry function:
     ```bash
     python -m app.cli --input data/sample.csv --output dist/report.json
     ```
2. **Output Artifact Assertion:**
   * Verify that the output artifact exists on disk, parses cleanly, and passes structural and mathematical schema validations.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** The application executes end-to-end as an integrated whole, producing verified output artifacts with zero internal mocking.
* **`FAIL`:** The codebase lacks a full end-to-end black-box test, or tests rely entirely on mocked internal service boundaries.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Purely Mocked Integration Test)
```python
# Prohibited: Every component is mocked; nothing is actually integrated!
def test_workflow():
    mock_ingest = Mock()
    mock_engine = Mock()
    mock_exporter = Mock()
    # This test passes even if the real modules cannot talk to each other!
    mock_ingest.run()
    mock_engine.run()
    assert True
```

#### ✅ Compliant Canonical Pattern (Real Black-Box Process Invocation)
```python
# Compliant: Real subprocess execution testing real entry point and filesystem output
import subprocess
import json
import tempfile
from pathlib import Path

def test_full_cli_workflow_e2e():
    with tempfile.TemporaryDirectory() as tmpdir:
        output_file = Path(tmpdir) / "output.json"
        result = subprocess.run(
            ["python", "-m", "app.cli", "--input", "tests/fixtures/sample.csv", "--output", str(output_file)],
            capture_output=True,
            text=True
        )
        assert result.returncode == 0, f"CLI crashed: {result.stderr}"
        assert output_file.exists(), "Output file was not created"
        
        # Verify output artifact integrity
        data = json.loads(output_file.read_text(encoding="utf-8"))
        assert data["status"] == "SUCCESS"
        assert len(data["results"]) > 0
```

---
[⬅️ Back to End-to-End Contract Verification (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
