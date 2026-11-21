# [CHK-API-0101] Standardized API Envelopes & HTTP Status Codes
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-API] API Governance, Delivery & Execution (Level 1)](../../README.md) > [API Contracts & Resilience (Level 2)](../README.md) > [Contract Standardization & Versioning (Level 3)](./README.md) > **CHK-API-0101 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-API-0101` |
| **Sub-Pillar & Category** | API Contracts & Resilience / Contract Standardization & Versioning |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | RFC 9110 (HTTP Semantics); RFC 9457 (Problem Details for HTTP APIs); OpenAPI 3.1 |
| **Target Entities** | REST/HTTP route handlers, global error-handling middleware, pagination serializers, API clients |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** All HTTP endpoints must emit a **uniform JSON response envelope** for single resources, paginated collections (`data`, `meta: { page, limit, total, hasNext }`), and structured error objects (`error: { code, message, details, correlationId }`). Endpoints must use idiomatic HTTP status codes (`200`, `201`, `204`, `400`, `401`, `403`, `404`, `409`, `422`, `429`, `500`) and never return raw stack traces or database error strings.
* **Engineering Rationale:** Inconsistent response shapes (e.g., some routes returning `{ items: [...] }`, others raw arrays, others `{ ok: false, err: "..." }` with HTTP `200`) force brittle per-endpoint parsing across web, mobile, and third-party consumers.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Error-as-200 Anti-Pattern:** Strictly `0` REST endpoints returning HTTP `200 OK` for validation, auth, or server failures.
* **Contract Consistency:** `100%` of endpoints conform to the canonical success, pagination, and error schemas defined in the OpenAPI spec.

---

### 4. Step-by-Step Verification Protocol
1. **Schema Contract Validation:**
   * Execute API integration tests validating both success and error responses against shared Zod/JSON Schema/OpenAPI response schemas.
2. **Error Middleware Audit:**
   * Confirm a centralized exception-to-HTTP mapper translates domain errors into deterministic status codes and scrubbed error envelopes.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All routes return uniform success/pagination/error envelopes with accurate HTTP status codes and zero raw stack trace leakage.
* **`FAIL`:** Routes return ad-hoc shapes, HTTP `200` on errors, or raw database/runtime exception strings.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Ad-Hoc Envelope & HTTP 200 on Error)
```typescript
// Prohibited: Returns 200 OK with inconsistent ad-hoc error string and raw DB error
app.get('/api/assets', async (req, res) => {
  try {
    const rows = await db.assets.findMany();
    res.json(rows); // Raw array, no pagination metadata
  } catch (e: any) {
    res.status(200).json({ success: false, msg: e.message });
  }
});
```

#### ✅ Compliant Canonical Pattern (Canonical Envelope + Centralized Error Mapper)
```typescript
// Compliant: Uniform paginated envelope and accurate HTTP error mapping
app.get('/api/v1/assets', async (req, res, next) => {
  try {
    const { items, total, page, limit } = await assetService.list(req.authContext, req.query);
    res.status(200).json({
      data: items,
      meta: { page, limit, total, hasNext: page * limit < total },
    });
  } catch (err) {
    next(err); // Mapped by central middleware to { error: { code, message, correlationId } } + 4xx/5xx
  }
});
```

---
[⬅️ Back to Contract Standardization & Versioning (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
