# [CHK-ARCH-0303] Instability Index & Coupling Compliance
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-ARCH] Architecture & Code Quality (Level 1)](../../../README.md) > [Dependency Management & Coupling (Level 2)](../../README.md) > [Coupling & Cohesion Metrics (Level 3)](../README.md) > **CHK-ARCH-0303 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-ARCH-0303` |
| **Sub-Pillar & Category** | Dependency Management & Coupling / Coupling & Cohesion Metrics |
| **Classification** | **`[BEST PRACTICE]`** |
| **Governing Standard** | Robert C. Martin Component Metrics; Stable Dependencies Principle (SDP); Stable Abstractions Principle (SAP) |
| **Target Entities** | Internal packages, libraries, core architectural modules |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Modules must conform to the **Stable Dependencies Principle (SDP)**: depend in the direction of stability. A package's instability index ($I = \frac{C_e}{C_a + C_e}$, where $C_e$ is efferent coupling and $C_a$ is afferent coupling) must decrease as you move deeper into the core domain architecture.
* **Engineering Rationale:** Core domain abstractions that many modules depend on ($C_a \gg 0$) must be highly stable ($I \approx 0$). If core packages depend heavily on volatile outer packages ($C_e > 0$), any change in outer layers ripples inward and destabilizes the whole system.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Domain Core Instability ($I_{domain}$):** Must satisfy $I_{domain} \le 0.20$ (highly stable; depends on almost nothing outside itself).
* **Main Sequence Distance ($D$):** $|A + I - 1| \le 0.50$ (where $A$ is abstractness and $I$ is instability), avoiding the "Zone of Pain" (rigid and unabstracted) and "Zone of Uselessness" (abstract with no dependents).

---

### 4. Step-by-Step Verification Protocol
1. **Coupling Metric Calculation:**
   * Run structural package analysis tools (e.g. `pylint --reports=y`, `jdepend`, or `ts-complex`).
   * Compute $C_a$, $C_e$, and resulting $I$ for all packages.
2. **Zone of Pain Detection:**
   * Verify that modules with high afferent coupling ($C_a > 5$) possess abstract interfaces ($A > 0.5$).

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Core domain packages exhibit $I \le 0.20$, and packages maintain balanced positions along the main architectural sequence.
* **`FAIL`:** Core domain modules have high efferent coupling ($I > 0.50$), depending on unstable peripheral packages.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Unstable Core in Zone of Pain)
```text
Domain Package (Core)
  ├── Depends on: PDFGenerator (Volatile, Ce = 1)
  ├── Depends on: StripeGateway (Volatile, Ce = 2)
  ├── Depends on: ConsoleLogger (Volatile, Ce = 3)
  └── Afferent dependents (Ca = 15)
  Result: Instability I = 3 / (15 + 3) = 0.17 BUT Abstractness A = 0.0 -> In the Zone of Pain!
```

#### ✅ Compliant Canonical Pattern (Stable Core with Abstract Ports)
```text
Domain Package (Core)
  ├── Defines: StoragePort (Abstract Interface, A = 0.8)
  ├── Defines: LoggerPort (Abstract Interface)
  └── Ce = 0, Ca = 15 -> Instability I = 0.0
  Result: Perfectly stable, extensible, and decoupled from outer infrastructure.
```

---
[⬅️ Back to Coupling & Cohesion Metrics (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
