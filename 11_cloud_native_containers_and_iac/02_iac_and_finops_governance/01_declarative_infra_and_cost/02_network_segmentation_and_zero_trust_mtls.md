# [CHK-INFRA-0202] Network Segmentation & Zero-Trust mTLS
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-INFRA] Cloud-Native, Containers & IaC (Level 1)](../../README.md) > [IaC, Zero-Trust & FinOps Governance (Level 2)](../README.md) > [Declarative IaC, Networking & FinOps (Level 3)](./README.md) > **CHK-INFRA-0202 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-INFRA-0202` |
| **Sub-Pillar & Category** | IaC, Zero-Trust & FinOps Governance / Declarative IaC, Networking & FinOps |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | NIST SP 800-207 (Zero Trust Architecture); CIS Cloud Networking Benchmarks |
| **Target Entities** | VPC subnets, security groups, Kubernetes NetworkPolicies, internal service-to-service traffic, database endpoints |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Databases, caches, message brokers, and internal admin interfaces must reside in **private subnets with zero public internet exposure (`0.0.0.0/0` strictly prohibited)**. Internal service-to-service communication must enforce **TLS/mTLS encryption in transit** and explicit allowlisted ingress/egress rules (default-deny `NetworkPolicy` / Security Groups).
* **Engineering Rationale:** Exposing database ports (`5432`, `6379`, `27017`) or unauthenticated internal microservices on public IPs or flat VPC networks enables trivial lateral movement and automated mass exploitation.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Publicly Accessible Data Stores:** Strictly `0` databases, Redis caches, or message brokers with public IP assignments or `0.0.0.0/0` ingress rules.
* **Plaintext Internal Traffic:** `0` unencrypted HTTP/DB connections across network boundaries in production.

---

### 4. Step-by-Step Verification Protocol
1. **Security Group / Policy Audit:**
   * Inspect IaC security groups and Kubernetes `NetworkPolicy` resources (e.g., via `checkov` / `tfsec`); fail CI on any `0.0.0.0/0` rule targeting non-edge ports.
2. **TLS Enforcement Verification:**
   * Confirm database connection strings enforce `sslmode=verify-full` (or `require`) and internal gateways enforce TLS 1.2+/mTLS.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Data stores are strictly private, ingress/egress rules follow default-deny least privilege, and all in-transit traffic is TLS/mTLS encrypted.
* **`FAIL`:** Databases or caches are publicly routable, security groups allow `0.0.0.0/0` on internal ports, or internal traffic runs in plaintext.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Public Database Port Open to Internet)
```hcl
# Prohibited: Exposes PostgreSQL directly to the entire internet
resource "aws_security_group_rule" "db_open" {
  type        = "ingress"
  from_port   = 5432
  to_port     = 5432
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}
```

#### ✅ Compliant Canonical Pattern (Private Subnet + Source Security Group Allowlist)
```hcl
# Compliant: Database accepts connections strictly from the application tier security group
resource "aws_security_group_rule" "db_from_app_only" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.postgres.id
  source_security_group_id = aws_security_group.app_backend.id
}
```

---
[⬅️ Back to Declarative IaC, Networking & FinOps (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
