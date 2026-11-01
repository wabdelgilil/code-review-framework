# 🤖 Code Review Framework (CRF) - GitHub Action

Enforce enterprise code quality and safety standards directly in your pull requests!

---

## 🚀 Quick Setup in Your Repository

Add this workflow file to `.github/workflows/crf-gate.yml`:

```yaml
name: 🛡️ Code Review Framework Gate

on:
  pull_request:
    branches: [main, master]
  push:
    branches: [main, master]

jobs:
  audit:
    name: CRF Audit Gate
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Run CRF Audit Gate
        uses: wabdelgilil/code-review-framework/tools/github_action@main
        with:
          tier: '1'
          fail-on-violation: 'true'
```

---

## 🔍 Verified Checkpoints in Current Engine
* **`CHK-RES-0102`**: Detects empty `catch` or `except: pass` blocks that silently swallow exceptions.
* **`CHK-RES-0502`**: Scans for accidental hardcoded API tokens, credentials, and secrets.
* **`CHK-ARCH-0401`**: Detects hardcoded absolute host paths (`C:\`, `/home/`, `/Users/`).
* **`CHK-TEST-0203`**: Flags arbitrary `sleep()` or `time.sleep()` calls in unit/integration tests.
