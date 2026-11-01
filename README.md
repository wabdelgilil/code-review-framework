# 🏛️ Code Review Framework (CRF)

<p align="center">
  <a href="./README.md"><b>English</b></a> •
  <a href="./README.ar.md">العربية</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" />
  <img src="https://img.shields.io/badge/Checkpoints-89%20Atomic%20Cards-brightgreen.svg" alt="Checkpoints" />
  <img src="https://img.shields.io/badge/Pillars-6%20Core%20Pillars-orange.svg" alt="Pillars" />
  <img src="https://img.shields.io/badge/Standards-ISO%2025010%20%7C%20OWASP%20ASVS-purple.svg" alt="Standards" />
  <img src="https://img.shields.io/badge/AI--Born-Vibe%20Coding%20Elevated-9cf.svg" alt="AI-Born" />
  <img src="https://img.shields.io/badge/PRs-Welcome-green.svg" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/Domain-100%25%20Agnostic-lightgrey.svg" alt="Domain Agnostic" />
</p>

> **Level 0 (Root Index):** Master framework for software quality checklists, audit standards, and testing methodologies for any professional software project.
> **Architectural Principle:** Hierarchical Tree Structure (Folder-in-Folder). Every parent directory serves as a navigable catalog/index for its children, with bidirectional links (breadcrumbs and drill-downs) ensuring zero context drift.
> **Domain Neutrality:** Fully decoupled and domain-agnostic. Designed to audit and verify any pure software system, service, CLI, or application from scratch.

---

> [!NOTE]
> ### 🤖 Born by AI, Engineered for the "Vibe Coding" Era
> This framework was **synthesized and curated by Artificial Intelligence** in rigorous dialogue with human software architects.
> 
> As AI-assisted programming and "Vibe Coding" explode, teams are generating code faster than ever. However, velocity without rigor creates fragile architectures, silent error swallowing, zero-day injection risks, and mounting technical debt.
> 
> **The Code Review Framework exists to bridge that gap:** transforming high-velocity AI and human code into battle-tested, enterprise-grade software grounded in **ISO/IEC 25010**, **OWASP ASVS**, and **Google Engineering Practices**.

---

## ⚡ Quick Start: How to Adopt This in Your Team

1. **For PR Authors (3-Minute Self-Check):**
   Before opening a PR, run through the [Pre-Submission Checklist](./PRE_SUBMISSION_CHECKLIST.md) to catch 80% of common review issues locally.
2. **For Code Reviewers (Objective Feedback):**
   Use [Conventional Reviews](./CONVENTIONAL_REVIEWS.md) to tag review comments with structured tags (`issue (blocking)`, `suggestion (non-blocking)`) bound directly to checkpoint codes (e.g. `[CHK-RES-0501]`).
3. **For Release Audits & Production Readiness:**
   Conduct release gating using the [89-Point Audit Scorecard](./AUDIT_SCORECARD.md) with our evidence-based calculation formula.
4. **For CI/CD PR Enforcement:**
   Copy [`.github/PULL_REQUEST_TEMPLATE.md`](./.github/PULL_REQUEST_TEMPLATE.md) into your repository's `.github/` folder.
5. **For AI Coding Assistants & Agents:**
   Equip your AI assistant (Antigravity, Cursor, Claude Code, Copilot) with our [Agent Skill](./integrations/ai_agents/SKILL.md) and [System Prompt Guardrails](./integrations/ai_agents/SYSTEM_PROMPT.md) so it writes and reviews code against this framework automatically!
6. **🚀 One-Click Ready-to-Use Prompts:**
   Don't want manual setup? Open our **[AI Quick-Start Prompts Guide](./QUICK_START_PROMPTS.md)**, copy the one-click setup prompt, and paste it directly into Cursor/Claude to configure your repo automatically!

---

## 🚀 One-Click Ready-to-Use AI Prompts

Copy and paste these prompts directly into your AI assistant (**Cursor, Claude Desktop, Antigravity, Windsurf, Copilot**) for instant execution:

### 🛠️ Prompt 1: Autonomous Repository Setup
Instructs your AI to configure `.cursorrules`, register the MCP server, and set up CI/CD actions automatically:

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

### 🔍 Prompt 2: Deep Pull Request & Code Review
Instructs your AI to review any diff or code against all 89 checkpoints with conventional blocking/non-blocking feedback:

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

### 🛡️ Prompt 3: Production-Grade Vibe Coding Guardrail
Paste at the start of an AI session to ensure newly generated code is production-grade from line one:

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

*(For release gating and audit scorecard prompts, visit the [Full Prompts Catalog](./QUICK_START_PROMPTS.md))*.

---

## 💻 Tooling & Installation Guide

The Code Review Framework provides zero-dependency automated tooling to run audits locally, enforce quality in CI/CD, or empower your AI coding assistants:

### 1. Command-Line Interface (CRF CLI) ⌨️
Run static quality audits directly from your terminal:

