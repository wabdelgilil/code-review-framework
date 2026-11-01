# [TEST-04-01] Deliberate Bug Injection & Mutation
## Level 3 Category Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-TEST] Testing & Verification Suite (Level 1)](../../README.md) > [Adversarial & Mutation Testing (Level 2)](../README.md) > **Deliberate Bug Injection & Mutation (Level 3)**

---

### 🎯 Purpose & Scope
Ensure tests catch artificial logic mutations, enforce a minimum 80% mutation score, and eliminate counterfeit tests that artificially inflate code coverage without real assertions.

---

### 📜 Governing Standards
Mutation Score Indicator (IEEE); Karl Popper Falsifiability Criterion; ISO/IEC/IEEE 29119: Test Effectiveness.

---

### 📋 Level 4: Atomic Checkpoints Specification

| Checkpoint Code | Atomic Checkpoint Name | Classification | Verification Specification Link |
| :---: | :--- | :---: | :---: |
| `CHK-TEST-0401` | **Mutation Score Threshold** | `[MANDATORY]` | [📄 View Checkpoint Specification](./01_mutation_score_threshold.md) |
| `CHK-TEST-0402` | **Counterfeit Test Prohibition** | `[MANDATORY]` | [📄 View Checkpoint Specification](./02_counterfeit_test_prohibition.md) |

---
[⬅️ Back to Sub-Pillar (Level 2)](../README.md) | [🏠 Back to Root Index](../../../README.md)
