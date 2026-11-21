# [CHK-DATA-0201] Server-Side Authorization & RBAC Authority
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-DATA] Data Architecture, Multi-Tenancy & Compliance (Level 1)](../../README.md) > [Multi-Tenancy & Access Control (Level 2)](../README.md) > [Tenant Isolation & RLS (Level 3)](./README.md) > **CHK-DATA-0201 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-DATA-0201` |
| **Sub-Pillar & Category** | Multi-Tenancy & Access Control / Tenant Isolation & RLS |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | OWASP ASVS v4.0 (V4.1 General Access Control); OWASP API1 & API5 (BOLA/BFLA); NIST SP 800-53 (AC-6 Least Privilege) |
| **Target Entities** | HTTP/GraphQL/RPC route handlers, server actions, background job triggers, RBAC/ABAC policy guards |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** All authentication, role-based/attribute-based authorization (RBAC/ABAC), resource ownership checks, and workflow state transitions must be enforced **exclusively on the server** using a **deny-by-default** policy. Client-side permission checks (e.g., hiding buttons or routes in React/Flutter) exist solely for UX convenience and are never a security boundary.
* **Engineering Rationale:** Any client-side control can be trivially bypassed via `curl`, browser DevTools, or modified mobile binaries. Missing server-side function-level or object-level authorization (BFLA/BOLA) is the #1 root cause of critical privilege escalation breaches in modern web and SaaS APIs.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Unprotected Mutating/Private Endpoints:** Strictly `0` non-public routes lacking explicit server-side authentication and permission guards.
* **Unauthorized Request Rejection Rate:** `100%` of requests from unauthenticated callers return `401 Unauthorized`, and `100%` of requests from authenticated callers lacking the required permission/scope return `403 Forbidden`.

---

### 4. Step-by-Step Verification Protocol
1. **Route Guard Coverage Audit:**
   * Enumerate all API routes and server actions; verify every non-public endpoint explicitly declares its required permission/policy guard (default-deny middleware).
2. **Negative Authorization Integration Tests:**
   * Execute automated tests calling every privileged endpoint with (a) no token (`401`), (b) a low-privilege role token (`403`), and (c) an authorized role token (`200`/`201`).
3. **Object-Level Ownership Check (BOLA):**
   * Attempt to read or mutate a resource belonging to another scope/site/user using a valid low-privilege token and confirm strict `403`/`404` rejection.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Every private endpoint enforces server-side auth and RBAC/ABAC scope checks with deny-by-default semantics and verified `401`/`403` integration tests.
* **`FAIL`:** Any endpoint relies on UI hiding for access control, omits object-level ownership/scope verification, or allows privilege escalation via forged parameters.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (UI-Only Check & Unchecked Route)
```typescript
// Prohibited: Relies on frontend hiding the "Approve" button; server only checks login
app.post('/api/v1/purchase-orders/:id/approve', requireAuth, async (req, res) => {
  // Missing RBAC permission check and site/scope verification!
  await poService.approve(req.params.id, req.user.id);
  res.json({ ok: true });
});
```

#### ✅ Compliant Canonical Pattern (Server-Side Deny-by-Default RBAC + Scope)
```typescript
// Compliant: Explicit permission guard + server-derived scope verification
app.post(
  '/api/v1/purchase-orders/:id/approve',
  requireAuth,
  requirePermission('procurement.po.approve'),
  async (req, res) => {
    const actor = req.authContext; // Verified server-side session context
    const po = await poService.approveWithScope({
      purchaseOrderId: req.params.id,
      tenantId: actor.tenantId,
      allowedSiteIds: actor.siteScopes,
      actorId: actor.userId,
    });
    res.status(200).json({ data: po });
  }
);
```

---
[⬅️ Back to Tenant Isolation & RLS (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
