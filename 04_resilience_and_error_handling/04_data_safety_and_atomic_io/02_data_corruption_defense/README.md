# [RES-04-02] Data Corruption Defense
## Level 3 Category Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-RES] Resilience, Error Handling & Security (Level 1)](../../README.md) > [Data Safety & Atomic I/O (Level 2)](../README.md) > **Data Corruption Defense (Level 3)**

---

### 🎯 Purpose & Scope
Protect saved artifacts and persistent state with cryptographic SHA-256 checksum verification, preventing silent bitrot, corrupted loads, and file tampering.

---

### 📜 Governing Standards
RFC 6234: Secure Hash Algorithm (SHA); ISO/IEC 10118; ISO/IEC 25010: Data Integrity.

---

### 📋 Level 4: Atomic Checkpoints Specification

| Checkpoint Code | Atomic Checkpoint Name | Classification | Verification Specification Link |
| :---: | :--- | :---: | :---: |
| `CHK-RES-0403` | **SHA-256 Digest Verification for Persistent State** | `[MANDATORY]` | [📄 View Checkpoint Specification](./01_sha256_digest_verification.md) |

---
[⬅️ Back to Sub-Pillar (Level 2)](../README.md) | [🏠 Back to Root Index](../../../README.md)
