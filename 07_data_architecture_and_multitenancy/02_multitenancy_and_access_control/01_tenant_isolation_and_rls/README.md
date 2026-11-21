# [DATA-02-01] Tenant Isolation & RLS
## Level 3 Category Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-DATA] Data Architecture, Multi-Tenancy & Compliance (Level 1)](../../README.md) > [Multi-Tenancy & Access Control (Level 2)](../README.md) > **Tenant Isolation & RLS (Level 3)**

---

### 🎯 Purpose & Scope
Prevent unauthorized privilege escalation and cross-tenant data leakage across all API routes, background jobs, search indexes, exports, and storage paths.

---

### 📜 Governing Standards
OWASP ASVS v4.0 (V4: Access Control); NIST SP 800-53 (AC-3, AC-6); Multi-Tenant SaaS Security Architecture.

---

### 📋 Level 4: Atomic Checkpoints Specification

| Checkpoint Code | Atomic Checkpoint Name | Classification | Verification Specification Link |
| :---: | :--- | :---: | :---: |
| `CHK-DATA-0201` | **Server-Side Authorization & RBAC Authority** | `[MANDATORY]` | [📄 View Checkpoint Specification](./01_server_side_authority_and_rbac.md) |
| `CHK-DATA-0202` | **Strict Multi-Tenant Isolation & Database RLS** | `[MANDATORY]` | [📄 View Checkpoint Specification](./02_strict_multitenant_isolation_and_rls.md) |

---
[⬅️ Back to Sub-Pillar (Level 2)](../README.md) | [🏠 Back to Root Index](../../../README.md)
