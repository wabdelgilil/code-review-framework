# [MOB-01-01] Encrypted Storage, Deep Links & Version Gating
## Level 3 Category Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-MOB] Mobile, Offline-First & Sync Engineering (Level 1)](../../README.md) > [Mobile Security & Local Storage (Level 2)](../README.md) > **Encrypted Storage, Deep Links & Version Gating (Level 3)**

---

### 🎯 Purpose & Scope
Guarantee zero plaintext token/PII persistence on mobile devices, safe deep-link URI handling, and graceful upgrade gates when breaking API/security changes ship.

---

### 📜 Governing Standards
OWASP MASVS v2.0 (MASVS-STORAGE, MASVS-PLATFORM); Mobile App Security Verification Standard.

---

### 📋 Level 4: Atomic Checkpoints Specification

| Checkpoint Code | Atomic Checkpoint Name | Classification | Verification Specification Link |
| :---: | :--- | :---: | :---: |
| `CHK-MOB-0101` | **Encrypted Local Storage & Hardware Keychain** | `[MANDATORY]` | [📄 View Checkpoint Specification](./01_encrypted_local_storage_and_keychain.md) |
| `CHK-MOB-0102` | **Deep Link Validation & Minimum Version Gating** | `[MANDATORY]` | [📄 View Checkpoint Specification](./02_deep_link_validation_and_version_gating.md) |

---
[⬅️ Back to Sub-Pillar (Level 2)](../README.md) | [🏠 Back to Root Index](../../../README.md)
