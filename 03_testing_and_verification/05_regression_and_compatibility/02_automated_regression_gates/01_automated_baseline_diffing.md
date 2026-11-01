# [CHK-TEST-0503] Automated Baseline Diffing & CI Regression Gates
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-TEST] Testing & Verification Suite (Level 1)](../../../README.md) > [Regression & Backward Compatibility (Level 2)](../../README.md) > [Automated Regression Gates (Level 3)](../README.md) > **CHK-TEST-0503 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-TEST-0503` |
| **Sub-Pillar & Category** | Regression & Backward Compatibility / Automated Regression Gates |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Continuous Integration & Automated Delivery Gates; ISO/IEC/IEEE 29119 (Regression Testing) |
| **Target Entities** | CI/CD pipeline workflows, pull request gates, baseline comparison scripts |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Continuous Integration (CI) pipelines must execute **automated regression comparison gates** comparing the generated output of the current branch against stored golden baseline results from the main branch. Any unexplained drift in mathematical output, schema format, or performance triggers an automatic CI build failure.
* **Engineering Rationale:** Regressions are rarely intentional; they are introduced as unintended side-effects of unrelated bug fixes or dependency upgrades. Automated baseline diffing acts as an impartial safety net catching silent behavioral drift before code merges.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Unapproved Baseline Output Diff:** Strictly `0` unexplained byte or numerical differences against the verified baseline.
* **CI Regression Test Gate:** `100%` of PRs must run and pass the automated regression suite before merge permissions are granted.

---

### 4. Step-by-Step Verification Protocol
1. **Automated Baseline Comparison Run:**
   * Run the regression suite comparing output against `baselines/stable_output.json`:
     ```bash
     python -m tests.regression.diff_against_baseline --target dist/current_output.json
     ```
2. **Structural and Value Diff Inspection:**
   * Assert that any diff output is empty or accounted for by an explicitly approved baseline update commit.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Current branch outputs match stored baseline outputs with zero unexplained numerical or structural drift.
* **`FAIL`:** The regression gate detects differences between current output and baseline without an approved specification update.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Merging Without Automated Regression Gate)
```yaml
# Prohibited: CI runs only basic linter; regression errors slip into production!
name: CI
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: flake8 . # No regression diffing!
```

#### ✅ Compliant Canonical Pattern (Enforced CI Regression Gate with Diff Checking)
```yaml
# Compliant: Automated regression baseline diff blocking PRs on unauthorized drift
name: Automated Quality & Regression Gate
on: [pull_request]
jobs:
  regression-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Full Pipeline Output
        run: python -m app.cli --input tests/fixtures/standard_input.csv --output /tmp/run_out.json
      - name: Verify Zero Drift Against Golden Baseline
        run: |
          python tests/tools/compare_baselines.py \
            --baseline tests/baselines/golden_v1.json \
            --current /tmp/run_out.json \
            --tolerance-rel 1e-5
```

---
[⬅️ Back to Automated Regression Gates (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
