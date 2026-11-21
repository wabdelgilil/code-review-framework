# [CHK-INFRA-0101] Non-Root Minimal Containers & Image Scanning
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-INFRA] Cloud-Native, Containers & IaC (Level 1)](../../README.md) > [Container & Identity Hardening (Level 2)](../README.md) > [Images, Privileges & Workload Identity (Level 3)](./README.md) > **CHK-INFRA-0101 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-INFRA-0101` |
| **Sub-Pillar & Category** | Container & Identity Hardening / Images, Privileges & Workload Identity |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | CIS Docker Benchmark (4.1); NIST SP 800-190; Kubernetes Pod Security Standards (Restricted) |
| **Target Entities** | `Dockerfile`, multi-stage build definitions, Kubernetes Deployment manifests, CI image pipelines |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Production container images must use **multi-stage builds** targeting minimal or distroless base images pinned by version/digest (never `:latest`), execute as an explicit **non-root UID (`USER`)**, mount read-only root filesystems where feasible, and pass automated **CVE image scanning** (`trivy`, `grype`) in CI with zero unpatched `CRITICAL` vulnerabilities.
* **Engineering Rationale:** Running containers as `root` with full OS shells (`curl`, `bash`, package managers) drastically expands container-escape blast radius and enables attackers to download post-exploitation toolkits.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Root Runtime Containers:** Strictly `0` production containers running as `UID 0`.
* **Mutable `:latest` Base Tags:** Strictly `0` unpinned `:latest` tags in production `Dockerfile`s.
* **Critical CVEs:** `0` unpatched `CRITICAL` OS/library CVEs permitted to promote to production.

---

### 4. Step-by-Step Verification Protocol
1. **Dockerfile Static Linting:**
   * Run `hadolint Dockerfile` and verify an explicit non-root `USER` directive and pinned base image digest/version exist.
2. **CI Vulnerability Gate:**
   * Execute `trivy image --severity CRITICAL --exit-code 1 <image:tag>` before pushing to the production registry.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Images use pinned minimal/distroless multi-stage builds, run as non-root, and pass Trivy/Grype CI scans with zero Critical CVEs.
* **`FAIL`:** Containers run as `root`, pull `:latest`, ship compilers/shells into production, or skip automated image scanning.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Root User & Mutable `:latest` Image)
```dockerfile
# Prohibited: Unpinned tag, full OS with build tools, runs as UID 0 (root)
FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]
```

#### ✅ Compliant Canonical Pattern (Multi-Stage Pinned Non-Root Build)
```dockerfile
# Compliant: Multi-stage build, pinned alpine/distroless runtime, explicit non-root user
FROM node:22.14.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:22.14.0-alpine AS runner
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
USER appuser
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

---
[⬅️ Back to Images, Privileges & Workload Identity (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
