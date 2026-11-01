# 🚀 Pre-Submission Checklist (Author Pre-Flight)

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](./README.md) > **Pre-Submission Checklist**
> **Grounding:** Inspired by **Google Engineering Practices (`google/eng-practices`)**, **Microsoft Code Review Playbook**, and **Conventional Commits**.

---

## 🎯 Purpose & Scope

This checklist is an author's **3-minute self-verification pre-flight** before opening a Pull Request (PR) or requesting peer review. Reviewers should not be treated as compilers, linters, or secret scanners. 

By running through this pre-flight, authors ensure their diff is **focused**, **deterministic**, **secure**, and **courteous** of reviewer time.

---

## ⏱️ The 3-Minute Pre-Flight Checklist

Before opening the PR or flagging it as `Ready for Review`, verify each item below:

### 1. Scope, Atomicity & Diff Size
- [ ] **Small Diff Size**: Diffs are ideally $\le 400$ lines of code (excluding auto-generated code/lockfiles). Small PRs are reviewed 2x faster and catch 3x more defects. (*Ref: Google Eng Practices*)
- [ ] **Single Conceptual Responsibility**: The PR does exactly one thing (one feature, one bug fix, or one refactoring). It does not bundle unrelated cleanups or formatting changes.
- [ ] **Clear Git History**: Commits follow Conventional Commits format (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`) with imperative, present-tense summaries.

### 2. Static Analysis, Linting & Hygiene
- [ ] **Zero Linter Warnings**: Code adheres to strict project rules (`--fatal-warnings` / `--max-warnings=0`). (`CHK-ARCH-0201`)
- [ ] **No Dead or Commented-Out Code**: No orphaned routines, unused imports, or zombie code commented out. (`CHK-ARCH-0205`, `CHK-ARCH-0206`)
- [ ] **No Debug Leaks**: Zero residual `console.log`, `print()`, `dump()`, or temporary debug flags.
- [ ] **Dependency & Lockfile Check**: No unpinned floating dependencies or unintentional lockfile diffs. (`CHK-ARCH-0301`, `CHK-ARCH-0302`)

### 3. Security, Privacy & Secrets Screening
- [ ] **Zero Hardcoded Secrets**: Scanned locally using tools like `gitleaks protect --staged` or `trufflehog`. Zero API keys, private tokens, or passwords committed. (`CHK-RES-0502`)
- [ ] **Sanitized Inputs & Queries**: All external queries and OS executions are parameterized, escaped, or use safe builders. Zero string concatenation for SQL/shell. (`CHK-RES-0501`)
- [ ] **Safe Boundary Parsing**: All external input payloads are parsed and validated via strict schemas, not blindly cast. (`CHK-RES-0201`)

### 4. Tests & Determinism
- [ ] **100% Test Pass Rate**: Local test suite runs completely green from a clean state. (`CHK-TEST-0201`)
- [ ] **New Behavior Covered**: New logic has matching unit/integration tests with positive and negative/boundary cases. (`CHK-TEST-0101`, `CHK-TEST-0102`)
- [ ] **No Flaky / Order-Dependent Tests**: New tests pass when run repeatedly and in isolation. (`CHK-TEST-0202`)
- [ ] **Meaningful Assertions**: No empty test stubs or assertion-free tests (`assert true`). (`CHK-TEST-0402`)

### 5. Error Handling & Resilience
- [ ] **No Swallowed Exceptions**: All `try/catch` blocks handle errors meaningfully or propagate them. Zero empty catch blocks. (`CHK-RES-0102`)
- [ ] **Explicit Timeouts**: All network calls, subprocesses, and lock acquisitions have finite timeouts. (`CHK-RES-0301`)
- [ ] **Resource Cleanup**: All acquired handles, file descriptors, streams, and database connections are deterministically released (`using`, `try-with-resources`, `defer`, or `finally`). (`CHK-RES-0401`)

### 6. Documentation & In-Code Context
- [ ] **"Why" Over "What"**: Complex algorithms, non-obvious design choices, or workarounds contain clear inline rationale comments. (`CHK-UX-0202`)
- [ ] **Public API / Contracts Documented**: Modified or newly exported functions/classes have complete docstrings detailing parameters, return types, and thrown exceptions. (`CHK-UX-0201`)
- [ ] **Breaking Changes Flagged**: Any migration, environment variable addition, or schema update is documented in the PR description. (`CHK-UX-0401`)

### 7. Author's Full Diff Self-Review
- [ ] **Personal Walkthrough**: The author has personally reviewed the entire raw `git diff` in the PR UI or terminal before pinging reviewers. 
- [ ] **Self-Annotations Added**: Proactive explanatory comments are left on complex or unconventional sections to preempt reviewer questions.

---

## 🛠️ Automated Author Command-Line Runner

Run this pre-flight shell sequence in your repository root before pushing:

```bash
# 1. Verify clean git status and branch freshness
git status
git fetch origin && git merge-base --is-ancestor origin/main HEAD || echo "Branch is behind main!"

# 2. Check diff line statistics
git diff --stat origin/main...HEAD

# 3. Scan for staged secrets
gitleaks protect --staged --verbose

# 4. Search for lingering debug statements in staged changes
git diff --cached -S "console.log" -S "debugger" -S "print(" -S "TODO" --name-only

# 5. Run static analysis and linter
npm run lint # or: cargo clippy, flake8, golangci-lint, flutter analyze

# 6. Run test suite with race detector / determinism checks
npm test # or: cargo test, pytest, go test -race ./...
```

---

## 📋 Fast Copy-Paste Markdown for PR Drafts

```markdown
### ✈️ Author Pre-Flight Verification
- [x] Diff is focused ($\le 400$ LOC or justified)
- [x] All local tests pass cleanly and deterministically
- [x] Static analysis / linters report 0 errors and 0 warnings
- [x] Scanned for hardcoded secrets and debug statements (clean)
- [x] All external inputs validated / queries parameterized
- [x] Public interfaces and non-obvious logic documented
- [x] Author conducted full self-review of the diff
```
