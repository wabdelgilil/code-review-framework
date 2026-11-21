# [CHK-API-0102] API Versioning & Deprecation Policy
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-API] API Governance, Delivery & Execution (Level 1)](../../README.md) > [API Contracts & Resilience (Level 2)](../README.md) > [Contract Standardization & Versioning (Level 3)](./README.md) > **CHK-API-0102 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-API-0102` |
| **Sub-Pillar & Category** | API Contracts & Resilience / Contract Standardization & Versioning |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | RFC 8594 (The `Sunset` HTTP Response Header); OpenAPI Diff Governance; Backward-Compatible API Evolution |
| **Target Entities** | Public & internal API routes, mobile/web API contracts, OpenAPI specifications, GraphQL schemas |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** APIs must declare an explicit **versioning strategy** (e.g., URI prefix `/api/v1/...` or version header) and enforce **non-breaking additive evolution** within a major version. Breaking contract changes (renaming/removing fields, changing field types, tightening required parameters) require a new major version alongside a documented **deprecation window** emitting `Deprecation` and `Sunset` HTTP headers so mobile apps and external integrators never break silently.
* **Engineering Rationale:** Unlike web apps that reload on deploy, installed mobile clients and external ERP/IoT integrations run older client versions for months. Uncoordinated breaking payload changes cause immediate production outages for active clients.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Unversioned Breaking Changes in CI:** Strictly `0` breaking OpenAPI/schema diffs permitted within an active major version (`oasdiff breaking` exit code `0`).
* **Deprecation Notice Headers:** `100%` of deprecated endpoints emit `Deprecation: true` and `Sunset: <RFC 7231 date>` headers.

---

### 4. Step-by-Step Verification Protocol
1. **Automated Breaking-Change Diff:**
   * Run `oasdiff breaking base-openapi.yaml head-openapi.yaml` (or GraphQL Inspector) on every pull request touching API contracts.
2. **Header & Parity Audit:**
   * Inspect deprecated routes to confirm `Deprecation` and `Sunset` headers are returned and documented in `CHANGELOG.md`.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** APIs are explicitly versioned, automated CI contract diffs block breaking changes within a major version, and deprecations emit `Deprecation`/`Sunset` headers.
* **`FAIL`:** Breaking payload edits ship in-place without a version bump or deprecation window, breaking active web/mobile/external clients.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (In-Place Breaking Field Rename)
```json
// v1 yesterday: { "assetCode": "PUMP-01", "status": "ACTIVE" }
// Prohibited: Renamed in-place on /api/v1/assets without version bump -> crashes mobile apps
{ "code": "PUMP-01", "state": 1 }
```

#### ✅ Compliant Canonical Pattern (Versioned Prefix + Additive Evolution + Sunset Headers)
```typescript
// Compliant: Explicit major version prefix + Deprecation/Sunset headers on retired routes
app.use('/api/v1/assets', (req, res, next) => {
  res.setHeader('Deprecation', 'true');
  res.setHeader('Sunset', 'Wed, 01 Oct 2026 00:00:00 GMT');
  res.setHeader('Link', '</api/v2/assets>; rel="successor-version"');
  next();
}, assetsV1Router);

app.use('/api/v2/assets', assetsV2Router);
```

---
[⬅️ Back to Contract Standardization & Versioning (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
