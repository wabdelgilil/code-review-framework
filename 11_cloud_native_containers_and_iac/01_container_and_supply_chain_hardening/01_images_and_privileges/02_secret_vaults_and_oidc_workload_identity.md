# [CHK-INFRA-0102] Secret Vaults & OIDC Workload Identity
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-INFRA] Cloud-Native, Containers & IaC (Level 1)](../../README.md) > [Container & Identity Hardening (Level 2)](../README.md) > [Images, Privileges & Workload Identity (Level 3)](./README.md) > **CHK-INFRA-0102 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-INFRA-0102` |
| **Sub-Pillar & Category** | Container & Identity Hardening / Images, Privileges & Workload Identity |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | NIST SP 800-53 (IA-5, SC-12); OWASP Secrets Management Cheat Sheet |
| **Target Entities** | CI/CD workflows, cloud IAM roles, secret managers (AWS Secrets Manager, GCP Secret Manager, Vault), `.env` configs |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Production secrets (database credentials, signing keys, third-party API keys) must be stored in a dedicated **encrypted Secret Vault** with automated rotation and access auditing—never in plaintext `.env` files on shared servers or CI logs. CI/CD pipelines and cloud workloads must authenticate using **short-lived OIDC Workload Identity federation** (e.g., GitHub Actions OIDC, IRSA, GCP Workload Identity) rather than long-lived static cloud access keys (`AWS_ACCESS_KEY_ID` / JSON service account keys).
* **Engineering Rationale:** Static cloud keys rarely rotate, frequently leak in CI logs or developer laptops, and grant persistent lateral access until manually revoked.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Long-Lived Static Cloud IAM Keys in CI:** Strictly `0` static service account JSON files or permanent IAM access keys stored in CI secrets where OIDC federation is supported.
* **Token Lifetime:** Ephemeral workload identity tokens expire within $\le 60\text{ minutes}$.

---

### 4. Step-by-Step Verification Protocol
1. **CI Workflow Audit:**
   * Inspect `.github/workflows/*.yml` and deployment configs; confirm `permissions: id-token: write` with OIDC role assumption instead of static cloud access keys.
2. **Runtime Secret Injection Check:**
   * Verify production secrets are mounted from a managed Secret Manager / Vault with audit logging enabled.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Workloads and CI pipelines use short-lived OIDC federation and managed secret vaults with rotation policies and zero static cloud keys.
* **`FAIL`:** CI pipelines rely on permanent static IAM keys or production secrets are distributed as unencrypted `.env` files.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Static Permanent Cloud Keys in CI)
```yaml
# Prohibited: Long-lived static IAM keys that never expire automatically
- uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

#### ✅ Compliant Canonical Pattern (Short-Lived OIDC Workload Identity)
```yaml
# Compliant: Ephemeral OIDC token scoped strictly to this repo/branch
permissions:
  id-token: write
  contents: read

steps:
  - uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::123456789012:role/github-prod-deploy
      aws-region: me-central-1
```

---
[⬅️ Back to Images, Privileges & Workload Identity (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
