# [CHK-INFRA-0201] Declarative IaC & Automated Drift Detection
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-INFRA] Cloud-Native, Containers & IaC (Level 1)](../../README.md) > [IaC, Zero-Trust & FinOps Governance (Level 2)](../README.md) > [Declarative IaC, Networking & FinOps (Level 3)](./README.md) > **CHK-INFRA-0201 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-INFRA-0201` |
| **Sub-Pillar & Category** | IaC, Zero-Trust & FinOps Governance / Declarative IaC, Networking & FinOps |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Twelve-Factor App (Dev/Prod Parity); ISO/IEC 25010 (Maintainability & Reproducibility) |
| **Target Entities** | Terraform/OpenTofu/Pulumi/CDK stacks, remote state backends, cloud console permissions |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** All cloud infrastructure (VPCs, databases, buckets, IAM policies, DNS, queues) must be provisioned via **version-controlled declarative Infrastructure as Code (IaC)** with remote locked state and PR-reviewed `plan` diffs—strictly prohibiting manual console changes ("Zero ClickOps"). Scheduled **drift detection** jobs must alert on any out-of-band console modifications.
* **Engineering Rationale:** Manual console edits create unreproducible "snowflake" environments that cannot be rebuilt during disaster recovery and silently widen security groups without code review.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Unreconciled Production Drift:** Strictly `0` unapproved manual console changes detected by scheduled `terraform plan -detailed-exitcode`.
* **Remote State Locking:** `100%` of IaC state stored remotely with encryption at rest and concurrent write locking enabled.

---

### 4. Step-by-Step Verification Protocol
1. **State & Backend Inspection:**
   * Confirm IaC configs declare encrypted remote state with locking (no local `terraform.tfstate` committed to Git).
2. **Drift Check Execution:**
   * Run `terraform plan -detailed-exitcode` against staging/production in CI; exit code `0` confirms zero drift.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Infrastructure is 100% codified in versioned IaC with locked remote state, PR plan reviews, and scheduled drift detection.
* **`FAIL`:** Production infrastructure is configured manually via cloud console ClickOps or state files are stored locally/unencrypted.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Local State & Manual Console Edits)
```hcl
# Prohibited: Local state file, unversioned provider, manual security group tweaks in AWS Console
provider "aws" {
  region = "me-central-1"
}
```

#### ✅ Compliant Canonical Pattern (Locked Remote State + Pinned Providers + Drift CI)
```hcl
# Compliant: Encrypted remote state with lockfile + pinned provider versions
terraform {
  required_version = "~> 1.9.0"
  backend "s3" {
    bucket       = "org-prod-tfstate"
    key          = "core/terraform.tfstate"
    region       = "me-central-1"
    encrypt      = true
    use_lockfile = true
  }
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.80" }
  }
}
```

---
[⬅️ Back to Declarative IaC, Networking & FinOps (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
