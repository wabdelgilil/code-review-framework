# [INFRA-01-01] Images, Privileges & Workload Identity
## Level 3 Category Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-INFRA] Cloud-Native, Containers & IaC (Level 1)](../../README.md) > [Container & Identity Hardening (Level 2)](../README.md) > **Images, Privileges & Workload Identity (Level 3)**

---

### 🎯 Purpose & Scope
Ensure containers run with minimal privileges from pinned, scanned base images and authenticate to cloud services via ephemeral OIDC tokens rather than long-lived static keys.

---

### 📜 Governing Standards
CIS Docker & Kubernetes Benchmarks; NIST SP 800-190 (Container Security); Cloud Security Alliance (CSA) Best Practices.

---

### 📋 Level 4: Atomic Checkpoints Specification

| Checkpoint Code | Atomic Checkpoint Name | Classification | Verification Specification Link |
| :---: | :--- | :---: | :---: |
| `CHK-INFRA-0101` | **Non-Root Minimal Containers & Image Scanning** | `[MANDATORY]` | [📄 View Checkpoint Specification](./01_non_root_minimal_containers_and_scanning.md) |
| `CHK-INFRA-0102` | **Secret Vaults & OIDC Workload Identity** | `[MANDATORY]` | [📄 View Checkpoint Specification](./02_secret_vaults_and_oidc_workload_identity.md) |

---
[⬅️ Back to Sub-Pillar (Level 2)](../README.md) | [🏠 Back to Root Index](../../../README.md)
