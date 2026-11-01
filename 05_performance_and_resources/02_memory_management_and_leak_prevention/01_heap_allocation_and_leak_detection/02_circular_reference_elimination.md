# [CHK-PERF-0202] Circular Reference Elimination & Weak References
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-PERF] Performance & Resource Efficiency (Level 1)](../../../README.md) > [Memory Management & Leak Prevention (Level 2)](../../README.md) > [Heap Allocation & Leak Detection (Level 3)](../README.md) > **CHK-PERF-0202 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-PERF-0202` |
| **Sub-Pillar & Category** | Memory Management & Leak Prevention / Heap Allocation & Leak Detection |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | Garbage Collection & Reference Counting Patterns; WeakRef Standards; ISO/IEC 25010 |
| **Target Entities** | Parent-child hierarchies, observer registries, callback listeners, graph structures |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** In object relationships where parents point to children and children point back to parents, the back-reference must be implemented using **Weak References (`weakref` / `WeakMap` / `WeakPtr`) or explicit lifecycle detachment**. Circular strong references that prevent deterministic garbage collection are prohibited.
* **Engineering Rationale:** In reference-counted runtimes (Python, Swift, Rust, C++), circular strong references prevent immediate deallocation when an object falls out of scope, relying instead on periodic cyclic garbage collector sweeps, which causes major memory latency spikes and leaks objects holding native OS handles.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Cyclic Strong References in Long-Lived Objects:** Strictly `0`.
* **Disconnection Lifecycles:** 100% of observers/listeners must provide an explicit `unsubscribe()` / `detach()` method.

---

### 4. Step-by-Step Verification Protocol
1. **Garbage Collection Object Cycle Scan:**
   * Run cyclic reference detection tools (e.g. `gc.get_objects()`, `objgraph`):
     ```python
     import objgraph
     objgraph.show_backrefs([obj], max_depth=5)
     ```
   * Confirm that deleting a parent immediately reclaims child objects without calling full `gc.collect()`.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Back-references use weak references or explicit detachment; objects are reclaimed immediately upon deletion.
* **`FAIL`:** Parent-child graphs hold mutual strong references that prevent reference-count reclamation.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Mutual Strong References Leak Memory)
```python
# Prohibited: Child holds strong reference to parent; cycle prevents immediate GC
class ParentNode:
    def __init__(self):
        self.children = []

    def add_child(self, child):
        self.children.append(child)
        child.parent = self  # STRONG CIRCULAR REFERENCE!
```

#### ✅ Compliant Canonical Pattern (Weak Reference for Back-Pointers)
```python
# Compliant: Child references parent via weakref, enabling immediate deallocation
import weakref

class ChildNode:
    def __init__(self, parent: "ParentNode"):
        self._parent_ref = weakref.ref(parent)  # Weak reference breaks circular cycle!

    @property
    def parent(self) -> "ParentNode | None":
        return self._parent_ref()
```

---
[⬅️ Back to Heap Allocation & Leak Detection (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
