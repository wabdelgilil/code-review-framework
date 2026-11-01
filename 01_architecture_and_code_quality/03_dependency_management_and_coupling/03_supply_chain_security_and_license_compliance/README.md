# [ARCH-03-03] Supply Chain Security & License Compliance
## Level 3 Category Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../README.md) > [Dependency Management & Coupling (Level 2)](../README.md) > **Supply Chain Security & License Compliance (Level 3)**

---

### 🎯 Purpose & Scope
Continuously scan third-party libraries for known vulnerabilities (CVEs via automated SCA), enforce open-source license compliance (prohibiting viral copyleft in proprietary software), and protect against typosquatting and dependency confusion attacks.

---

### 📜 Governing Standards
NIST SP 800-161 (Supply Chain Risk Management); OWASP Top 10 A06:2021; SPDX License Standards; SLSA Level 3.

---

### 📋 Level 4: Atomic Checkpoints Specification

| Checkpoint Code | Atomic Checkpoint Name | Classification | Verification Specification Link |
| :---: | :--- | :---: | :---: |
| `CHK-ARCH-0305` | **Automated Software Composition Analysis (SCA) & CVE Scanning** | `[MANDATORY]` | [📄 View Checkpoint Specification](./01_automated_sca_cve_scanning.md) |
| `CHK-ARCH-0306` | **Open-Source License Compliance & Viral Copyleft Prevention** | `[MANDATORY]` | [📄 View Checkpoint Specification](./02_license_compliance_copyleft_defense.md) |
| `CHK-ARCH-0307` | **Typosquatting & Package Provenance Verification** | `[BEST PRACTICE]` | [📄 View Checkpoint Specification](./03_typosquatting_provenance_verification.md) |

---
[⬅️ Back to Sub-Pillar (Level 2)](../README.md) | [🏠 Back to Root Index](../../../README.md)
