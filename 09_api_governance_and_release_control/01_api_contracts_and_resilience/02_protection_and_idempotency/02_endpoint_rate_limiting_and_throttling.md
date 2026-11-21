# [CHK-API-0104] Endpoint Rate Limiting & Throttling
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-API] API Governance, Delivery & Execution (Level 1)](../../README.md) > [API Contracts & Resilience (Level 2)](../README.md) > [Protection & Idempotency (Level 3)](./README.md) > **CHK-API-0104 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-API-0104` |
| **Sub-Pillar & Category** | API Contracts & Resilience / Protection & Idempotency |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | OWASP API4:2023 (Unrestricted Resource Consumption); IETF `RateLimit` Header Fields |
| **Target Entities** | Authentication routes (login, OTP, password reset), public endpoints, full-text search, heavy export/report routes |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Authentication, public, search, sync, and heavy export endpoints must enforce **explicit rate limiting and throttling** backed by a shared store (e.g., Redis/edge WAF) in multi-instance deployments. Exceeding limits must return **`429 Too Many Requests`** with a `Retry-After` header.
* **Engineering Rationale:** Unthrottled login and OTP routes invite credential stuffing and brute-force attacks. Unthrottled export, PDF generation, or search endpoints allow a single misbehaving script or malicious actor to exhaust database pools and cause a tenant-wide denial of service.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Auth/OTP Endpoints:** Strict per-IP and per-account limits (e.g., $\le 5\text{–}10$ attempts per minute with progressive lockout).
* **Heavy Export/Search Endpoints:** Explicit per-tenant/per-user burst and sustained limits returning `429` + `Retry-After` upon breach.
* **Unprotected Auth/Public Routes:** Strictly `0`.

---

### 4. Step-by-Step Verification Protocol
1. **Middleware & Gateway Audit:**
   * Verify rate-limit middleware or API gateway policies are attached to `/auth/*`, `/search`, `/export`, and public webhook routes.
2. **Automated Burst Test:**
   * Send $N+1$ rapid requests against `/auth/login` in an integration test and assert the $(N+1)$-th response returns HTTP `429` with a valid `Retry-After` header.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Sensitive, public, and resource-intensive endpoints enforce distributed rate limits and return `429 Too Many Requests` with `Retry-After`.
* **`FAIL`:** Authentication, search, or export routes accept unbounded request bursts without throttling.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Unthrottled Auth & Export Routes)
```typescript
// Prohibited: Unlimited brute-force login attempts and unbounded PDF export floods
app.post('/api/v1/auth/login', authController.login);
app.post('/api/v1/reports/export-pdf', requireAuth, reportController.exportPdf);
```

#### ✅ Compliant Canonical Pattern (Tiered Distributed Rate Limiters)
```typescript
// Compliant: Tiered Redis-backed rate limiters returning 429 + Retry-After
const authLimiter = createRateLimiter({
  store: redisStore,
  windowMs: 60_000,
  maxRequests: 10,
  keyGenerator: (req) => `rl:auth:${req.ip}:${String(req.body?.email ?? '').toLowerCase()}`,
});

const exportLimiter = createRateLimiter({
  store: redisStore,
  windowMs: 60_000,
  maxRequests: 5,
  keyGenerator: (req) => `rl:export:${req.authContext.tenantId}:${req.authContext.userId}`,
});

app.post('/api/v1/auth/login', authLimiter, authController.login);
app.post('/api/v1/reports/export-pdf', requireAuth, exportLimiter, reportController.exportPdf);
```

---
[⬅️ Back to Protection & Idempotency (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
