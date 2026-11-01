# 💬 Conventional Reviews & Standardized Review Comments

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](./README.md) > **Conventional Reviews**
> **Grounding:** Inspired by **Conventional Comments (`conventionalcomments.org`)**, **Google Eng Practices (Reviewer Guide)**, and **Thoughtbot Code Review Standards**.

---

## 🎯 Purpose & Philosophy

Code reviews frequently suffer from two common failure modes:
1. **Ambiguity of Intent**: An author cannot tell if a reviewer's comment is a strict merge-blocker, a minor question, or an optional stylistic preference.
2. **Subjectivity & Bike-shedding**: Reviews degenerate into personal opinions ("I would write it like this") rather than objective standards.

This document establishes a **Standardized Taxonomy of Review Comments** coupled directly with the **89 Atomic Checkpoint Codes** of this framework.

---

## 🏷️ The Conventional Review Format

All review comments must follow this concise, structured syntax:

```text
<label> [decorations] [CHK-CODE]: <subject>

[discussion / rationale]

[suggested fix / code snippet]
```

### Example 1: Critical Security Issue (Blocking)
```markdown
issue (blocking) [CHK-RES-0501]: SQL query constructed via string concatenation.

User input `searchTerm` is interpolated directly into the raw SQL string, creating a critical SQL injection vulnerability.

```typescript
// Recommended Fix:
const query = 'SELECT * FROM users WHERE organization_id = $1 AND username ILIKE $2';
return await db.query(query, [orgId, `%${searchTerm}%`]);
```
```

### Example 2: Non-Blocking Performance Suggestion
```markdown
suggestion (non-blocking) [CHK-PERF-0101]: Quadratic lookup in inner iteration loop.

`allowedIds.includes(item.id)` inside a 10,000-item array iteration results in O(N × M) running time. Converting `allowedIds` to a `Set` upfront reduces this to O(N).

Not blocking since batch sizes are currently small, but recommended before production rollout.
```

### Example 3: Praise / Positive Reinforcement
```markdown
praise [CHK-DOM-0201]: Excellent edge-case handling for zero-division and float precision!
```

---

## 📚 Standard Label Dictionary

| Label | Meaning | Merge Blocker? | When to Use |
| :--- | :--- | :---: | :--- |
| **`issue`** | A defect, bug, security flaw, missing test, or violation of a framework checkpoint. | **YES** (by default) | Code correctness, safety, or contract violations. |
| **`suggestion`** | A concrete proposal to improve readability, performance, or idiomatic style. | **NO** (unless decorated `(blocking)`) | Author makes the final call on adopting or deferring. |
| **`question`** | Reviewer does not understand or is seeking context/clarification. | Depends | Asking for clarification; does not require code change unless clarification reveals a defect. |
| **`thought`** | High-level brainstorming, future architectural ideas, or long-term design reflections. | **NO** | Purely conversational; should not slow down the current PR. |
| **`chore`** | Simple mechanical tasks (typo fixes, updating docs, renaming variables for clarity). | Optional | Minor cleanups that take $\le 1$ minute. |
| **`nitpick`** / **`nit`** | Trivial stylistic preference that has no operational impact. | **NO** | Subjective polish. Author may ignore without explanation. |
| **`praise`** | Explicit appreciation for good design, comprehensive tests, or elegant solutions. | **NO** | Fostering psychological safety and celebrating engineering excellence. |

---

## 🎨 Comment Decorations

Decorations can be appended in parentheses to refine the severity and expectations:

* `(blocking)`: Explicitly marks that the PR must not merge until this comment is resolved.
* `(non-blocking)`: Clarifies that the comment is informative and does not prevent immediate merging.
* `(if-minor)`: Adopt only if the change is quick and does not require substantial refactoring.
* `(follow-up)`: Agreeable improvement, but should be tracked as a separate ticket rather than blocking this PR.

---

## 🔗 Binding Comments to Checkpoints

Whenever applicable, reviewers should tag their comment with the exact atomic checkpoint code from this framework. This grounds the feedback in an agreed objective standard rather than subjective taste:

| Review Topic | Framework Code Sample | Review Comment Header |
| :--- | :--- | :--- |
| Framework leakage into core | `CHK-ARCH-0101` | `issue (blocking) [CHK-ARCH-0101]: ...` |
| Dead or commented-out code | `CHK-ARCH-0205` / `0206` | `chore [CHK-ARCH-0205]: ...` |
| Floating dependency versions | `CHK-ARCH-0301` | `issue (blocking) [CHK-ARCH-0301]: ...` |
| Missing boundary validation | `CHK-RES-0201` | `issue (blocking) [CHK-RES-0201]: ...` |
| Missing timeout on I/O call | `CHK-RES-0301` | `issue (blocking) [CHK-RES-0301]: ...` |
| Secret or token in diff | `CHK-RES-0502` | `issue (blocking) [CHK-RES-0502]: ...` |
| Counterfeit / zero-assert test | `CHK-TEST-0402` | `issue (blocking) [CHK-TEST-0402]: ...` |
| Inadequate error context | `CHK-UX-0301` | `suggestion (non-blocking) [CHK-UX-0301]: ...` |

---

## 🤝 Code Review Etiquette & Psychology

### 1. Critique the Code, Never the Person
* ❌ **Bad:** *"Why are you writing such slow code? You clearly don't know how async works."*
* ✅ **Good:** *"suggestion (non-blocking) [CHK-PERF-0201]: Sequential `await` in this loop causes high latency. We can parallelize with `Promise.all()` to resolve requests concurrently."*

### 2. Explain the "Why" and Provide Solutions
Never leave a bare complaint without context or a constructive path forward.
* ❌ **Bad:** *"Don't use `any`."*
* ✅ **Good:** *"issue (blocking) [CHK-ARCH-0201]: Using `any` bypasses type checking for the API payload. Defining an interface `UserProfilePayload` ensures compile-time validation."*

### 3. Acknowledge Trade-Offs
Engineers must recognize that engineering is about trade-offs. If the author made a conscious trade-off that is reasonable for the current milestone, record it as a `thought` or `suggestion (follow-up)` rather than blocking delivery.

---

## 🔄 Resolution Protocol

1. **For Authors:**
   - **Addressing Blockers:** Push code fixes and reply to the comment explaining the resolution. Click **Resolve conversation** once the reviewer verifies or when agreed team protocol allows.
   - **Handling Non-Blockers:** You may adopt the suggestion, politely decline with rationale, or create a follow-up ticket.

2. **For Reviewers:**
   - Respond promptly to review requests (target $\le 24$ business hours).
   - Re-review only the new commits rather than re-reading the entire PR from scratch.
   - Once all blocking `issue` comments are satisfied, immediately submit the formal approval.
