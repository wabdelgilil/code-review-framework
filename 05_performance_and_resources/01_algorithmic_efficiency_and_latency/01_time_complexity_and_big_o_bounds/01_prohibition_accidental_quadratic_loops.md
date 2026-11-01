# [CHK-PERF-0101] Prohibition of Accidental Quadratic Loops
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-PERF] Performance & Resource Efficiency (Level 1)](../../../README.md) > [Algorithmic Efficiency & Latency (Level 2)](../../README.md) > [Time Complexity & Big-O Bounds (Level 3)](../README.md) > **CHK-PERF-0101 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-PERF-0101` |
| **Sub-Pillar & Category** | Algorithmic Efficiency & Latency / Time Complexity & Big-O Bounds |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Asymptotic Computational Complexity (Knuth TAOCP); ISO/IEC 25010 (Time Behaviour) |
| **Target Entities** | Collection search, filtering loops, joining routines, batch reconciliation |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Core data processing routines must achieve sub-quadratic algorithmic time complexity ($\mathcal{O}(N)$ or $\mathcal{O}(N \log N)$). Performing nested iterations over unbounded collections ($O(N^2)$) to look up items or perform joins is **strictly prohibited**. Lookups must utilize hash maps, sets, or indexed binary trees.
* **Engineering Rationale:** An algorithm that runs in $O(N^2)$ works fine in test environments with 50 items (2,500 operations), but locks up CPU completely when processing 50,000 production records (2.5 billion operations), causing sudden production outages.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Maximum Time Complexity for In-Memory Joins:** $\le \mathcal{O}(N + M)$ using hash-indexed maps.
* **Nested Loop Filter Ban:** Strictly `0` linear searches (`list.find()`, `item in list`) executed inside iteration loops over unbounded collections.

---

### 4. Step-by-Step Verification Protocol
1. **Nested Loop Code Review:**
   * Review all loops over collections. Verify that inner lookups do not execute linear scans over another collection.
2. **Asymptotic Benchmarking:**
   * Measure execution time with input size $N = 1,000$ vs $N = 10,000$.
   * Confirm runtime increases by approximately $\sim 10\times$ (linear), NOT $\sim 100\times$ (quadratic).

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** All lookups in collection loops use $O(1)$ set/map indices, ensuring linear time complexity.
* **`FAIL`:** Any routine executes nested loops over unbounded lists resulting in $O(N^2)$ algorithmic degradation.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Accidental $O(N^2)$ Nested Linear Search)
```python
# Prohibited: Linear search inside a loop creates O(N * M) performance disaster!
def match_orders_to_customers(orders: list[dict], customers: list[dict]):
    matched = []
    for order in orders:
        # Linear search scanning entire customer list for EVERY order!
        for customer in customers:
            if customer["id"] == order["customer_id"]:
                matched.append((order, customer))
                break
    return matched
```

#### ✅ Compliant Canonical Pattern ($O(N + M)$ Hash Map Indexed Join)
```python
# Compliant: Pre-indexes customers into a hash map in O(M), then joins in O(N)
def match_orders_to_customers(orders: list[dict], customers: list[dict]) -> list[tuple]:
    customer_map = {c["id"]: c for c in customers}  # O(M) hash indexing
    matched = []
    for order in orders:  # O(N) single loop
        customer = customer_map.get(order["customer_id"])  # O(1) hash lookup
        if customer:
            matched.append((order, customer))
    return matched
```

---
[⬅️ Back to Time Complexity & Big-O Bounds (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
