# 🤝 Contributing & Volunteer Guide

Thank you for your interest in contributing to the **Software Quality, Review & Testing Framework**! We believe great software engineering standards are built by the global developer community. 

Whether you have 10 minutes to fix a typo, want to add code examples in your favorite programming language, or wish to contribute an entire checkpoint card, **your contribution is warmly welcomed**.

---

## 🧭 Where Can You Help? (Volunteer Tracks)

Before getting started, check our active **[🗺️ Volunteer Roadmap (ROADMAP.md)](./ROADMAP.md)** for curated areas seeking contributors:
* **💻 Polyglot Code Snippets**: Add Go, Rust, Java, C#, or C++ examples to existing checkpoints.
* **🤖 Linter & Scanner Rules**: Translate checkpoint criteria into executable Semgrep, ESLint, or CodeQL rules.
* **🛡️ Security & Supply Chain**: Introduce checks for SBOM, SLSA, and automated fuzzing.
* **🌍 Internationalization (i18n)**: Translate checklists and documentation into other languages (Arabic, Spanish, French, etc.).
* **📖 Docs & Typo Polish**: Fix broken links, enhance explanations, and improve readability.

---

## 🎯 Contribution Principles

Every contribution must align with our core governance principles outlined in [README.md](./README.md):

1. **Domain Neutrality**: Do not introduce language-specific, framework-specific, or proprietary business domain assumptions into general principles. Keep rules universally applicable.
2. **Authoritative Grounding**: Checks must cite a recognized industry standard (ISO/IEC 25010, ISO 29119, OWASP ASVS, NIST, Twelve-Factor, etc.). Speculative or idiosyncratic personal opinions will not be accepted.
3. **Evidence-Based & Falsifiable**: A check must provide concrete, verifiable verification commands and clear Pass/Fail criteria.
4. **Canonical & Anti-Pattern Code**: Every checkpoint card must include clear, realistic code snippets demonstrating both the defect and the recommended fix.

---

## 📁 Repository Structure & Checkpoint Hierarchy

This repository follows a strict 4-level hierarchical tree:

* **Level 1 (Pillars)**: `01_architecture_and_code_quality` to `06_documentation_and_operations`
* **Level 2 (Sub-Pillars)**: e.g., `01_modularity_and_separation_of_concerns/`
* **Level 3 (Categories)**: e.g., `01_domain_core_isolation/`
* **Level 4 (Checkpoint Cards)**: e.g., `01_zero_framework_leakage.md`

### Checkpoint ID Scheme:
```text
CHK-<PILLAR>-<SUBPILLAR_INDEX><CATEGORY_INDEX>
Example: CHK-ARCH-0101, CHK-RES-0502
```

---

## 📝 Standard Checkpoint Card Template

When proposing a new checkpoint card or modifying an existing one, adhere to this standard template:

```markdown
# 🏷️ Checkpoint: [Descriptive Name] (`CHK-XXX-XXXX`)

> **Breadcrumb:** [🏠 Root](../../../README.md) > [Pillar](../../README.md) > [Sub-Pillar](../README.md) > **Checkpoint**
> **Grounding:** [Standard Citation, e.g. ISO/IEC 25010 §X.X, OWASP ASVS §X.X]
> **Tier:** [Tier 1 (Hygiene) | Tier 2 (Enterprise) | Tier 3 (Mission-Critical)]
> **Severity:** [Mandatory | Best Practice | Style Preference]

---

## 🎯 Specification & Rationale
[Clear, objective explanation of what this check verifies and why it matters.]

## 🚨 Anti-Pattern (Defect Example)
[Code snippet illustrating the bad practice.]

## ✅ Canonical Pattern (Remediated Example)
[Code snippet illustrating the correct, robust practice.]

## 🛠️ Verification & CLI Command
[Exact command or script to automate verification.]

## ⚖️ Pass / Fail Criteria
* **PASS**: [Exact condition]
* **FAIL**: [Exact condition]
```

---

## 🚀 Volunteer Step-by-Step Workflow

1. **Fork the Repository**:
   Click the **Fork** button on GitHub to create your personal copy.

2. **Clone & Create a Feature Branch**:
   ```bash
   git clone https://github.com/wabdelgilil/code-review-framework.git
   cd code-review-framework
   git checkout -b feat/add-go-example-chk-res-0401
   ```

3. **Make Your Changes**:
   - Keep your diff focused and atomic.
   - Maintain cross-links and navigation breadcrumbs.

4. **Verify Internal Links & Markdown**:
   - Check that relative paths to parent and child files remain valid.

5. **Submit a Pull Request**:
   - Open a PR against the `main` branch.
   - The repository's standard PR template will load automatically; fill out the relevant sections.

---

## ⏱️ Maintainer Review SLA

We deeply value your time. Maintainers commit to:
* Reviewing every volunteer PR within **48 business hours**.
* Providing constructive, respectful, and actionable feedback adhering to [CONVENTIONAL_REVIEWS.md](./CONVENTIONAL_REVIEWS.md).
* Assisting first-time contributors with git rebase or formatting adjustments if needed.

---

## 🎖️ Contributor Recognition (Hall of Fame)

We recognize all contributions via the GitHub Contributors graph and our README Hall of Fame. Consistent volunteers are invited to join the review team and shape future architectural decisions!
