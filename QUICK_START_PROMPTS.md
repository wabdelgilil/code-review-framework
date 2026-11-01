# 🚀 AI Quick-Start Prompts (One-Click Setup & Usage)

<p align="center">
  <a href="./QUICK_START_PROMPTS.md"><b>English</b></a> •
  <a href="./QUICK_START_PROMPTS.ar.md">العربية</a>
</p>

> **Copy, Paste & Run in 5 Seconds!**  
> No manual configuration needed. Select the prompt matching your workflow, paste it into your AI assistant chat window (**Cursor, Claude Desktop, Antigravity, Windsurf, Copilot**), and let the AI install and execute the framework for you.

---

## 📋 Quick-Start Prompts Index

1. [🛠️ Prompt 1: Autonomous Repository Setup (One-Click Setup)](#1-🛠️-prompt-1-autonomous-repository-setup)
2. [🔍 Prompt 2: Deep Pull Request & Code Review](#2-🔍-prompt-2-deep-pull-request--code-review)
3. [📊 Prompt 3: Production Readiness Audit & Grade Calculator](#3-📊-prompt-3-production-readiness-audit--grade-calculator)
4. [🛡️ Prompt 4: Production-Grade Vibe Coding Guardrail](#4-🛡️-prompt-4-production-grade-vibe-coding-guardrail)

---

### 1. 🛠️ Prompt 1: Autonomous Repository Setup
> **When to use:** In any project to instruct your AI to configure CRF rules, PR templates, MCP server, and CI/CD gates automatically.

```text
You are a Principal Software Architect. I want you to configure my current repository to strictly adhere to the Code Review Framework (CRF) from: https://github.com/wabdelgilil/code-review-framework

Execute the following setup tasks in my repository now:
1. Create a `.cursorrules` (or update system instructions) enforcing: zero dead code, zero swallowed errors in empty catch blocks, mandatory timeouts on all I/O, parameterized queries, and epsilon float comparisons.
2. Create `.github/PULL_REQUEST_TEMPLATE.md` requiring authors to verify compliance against the 6 Quality Pillars before merging.
3. Create `.github/workflows/crf-gate.yml` invoking the automated CI gate: wabdelgilil/code-review-framework/tools/github_action@main
4. If MCP is supported, register the CRF MCP server using: node D:/programming/code-review-framework/tools/mcp_server/index.js

Confirm once complete and summarize the newly active guardrails in my workspace.
```

---

### 2. 🔍 Prompt 2: Deep Pull Request & Code Review
> **When to use:** Before submitting a PR or when reviewing a colleague's diff.

```text
Review the latest git diff (or provided code) with radical objectivity against the 89 Code Review Framework (CRF) checkpoints:
- Architecture: Check for framework leakage and dead code (CHK-ARCH-0205).
- Domain Logic: Check for float precision (CHK-DOM-0201) and zero-division guards (CHK-DOM-0203).
- Resilience: Check for swallowed exceptions (CHK-RES-0102) and finite I/O timeouts (CHK-RES-0301).
- Security: Check for injection risks (CHK-RES-0501) and hardcoded secrets (CHK-RES-0502).
- Performance: Check for N+1 queries and O(N^2) iterations (CHK-PERF-0101).

Format findings strictly using Conventional Comments:
<issue (blocking) | suggestion (non-blocking) | praise> [CHK-CODE]: <summary>
[Operational Impact & Why]
[Canonical Remediated Code Example]

If no blocking issues are detected, explicitly confirm that the diff is 100% ready for merge.
```

---

### 3. 📊 Prompt 3: Production Readiness Audit & Grade Calculator
> **When to use:** Before production releases to evaluate the full 89-point matrix with verifiable evidence.

```text
Perform an exhaustive Production Readiness Audit on this repository using the 89-Point Audit Scorecard from the Code Review Framework (CRF).

Instructions:
1. Benchmark against the required tier: [Tier 1: Hygiene | Tier 2: Enterprise Production | Tier 3: Mission-Critical].
2. For each of the 6 Pillars, mark checkpoints as PASS or FAIL, citing exact file paths and line numbers as verifiable evidence.
3. Calculate the overall compliance score: (Passed Checks / Total Applicable Checks) * 100%.
4. Output the official CRF Letter Grade:
   - A+ (98% - 100%): Approved (Immediate)
   - A (90% - 97%): Approved for Production
   - B (80% - 89%): Conditional Approval
   - C (65% - 79%): Blocked (Remediation Required)
   - F (<65% or any L1 failure): REJECTED
```

---

### 4. 🛡️ Prompt 4: Production-Grade Vibe Coding Guardrail
> **When to use:** Paste at the beginning of an AI session when asking the model to write new features from scratch.

```text
You are an elite software engineer adhering strictly to the Code Review Framework (CRF).
When generating code, you MUST follow these non-negotiable rules:
1. NEVER swallow exceptions silently; every catch block must handle or rethrow with context.
2. ALWAYS enforce strict finite timeouts on all network, database, and process operations.
3. ALWAYS use parameterized queries or safe builders; zero string concatenation for SQL/shell.
4. NEVER compare floats directly with (==); use epsilon tolerance math.
5. Functions must be short, cohesive, and have a single responsibility with zero dead code.

Now, implement the following feature following these standards:
[Insert your feature description here]
```
