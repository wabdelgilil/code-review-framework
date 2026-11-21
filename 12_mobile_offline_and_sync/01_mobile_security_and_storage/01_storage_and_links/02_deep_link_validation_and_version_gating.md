# [CHK-MOB-0102] Deep Link Validation & Minimum Version Gating
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-MOB] Mobile, Offline-First & Sync Engineering (Level 1)](../../README.md) > [Mobile Security & Local Storage (Level 2)](../README.md) > [Encrypted Storage, Deep Links & Version Gating (Level 3)](./README.md) > **CHK-MOB-0102 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-MOB-0102` |
| **Sub-Pillar & Category** | Mobile Security & Local Storage / Encrypted Storage, Deep Links & Version Gating |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | OWASP MASVS-PLATFORM (Deep Link & IPC Security); Mobile Release Lifecycle Governance |
| **Target Entities** | Universal Links / App Links handlers, mobile router guards, app startup version-check middleware |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** All incoming deep links (`myapp://` or Universal/App Links) must be treated as **untrusted external input**—validated against an explicit route/parameter allowlist and gated by authentication/RBAC before navigation. Mobile apps must check a server-controlled **minimum supported version (`minSupportedVersion`)** at launch (and handle HTTP `426 Upgrade Required`) to gracefully block obsolete binaries carrying critical security vulnerabilities or incompatible sync schemas.
* **Engineering Rationale:** Unvalidated deep links allow open-redirect or auth-bypass attacks via crafted URLs. Without minimum version gating, outdated field devices continue transmitting obsolete payloads that corrupt server data or bypass patched security controls.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Unvalidated Deep-Link Routes:** Strictly `0` deep-link handlers navigating directly to raw URL parameters or opening arbitrary WebView URLs without domain allowlisting.
* **Unsupported Client Handling:** `100%` of API `426 Upgrade Required` responses transition cleanly to a non-dismissible upgrade prompt pointing to the official store.

---

### 4. Step-by-Step Verification Protocol
1. **Deep-Link Fuzzing Test:**
   * Launch the app with malformed/unauthorized deep links (e.g., `app://webview?url=https://evil.com`, `app://admin/settings` while logged out) and verify safe rejection/redirect to login.
2. **Force-Update Simulation:**
   * Send a version header below `minSupportedVersion` and confirm the backend returns `426` and the client renders the blocking update screen.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Deep links enforce strict route/domain allowlists + auth checks, and minimum-version gating cleanly handles deprecated client binaries.
* **`FAIL`:** Deep links open arbitrary URLs or bypass auth, or obsolete clients crash silently against updated APIs.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Unvalidated Deep-Link WebView Redirect)
```dart
// Prohibited: Opens arbitrary attacker-controlled URL inside privileged WebView
void onDeepLink(Uri uri) {
  final target = uri.queryParameters['url'];
  if (target != null) navigator.push(WebViewScreen(url: target));
}
```

#### ✅ Compliant Canonical Pattern (Strict Allowlist + Auth Guard + 426 Version Gate)
```dart
// Compliant: Allowlisted internal route pattern + authenticated session check
const allowedRoutes = {'work-orders', 'assets', 'inspections'};

void onDeepLink(Uri uri, AuthState auth) {
  final segment = uri.pathSegments.firstOrNull;
  final entityId = uri.pathSegments.length > 1 ? uri.pathSegments[1] : null;
  if (segment == null || !allowedRoutes.contains(segment) || !isValidUuid(entityId)) {
    return; // Reject unknown or malformed deep link safely
  }
  if (!auth.isAuthenticated) {
    router.go('/login', extra: {'redirect': '/$segment/$entityId'});
    return;
  }
  router.go('/$segment/$entityId');
}
```

---
[⬅️ Back to Encrypted Storage, Deep Links & Version Gating (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
