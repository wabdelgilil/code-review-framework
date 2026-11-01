# 💥 Case Study: The 100% CPU Global Edge Blackout (Cloudflare, 2019)

> **Navigation Breadcrumb:** [🏠 Root](../README.md) > [Case Studies](./README.md) > **Cloudflare 2019**
> **Violated Checkpoint:** [`CHK-RES-0505` (Defense Against ReDoS)](../04_resilience_and_error_handling/05_application_security_and_sast/05_defense_against_redos_catastrophic_backtracking.md)
> **Secondary Violated Checkpoint:** [`CHK-RES-0301` (Finite I/O and Subprocess Timeouts)](../04_resilience_and_error_handling/03_timeouts_retries_and_backpressure/01_finite_io_and_subprocess_timeouts.md)

---

## 📅 The Incident Summary

On July 2, 2019, at 13:42 UTC, Cloudflare experienced an unprecedented global outage. Web traffic dropped by **82% globally**, affecting millions of major web properties, APIs, and cloud services worldwide.

The symptom: **CPU utilization on all Cloudflare core proxy engines worldwide spiked to 100% simultaneously**.

### The Trigger
The incident was triggered by a routine deployment of managed WAF (Web Application Firewall) rules designed to detect Cross-Site Scripting (XSS) attacks. One of the newly deployed regular expressions contained a classic catastrophic backtracking vulnerability:

```regex
(?:(?:^|[\s"';<>]|--|/\*|(?<![\w-])#)[^\w-]*?>)
```

Notice the pattern `(?:.*?[^\w-]*?>)` containing overlapping nested quantifiers.

When legitimate HTTP request payloads were evaluated against this regex, the execution time degraded from microseconds to **minutes per request** due to exponential backtracking ($O(2^N)$). 

Because the WAF engine executed in-process on the main proxy event loop without an explicit regex evaluation timeout or catastrophic backtracking check, CPU cores were starved immediately, dropping all incoming HTTP connections globally.

---

## 🔍 Engineering Root Cause Analysis

1. **Unbounded Regex Catastrophic Backtracking (`CHK-RES-0505`)**:
   The regex contained ambiguously overlapping wildcard quantifiers without atomic grouping or non-backtracking engine constraints.
2. **Lack of Finite Evaluation Timeouts (`CHK-RES-0301`)**:
   The regex execution had no runtime deadline. When the backtracking algorithm entered exponential evaluation, it was allowed to run indefinitely, consuming 100% of the thread pool.
3. **Absence of Staging Static Analysis**:
   No static checker (e.g. `safe-regex`, `vuln-regex-detector`) was executed during CI/CD to detect polynomial/exponential worst-case complexity before production rollout.

---

## 🛡️ How CRF Checkpoints Prevent This Disaster

### 1. ReDoS Static Verification (`CHK-RES-0505`)
Under CRF Tier 2 rules:
* Every regular expression committed to the repository must be checked with automated static analyzers (e.g., `eslint-plugin-regexp`, `rxxr2`).
* Regular expressions with worst-case super-linear ($O(N^2)$ or $O(2^N)$) backtracking fail the pre-commit and CI verification gates immediately.

### 2. Mandatory Finite Timeouts (`CHK-RES-0301`)
Under CRF Tier 1 rules:
* Any operation that performs pattern matching or external I/O must execute with a hard timeout or utilize a linear-time non-backtracking regex engine (such as Google's `RE2` or Rust's `regex` crate, which guarantees $O(N)$ execution time).

---

## ⚖️ Lesson for Modern Software Teams

Regular expressions are code. An untested, unbounded regex is indistinguishable from a distributed Denial of Service (DoS) attack against your own infrastructure.
