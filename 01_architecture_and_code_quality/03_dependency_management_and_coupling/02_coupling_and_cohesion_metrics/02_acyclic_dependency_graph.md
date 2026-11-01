# [CHK-ARCH-0304] Acyclic Dependency Graph Compliance
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../../README.md) > [Dependency Management & Coupling (Level 2)](../../README.md) > [Coupling & Cohesion Metrics (Level 3)](../README.md) > **CHK-ARCH-0304 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-ARCH-0304` |
| **Sub-Pillar & Category** | Dependency Management & Coupling / Coupling & Cohesion Metrics |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Acyclic Dependencies Principle (ADP); ISO/IEC 25010 Modularity |
| **Target Entities** | All package-level build manifests, import networks, compilation units |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** The dependency structure between packages and internal libraries must have **zero mutual dependency loops**. If package A depends on package B, package B (and any package B depends on) must never depend back on package A.
* **Engineering Rationale:** Cyclic package dependencies prevent incremental independent builds, make independent unit-testing impossible, cause "morning-after" integration breakage, and turn modular systems into an unmanageable monolithic knot.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Package-Level Cycles:** Strictly `0` cycles in the inter-package dependency graph.
* **Maximum Strongly Connected Component (SCC) Size:** Strictly `1` (each node in the dependency graph is its own SCC).

---

### 4. Step-by-Step Verification Protocol
1. **Tarjan's Strongly Connected Components (SCC) Scan:**
   * Build the package dependency graph using static dependency analysis.
   * Run Tarjan's or Kosaraju's algorithm to detect SCCs.
   * Verify that no component contains $> 1$ package.
2. **Automated CI Graph Check:**
   * Integrate cycle checking into the continuous delivery pipeline to automatically block pull requests introducing circular package edges.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** The inter-package dependency graph is a verified DAG with topological sorting successfully resolving.
* **`FAIL`:** Any cyclic loop is discovered between two or more packages.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Inter-Package Circular Loop)
```text
[Package: auth] ──imports──> [Package: users]
       ▲                             │
       │                             │
       └──────────imports────────────┘
```

#### ✅ Compliant Canonical Pattern (Cycle Broken via Common Abstraction)
```text
[Package: auth] ──imports──> [Package: core_interfaces]
                                    ▲
[Package: users] ──imports──────────┘
```

---
[⬅️ Back to Coupling & Cohesion Metrics (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