```bash
# Run static audit gate against your repository
node path/to/code-review-framework/tools/cli/index.js audit .

# View complete specification & code examples for any checkpoint
node path/to/code-review-framework/tools/cli/index.js check CHK-RES-0501
node path/to/code-review-framework/tools/cli/index.js check CHK-DOM-0201
```

---

### 2. Model Context Protocol (MCP) Server 🤖
Connect the framework directly to your AI IDE (**Cursor, Claude Desktop, Antigravity, Windsurf**) so your AI assistant natively understands all 89 checkpoints:

Add this to your editor's MCP config file (e.g. `~/.cursor/mcp.json` or `claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "code-review-framework": {
      "command": "node",
      "args": ["path/to/code-review-framework/tools/mcp_server/index.js"]
    }
  }
}
```
* **Tools exposed to AI:** `list_checkpoints`, `get_checkpoint`, `search_checkpoints`, `audit_code_snippet`, and `calculate_grade`.
* 👉 **[View the step-by-step MCP Setup Guide for Cursor, Claude Desktop & Windsurf](./tools/mcp_server/README.md)**.

---

### 3. Automated CI/CD GitHub Action 🛡️
Enforce quality gates automatically on pull requests by adding `.github/workflows/crf-gate.yml` to your repository:

```yaml
name: 🛡️ Code Review Framework Gate
on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run CRF Audit Gate
        uses: wabdelgilil/code-review-framework/tools/github_action@main
        with:
          tier: '1'
          fail-on-violation: 'true'
