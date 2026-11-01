# [CHK-ARCH-0305] Automated Software Composition Analysis (SCA) & CVE Scanning
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../../README.md) > [Dependency Management & Coupling (Level 2)](../../README.md) > [Supply Chain Security & License Compliance (Level 3)](../README.md) > **CHK-ARCH-0305 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-ARCH-0305` |
| **Sub-Pillar & Category** | Dependency Management & Coupling / Supply Chain Security & License Compliance |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | NIST SP 800-161 (Supply Chain Risk Management); OWASP Top 10 A06:2021 (Vulnerable and Outdated Components); SLSA Level 3 |
| **Target Entities** | Direct and transitive package dependencies (`package.json`, `poetry.lock`, `Cargo.lock`, `requirements.txt`) |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** All third-party dependencies (both direct and transitive) must be continuously scanned against official vulnerability databases (National Vulnerability Database / NVD, GitHub Advisory Database, OSV) using **automated Software Composition Analysis (SCA)** tools in CI. The codebase must contain **zero unresolved Critical or High severity CVEs**.
* **Engineering Rationale:** Exploits in popular open-source dependencies (e.g. Log4j, event-stream, colors.js) allow attackers to achieve remote code execution (RCE) or data exfiltration without ever finding a flaw in the application's proprietary code.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Critical / High CVEs Allowed:** Strictly `0` unresolved Critical ($\text{CVSS} \ge 9.0$) or High ($\text{CVSS} \ge 7.0$) vulnerabilities in production paths.
* **Medium CVE Remediation Horizon:** $\le 30$ days to patch or provide a formal mitigating controls waiver.
* **Scan Frequency:** `100%` of CI pull request builds and daily scheduled audit runs must execute SCA scans.

---

### 4. Step-by-Step Verification Protocol
1. **Automated Vulnerability Scan Execution:**
   * Run the designated SCA scanner against lockfiles:
     ```bash
     # Example for Python
     pip-audit -r requirements.txt --strict
     # Example for Node.js
     npm audit --audit-level=high
     # Universal scanner
     trivy fs --severity HIGH,CRITICAL .
     ```
   * Confirm scanner exits with code `0`.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** SCA scanning verifies zero unresolved High or Critical CVEs across the entire dependency graph.
* **`FAIL`:** Any dependency contains a known vulnerability with $\text{CVSS} \ge 7.0$ without an approved compensating control waiver.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Outdated Library with Known Critical CVE)
```json
// Prohibited: Using vulnerable versions with known Remote Code Execution (RCE) flaws!
{
  "dependencies": {
    "lodash": "4.17.15" // Vulnerable to Prototype Pollution (CVE-2020-8203, CVSS 7.4)
  }
}
```

#### ✅ Compliant Canonical Pattern (Patched Dependencies Enforced by CI Audit)
```yaml
# Compliant: Automated CI gate fails build if any known vulnerability is detected
name: Security Supply Chain Audit
on: [push, pull_request]
jobs:
  sca-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Dependency Vulnerability Audit
        run: |
          pip-audit --strict --desc on
```

---
[⬅️ Back to Supply Chain Security & License Compliance (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
