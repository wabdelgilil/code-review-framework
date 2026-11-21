# [CHK-INFRA-0203] FinOps Tagging & Auto-Scaling Caps
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../README.md) > [[TRK-INFRA] Cloud-Native, Containers & IaC (Level 1)](../../README.md) > [IaC, Zero-Trust & FinOps Governance (Level 2)](../README.md) > [Declarative IaC, Networking & FinOps (Level 3)](./README.md) > **CHK-INFRA-0203 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-INFRA-0203` |
| **Sub-Pillar & Category** | IaC, Zero-Trust & FinOps Governance / Declarative IaC, Networking & FinOps |
| **Classification** | **`[BEST PRACTICE]`** |
| **Governing Standard** | FinOps Foundation Framework; Cloud Cost Governance Best Practices |
| **Target Entities** | Serverless functions, Kubernetes HPA/VPA, cloud Auto-Scaling Groups, storage lifecycle rules, billing alerts |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Every provisioned cloud resource must carry mandatory **FinOps allocation tags** (`environment`, `service`, `owner`, `cost_center`). All auto-scaling workloads (serverless concurrency, Kubernetes HPA, VM scale sets) must declare explicit **upper scaling caps (`maxReplicas` / `reservedConcurrency`)**, and cloud accounts must enforce **automated budget anomaly alerts** and storage lifecycle expiration rules.
* **Engineering Rationale:** Uncapped serverless functions or auto-scaling groups triggered by a retry storm or DDoS event can generate tens of thousands of dollars in unexpected cloud bills overnight.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Untagged Production Resources:** `0` IaC resources missing mandatory `environment` and `service` tags.
* **Uncapped Auto-Scalers:** Strictly `0` production HPA/ASG/serverless configurations lacking an explicit maximum replica or concurrency cap.

---

### 4. Step-by-Step Verification Protocol
1. **IaC Policy Check:**
   * Verify IaC modules enforce default tags and explicit `max_capacity` / `maxReplicas` ceilings.
2. **Billing & Lifecycle Audit:**
   * Confirm cloud billing budget alerts (e.g., 50%, 80%, 100% monthly forecast) and log/artifact retention TTLs are active.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Resources are uniformly tagged, auto-scalers enforce explicit upper caps, storage/logs have TTL expiration policies, and budget anomaly alerts are active.
* **`FAIL`:** Workloads scale without upper bounds, logs/snapshots accumulate indefinitely without TTLs, or cloud spend lacks attribution tags and alerts.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Uncapped Concurrency & Untagged Storage)
```yaml
# Prohibited: No maxReplicas cap or resource limits; bug or traffic spike scales indefinitely
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
spec:
  minReplicas: 2
```

#### ✅ Compliant Canonical Pattern (Explicit Upper Cap + Resource Bounds + FinOps Tags)
```yaml
# Compliant: Bounded HPA ceiling paired with pod CPU/memory limits and cost-center labels
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-gateway-hpa
  labels:
    service: api-gateway
    environment: production
    cost-center: platform-eng
spec:
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

---
[⬅️ Back to Declarative IaC, Networking & FinOps (Level 3)](./README.md) | [🏠 Back to Root Index](../../../README.md)
