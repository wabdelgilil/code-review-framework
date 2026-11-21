# [CHK-MOB-0101] Encrypted Local Storage & Hardware Keychain
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-MOB] Mobile, Offline-First & Sync Engineering (Level 1)](../../README.md) > [Mobile Security & Local Storage (Level 2)](../README.md) > [Encrypted Storage, Deep Links & Version Gating (Level 3)](./README.md) > **CHK-MOB-0101 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-MOB-0101` |
| **Sub-Pillar & Category** | Mobile Security & Local Storage / Encrypted Storage, Deep Links & Version Gating |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | OWASP MASVS-STORAGE (L1/L2); iOS Keychain & Android Keystore Security Guidelines |
| **Target Entities** | Mobile auth token stores, offline SQLite/Isar/Realm databases, SharedPreferences/UserDefaults, local caches |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Authentication tokens (JWTs, refresh tokens, session keys) and encryption keys must be persisted **exclusively in hardware-backed OS secure storage** (iOS Keychain / Android Keystore via `flutter_secure_storage`, `expo-secure-store`, or native APIs)—never in plaintext `SharedPreferences`, `UserDefaults`, or unencrypted `AsyncStorage`. Offline local databases containing operational or PII data must be encrypted at rest (e.g., SQLCipher) with keys derived from secure storage and wiped completely on logout.
* **Engineering Rationale:** Plaintext preference files and unencrypted SQLite files can be trivially extracted from device backups, rooted/jailbroken devices, or ADB dumps, exposing session tokens and sensitive corporate data.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Plaintext Secrets on Device:** Strictly `0` auth tokens, passwords, or PII keys written to `SharedPreferences` / `UserDefaults` / unencrypted `AsyncStorage`.
* **Logout Hygiene:** `100%` of auth tokens, cached tenant records, and offline database encryption keys cleared deterministically upon sign-out.

---

### 4. Step-by-Step Verification Protocol
1. **Static Storage Audit:**
   * Grep mobile source code for `SharedPreferences`, `UserDefaults`, or `AsyncStorage` calls referencing `token`, `jwt`, `password`, or `secret`.
2. **Logout Cleanup Test:**
   * Sign in, populate offline cache, sign out, and inspect local storage/DB to verify zero residual tokens or tenant records remain.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Credentials reside strictly in hardware-backed Keychain/Keystore, sensitive offline DBs are encrypted at rest, and logout purges all local session/tenant state.
* **`FAIL`:** Tokens are stored in plaintext `SharedPreferences`/`AsyncStorage`, or offline sensitive records survive user logout.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Plaintext Token in `SharedPreferences`)
```dart
// Prohibited: Plaintext XML/plist file readable via backup or rooted device
final prefs = await SharedPreferences.getInstance();
await prefs.setString('access_token', jwtToken);
```

#### ✅ Compliant Canonical Pattern (Hardware-Backed Secure Storage + Wipe on Logout)
```dart
// Compliant: Stored in iOS Keychain / Android Keystore with strict accessibility flags
const secureStorage = FlutterSecureStorage(
  aOptions: AndroidOptions(encryptedSharedPreferences: true),
  iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock_this_device),
);

await secureStorage.write(key: 'access_token', value: jwtToken);
// On logout: await secureStorage.deleteAll(); await localDb.wipeAllTables();
```

---
[⬅️ Back to Encrypted Storage, Deep Links & Version Gating (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