```

---

## 🛠️ Operational Suite & Review Toolkit

In addition to the 89 atomic checkpoint cards, this framework provides turnkey operational tools to integrate quality directly into daily software engineering workflows:

| Operational Tool | Description | Direct Link |
| :--- | :--- | :---: |
| 🎖️ **Maturity Levels & Tiers** | Three progressive verification tiers (L1: Hygiene, L2: Enterprise, L3: Mission-Critical) | [View Tiers](./MATURITY_LEVELS.md) |
| 🚀 **Pre-Submission Checklist** | Author's 3-minute pre-flight checklist before opening or flagging a PR for review | [View Checklist](./PRE_SUBMISSION_CHECKLIST.md) |
| 💬 **Conventional Reviews** | Standardized review comment taxonomy (`issue`, `suggestion`, `praise`) bound to Checkpoint IDs | [View Guide](./CONVENTIONAL_REVIEWS.md) |
| 📊 **Audit Scorecard** | Full 89-point interactive evaluation matrix with evidence-based scoring and letter grades (A+ to F) | [View Scorecard](./AUDIT_SCORECARD.md) |
| 📋 **PR Template** | Drop-in `.github/pull_request_template.md` aligning team pull requests with the 6 Quality Pillars | [View Template](./PR_TEMPLATE.md) |
| 🎖️ **Official Badges** | Official certification and audit grade shields for adoption in your repo README | [View Badges](./BADGES.md) |
| 🤖 **AI Agent Integration** | Ready-to-use Agent Skill and System Prompt rules for Cursor, Claude, Antigravity, and Copilot | [View Integration](./integrations/ai_agents/) |
| 🚀 **Quick-Start Prompts** | One-click ready prompts to instruct AI to auto-install and audit your codebase | [View Prompts](./QUICK_START_PROMPTS.md) |
| 💥 **Case Studies Library** | Real-world software disasters (Knight Capital, Cloudflare, Patriot) mapped to violated checkpoints | [View Case Studies](./case_studies/) |
| 🗺️ **Volunteer Roadmap** | Open tracks for multi-language examples, linter plugins, and translations | [View Roadmap](./ROADMAP.md) |
| 🌲 **Framework File Map** | Complete physical hierarchical tree map of all 180+ framework files | [View File Map](./brainstorming.md) |

---

## 📜 Foundational Governance & Review Constitution

Every checklist, inspection, and verification suite within this framework is strictly bound by the following governing principles:

### 1. Radical Objectivity & Neutrality
* **Zero Flattery or Sycophancy:** Superficial compliments or glossing over architectural flaws are strictly forbidden. Assessments are anchored purely in demonstrable facts, execution logs, and verifiable outcomes.
* **No Unconstructive Criticism:** Critique is never an end in itself; it must be an objective diagnosis backed by quantifiable impact and an authoritative, standards-compliant alternative.
* **Evidence-Based Measurement:** Every evaluation must yield an explicit binary result (`PASS` / `FAIL`) or an exact quantifiable metric. Subjective impressions are invalid.

### 2. Authoritative Standards-Backed (Zero Fabrication)
* **Grounded in Recognized Industry Standards:** No improvisations or speculative patterns. All items trace back to international standards:
  * **ISO/IEC 25010:** Systems and software Quality Requirements and Evaluation (SQuaRE).
  * **ISO/IEC/IEEE 29119:** Software Testing Standards and Life Cycle.
  * **OWASP ASVS / Top 10:** Application Security Verification Standard and vulnerability mitigation.
  * **The Twelve-Factor App:** Architectural methodology for modern, resilient applications.
  * **Google & Microsoft Engineering Practices:** Industry benchmarks for code reviews, maintainability, and testing.

### 3. Test Independence & Anti-Gaming (AI Verification Safeguard)
* **Spec-First, Never Code-Derived:** Tests and checklists are derived exclusively from external specifications and system requirements. Tests must never be reverse-engineered from existing code implementation to prevent tautological self-validation.
* **No Gaming Metrics or Thresholds:** Modifying assertion limits, test thresholds, or mocking fixtures artificially to force a green test pass is strictly prohibited.
* **Golden Datasets & Ground Truth:** Verification must benchmark against pre-solved, independently documented reference problems (Ground Truth) with immutable results.
* **Falsifiability & Mutation Testing:** Any test that cannot demonstrably fail when a deliberate bug or mutation is introduced into the code is counterfeit and deemed invalid.

### 4. Measurability & Numeric Testability
* Vague qualitative terms (e.g., "fast", "clean", "well-structured") are prohibited.
* Every criterion must be paired with measurable bounds: execution latency, cyclomatic complexity thresholds, test coverage percentages, floating-point rounding precision.

### 5. Determinism & Strict Reproducibility
* Identical inputs must yield identical outputs on any machine or execution environment (`Deterministic Behavior`).
* The "works on my machine" rationale is rejected. All verification steps must be automated and consistently reproducible.

### 6. Fail-Fast & No Silent Failures
* Fragile software catches exceptions silently or produces approximate/corrupted output without warning.
* Robust software adheres to `Fail-Fast`: halting execution immediately upon encountering an invalid state, with actionable diagnostics and explicit error propagation.

### 7. Strict Requirement Classification
* Every check must explicitly identify its classification level:
  * **[MANDATORY]:** Mandatory compliance mandated by specifications, safety standards, or critical operational rules.
  * **[BEST PRACTICE]:** Established industry pattern optimizing maintainability, velocity, or efficiency.
  * **[STYLE PREFERENCE]:** Stylistic or team convention (never to be enforced as a blocking defect).

### 8. Sandboxing & Side-Effect Freedom
* Running software, scripts, or tests must never pollute host environments, alter external system settings without authorization, leave orphaned temporary files, or leak system resources.

---

## 🌲 Level 1: Core Trunk Index (The Six Primary Pillars)

Click on any pillar to access its dedicated index and sub-branches:

| Code | Primary Pillar | Scope & Focus Area | Sub-Directory Index |
| :---: | :--- | :--- | :---: |
| `01` | **[TRK-ARCH] Architecture & Code Quality** | Structural topology, modularity, SOLID principles, and dependency hygiene | [📁 View Index](./01_architecture_and_code_quality/README.md) |
| `02` | **[TRK-DOM] Domain Logic & Specifications** | Specification fidelity, mathematical precision, state invariants, single source of truth | [📁 View Index](./02_domain_logic_and_standards/README.md) |
| `03` | **[TRK-TEST] Testing & Verification Suite** | Unit, integration, stress, regression, and ground truth benchmark testing | [📁 View Index](./03_testing_and_verification/README.md) |
| `04` | **[TRK-RES] Resilience, Error Handling & Security** | Exception propagation, fail-fast mechanics, input validation, and audit logging | [📁 View Index](./04_resilience_and_error_handling/README.md) |
| `05` | **[TRK-PERF] Performance & Resource Efficiency** | Algorithmic complexity, latency benchmarks, memory leak prevention, artifact lifecycle | [📁 View Index](./05_performance_and_resources/README.md) |
| `06` | **[TRK-UX] Documentation, DX & Operations** | Standard Operating Procedures (SOP), architectural records, actionable user diagnostics | [📁 View Index](./06_documentation_and_operations/README.md) |

---

## 👥 Community, Volunteers & Contributing

We welcome community contributions from engineers worldwide! Whether you want to translate checklists, add code examples in Go/Rust/Java/C#, or develop automated linter rules, we have a place for you:

* 🗺️ Explore open contributor tasks in our **[Volunteer Roadmap (ROADMAP.md)](./ROADMAP.md)**.
* 📖 Review our detailed step-by-step **[Contributor Guide (CONTRIBUTING.md)](./CONTRIBUTING.md)**.
* 📜 Check our community standards in our **[Code of Conduct (CODE_OF_CONDUCT.md)](./CODE_OF_CONDUCT.md)**.
* 🛡️ Disclose security vulnerabilities responsibly via our **[Security Policy (SECURITY.md)](./SECURITY.md)**.

### 🎖️ Contributors Hall of Fame
All approved contributions (even fixing a typo or adding a single code snippet) receive permanent Git attribution and are recognized in our community Hall of Fame!

---

## 📄 License

This framework is open-source software licensed under the [MIT License](./LICENSE). Free for commercial, personal, and enterprise use.
