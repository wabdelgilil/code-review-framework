# 📉 Real-World Case Studies & Outage Post-Mortems

> **Navigation Breadcrumb:** [🏠 Root (Level 0)](../README.md) > **Case Studies**
> **Philosophy:** High-profile software disasters are rarely caused by deep esoteric math. In 90% of cases, catastrophic outages result from violating basic software engineering disciplines.

This directory catalogs famous software failures, financial collapses, and systemic outages from tech history, demonstrating how strict adherence to the **Code Review Framework (CRF)** would have prevented them.

---

## 📚 Incident Catalog

| Case Study | Year | Direct Financial / Operational Impact | Violated CRF Checkpoint | Direct Link |
| :--- | :---: | :--- | :--- | :---: |
| **Knight Capital Collapse** | 2012 | \$440 Million lost in 45 minutes; bankruptcy | `CHK-ARCH-0205` (Zero Dead Code) | [Read Case Study](./01_knight_capital_dead_code_disaster.md) |
| **Cloudflare Global Edge Outage** | 2019 | Global CDN CPU spiked to 100%; massive web blackout | `CHK-RES-0505` (ReDoS Defense) & `CHK-RES-0301` (Timeouts) | [Read Case Study](./02_cloudflare_regex_redos_blackout.md) |
| **Patriot Missile Clock Drift** | 1991 | 28 fatalities; missile defense failure | `CHK-DOM-0201` (Float Precision & Epsilon Bounds) | [Read Case Study](./03_patriot_missile_floating_point_drift.md) |

---

## 💡 How to Contribute a Case Study

Did your team or a well-documented public post-mortem suffer an outage caused by a fundamental engineering defect?
Check our [CONTRIBUTING.md](../CONTRIBUTING.md) to submit a new case study linking the incident to an existing Checkpoint ID!
