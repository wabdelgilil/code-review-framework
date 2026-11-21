# [CHK-DATA-0302] Data Retention & Privacy Compliance (PDPL/GDPR)
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-DATA] Data Architecture, Multi-Tenancy & Compliance (Level 1)](../../README.md) > [Auditability & Data Governance (Level 2)](../README.md) > [Immutable Audit Trails & Governance (Level 3)](./README.md) > **CHK-DATA-0302 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-DATA-0302` |
| **Sub-Pillar & Category** | Auditability & Data Governance / Immutable Audit Trails & Governance |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Saudi PDPL (Personal Data Protection Law); EU GDPR (Articles 5, 17, 32); ISO/IEC 27701 |
| **Target Entities** | User profiles, customer PII columns, CSV/PDF exports, file attachments, archival & purge jobs |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Personally Identifiable Information (PII) must be explicitly classified, encrypted in transit and at rest, protected behind signed/expiring URLs for attachments, and governed by documented **retention, archival, and anonymization/erasure policies** aligned with PDPL/GDPR. Data exports must enforce authorization, field minimization, and audit logging.
* **Engineering Rationale:** Indefinite retention of personal data, publicly accessible S3/object-storage attachment links, or unlogged bulk PII exports expose organizations to severe statutory penalties and breach liabilities.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Publicly Readable Private Attachments:** Strictly `0` tenant/user document buckets configured with public-read ACLs; pre-signed URLs must expire within $\le 15\text{ minutes}$ for sensitive documents.
* **Retention Policy Coverage:** `100%` of PII-bearing tables mapped in a data retention/classification register with automated archival or anonymization schedules.

---

### 4. Step-by-Step Verification Protocol
1. **Attachment Access Audit:**
   * Inspect object storage bucket policies and download endpoints; confirm files are served only after server-side tenant + permission verification via short-lived signed URLs or authenticated streams.
2. **Export Minimization Check:**
   * Inspect CSV/Excel/PDF export queries to ensure only necessary columns are projected (never `SELECT *` leaking password hashes, tokens, or internal metadata) and every export emits an audit event.
3. **Retention & Erasure Verification:**
   * Verify a documented retention schedule and automated anonymization/purge job exist for expired PII records.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** PII is classified, attachments use authenticated/short-lived access, exports enforce field minimization + audit logging, and retention/anonymization policies are automated.
* **`FAIL`:** Private attachments are publicly enumerable, exports leak sensitive fields without auditing, or no retention/privacy lifecycle exists.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Public Bucket URL & Unfiltered Export)
```typescript
// Prohibited: Permanent public URL for private tenant document
const fileUrl = `https://s3.amazonaws.com/app-uploads/${file.filename}`;

// Prohibited: Dumps all columns including internal/sensitive attributes
const users = await db.users.findMany({ where: { tenantId } });
return toCsv(users);
```

#### ✅ Compliant Canonical Pattern (Short-Lived Signed URL + Minimized Audited Export)
```typescript
// Compliant: Verified tenant ownership + 5-minute signed URL
async function getAttachmentDownloadUrl(ctx: VerifiedAuthContext, attachmentId: string): Promise<string> {
  const file = await db.attachments.findFirstOrThrow({
    where: { id: attachmentId, tenantId: ctx.tenantId, deletedAt: null },
  });
  return storageAdapter.createSignedReadUrl(file.storageKey, { expiresInSeconds: 300 });
}

// Compliant: Explicit allowlisted projection + audit log on export
async function exportDirectory(ctx: VerifiedAuthContext) {
  const rows = await db.users.findMany({
    where: { tenantId: ctx.tenantId, deletedAt: null },
    select: { employeeCode: true, fullName: true, department: true, role: true },
  });
  await auditService.record(ctx, 'USER_DIRECTORY_EXPORTED', { rowCount: rows.length });
  return toCsv(rows);
}
```

---
[⬅️ Back to Immutable Audit Trails & Governance (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
