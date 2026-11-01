# [CHK-DOM-0302] Zero Dual-Write Synchronization Hazards
## Level 4: Atomic Checkpoint Specification

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../../../../README.md) > [[TRK-DOM] Domain Logic & Specifications (Level 1)](../../../README.md) > [Single Source of Truth (Level 2)](../../README.md) > [State Authority & Canonical Models (Level 3)](../README.md) > **CHK-DOM-0302 (Level 4)**

---

### 1. Checkpoint Metadata
| Attribute | Specification |
| :--- | :--- |
| **Unique ID** | `CHK-DOM-0302` |
| **Sub-Pillar & Category** | Single Source of Truth / State Authority & Canonical Models |
| **Classification** | **`[MANDATORY]`** |
| **Governing Standard** | ACID Transaction Principles; Outbox Pattern; ISO/IEC 25010 (Data Integrity) |
| **Target Entities** | Persistence layers, multi-store coordinators, event dispatchers, file exporters |

---

### 2. Core Rule & Engineering Rationale
* **The Rule:** Mutating business state across two independent storage systems or entities must **never be performed as separate, uncoordinated write operations ("Dual-Write Anti-Pattern")**. State transitions must be atomic or coordinated via transactional outbox patterns.
* **Engineering Rationale:** If a procedure updates a database and then attempts to write a file or send a message without transactional coordination, a network blip or crash between the two writes leaves the system in a permanently corrupted split-brain state.

---

### 3. Quantitative Bounds & Measurable Thresholds
* **Uncoordinated Dual-Write Paths:** Strictly `0` occurrences of non-transactional dual writes across distinct persistence sinks.
* **Failure Recovery:** Any partial write failure must automatically trigger an atomic rollback or compensation mechanism.

---

### 4. Step-by-Step Verification Protocol
1. **Multi-Sink Mutation Audit:**
   * Review code paths updating persistence. Check if both a database write and external file/message write occur in the same method.
2. **Crash-Between-Writes Simulation:**
   * Inject a deliberate exception or process termination immediately after the first write.
   * Verify that the secondary store is not left in a mismatched state.

---

### 5. Binary Pass / Fail Evaluation Criteria
* **`PASS`:** Mutations are atomic (Unit of Work) or utilize transactional outbox logs to guarantee eventual consistency without dual-write hazards.
* **`FAIL`:** The system executes independent, uncoordinated write calls to two separate storage sinks where the failure of the second leaves the first committed.

---

### 6. Canonical Patterns & Code Comparison

#### ❌ Non-Compliant Anti-Pattern (Uncoordinated Dual-Write Hazard)
```python
# Prohibited: If write_audit_log fails, state is committed but log is lost!
def complete_order(order, db, audit_file):
    db.save_status(order.id, "COMPLETED")
    # Network crash or disk error here causes permanent state desynchronization!
    audit_file.append(f"Order {order.id} completed")
```

#### ✅ Compliant Canonical Pattern (Single Atomic Transaction / Outbox)
```python
# Compliant: Both operations committed atomically in a single transactional unit
def complete_order(order, unit_of_work):
    with unit_of_work.transaction() as tx:
        tx.orders.update_status(order.id, "COMPLETED")
        tx.outbox_events.record("ORDER_COMPLETED", {"order_id": order.id})
    # If anything fails, both changes are cleanly rolled back
```

---
[⬅️ Back to State Authority & Canonical Models (Level 3)](./README.md) | [🏠 Back to Root Index](../../../../README.md)
