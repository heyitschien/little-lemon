---
Title: Accessibility and Coverage Automation Plan
Author: Chien Escalera Duong
Date Created: 2025-10-03
Time Created: 17:13:42 PDT
Last Updated: 2025-10-03 17:13:42 PDT
Version: 1.0
---

# Objective
- **Goal** Automate accessibility (axe) checks and coverage reporting across Little Lemon’s CI pipeline.
- **Success Criteria** CI fails on accessibility regressions, publishes coverage badge/assets, and developers can reproduce checks locally.

# Scope
- **In-Scope** Integration of axe with unit/e2e tests, Vitest coverage artifacts, GitHub Action workflows, badge publication.
- **Out-of-Scope** Manual accessibility audits, Lighthouse CI (handled in deployment/performance plan).

# Dependencies
- **Tooling** `@axe-core/playwright` or `axe-core` integration, GitHub Actions with artifact storage, coverage hosting (Codecov or shields.io).
- **Infrastructure** Access to repository secrets if external services used (Codecov token).
- **Team** Coordination with TS and Playwright initiatives for shared configs.

# Deliverables
- **Code** Axe helpers for Playwright/Vitest, scripts to run accessibility checks.
- **Config** Updated GitHub Action workflow combining lint, unit, coverage, axe steps.
- **Artifacts** Coverage summary uploads, badge markdown in `README.md`.
- **Docs** README + `SETUP.md` instructions for running accessibility/coverage commands.

# Work Breakdown Structure
- **Phase 0: Tooling Alignment** Decide on axe integration points (Vitest vs Playwright), select coverage badge provider.
- **Phase 1: Local Scripts** Add npm scripts for `test:a11y`, `test:coverage:ci`, ensure deterministic outputs.
- **Phase 2: GitHub Actions** Extend CI pipeline for lint, unit, coverage upload, axe run, and caching.
- **Phase 3: Badge Publication** Update README with dynamic shield(s) referencing latest results.
- **Phase 4: Hardening** Introduce sample failing case to validate pipeline, document mitigation steps.

# Task Tracker
| ID | Task | Owner | Status | Notes |
| --- | --- | --- | --- | --- |
| AC-01 | Evaluate axe integration approach (Playwright vs Vitest). | TBD | Not Started | Prefer Playwright for full DOM coverage. |
| AC-02 | Implement local `pnpm test:a11y` script. | TBD | Not Started | Wrap Playwright axe helper. |
| AC-03 | Ensure Vitest coverage output saved to `coverage/coverage-summary.json`. | TBD | Not Started | Already partially configured; verify paths. |
| AC-04 | Configure GitHub Action job for lint + unit + coverage. | TBD | Not Started | Use matrix if needed. |
| AC-05 | Add Playwright axe run in CI. | TBD | Not Started | Condition on e2e completion. |
| AC-06 | Upload coverage summary to artifact/Codecov. | TBD | Not Started | Evaluate `codecov/codecov-action`. |
| AC-07 | Add coverage badge + accessibility status badge to README. | TBD | Not Started | Use shields.io or Codecov badge. |
| AC-08 | Document troubleshooting steps in README/SETUP. | TBD | Not Started | Include note on CI environment variables. |
| AC-09 | Update index status and retrospective notes once pipeline stable. | TBD | Not Started | Tie to milestone 2. |

# Implementation Steps
- **Phase 0** Review Playwright plan for hooking axe post-tests, confirm jest-axe usage in Vitest.
- **Phase 1** Create local script invoking Playwright tests with axe, ensure `pnpm test:a11y` accessible.
- **Phase 2** Modify `.github/workflows/ci.yml` (or new workflow) to run lint, unit (Vitest with coverage), Playwright with axe, and upload results.
- **Phase 3** Integrate coverage badge referencing `coverage-summary.json`; consider storing badge data via shields.io endpoint or Codecov.
- **Phase 4** Induce intentional failure to verify pipeline gating, then revert; document process.

# Validation Plan
- **Local** Run `pnpm test:a11y` and `pnpm test:coverage` ensuring outputs consistent.
- **CI** Confirm workflow fails on accessibility violation and passes otherwise.
- **Documentation** Verify README badges update correctly after CI run.

# Risk & Mitigation
- **Risk** Flaky axe runs due to dynamic content. **Mitigation** Use stable selectors, wait for hydration.
- **Risk** Coverage upload quota or authentication. **Mitigation** Prefer self-hosted badge via GitHub Pages or shields endpoint if tokens unavailable.
- **Risk** Pipeline duration increases. **Mitigation** Use caching and selective job triggers (only on PRs to key branches).

# Rollback Strategy
- **Config** Keep previous workflow in history, revert commit if CI instability occurs.
- **Scripts** Guard new scripts; revert package.json changes if necessary.

# Communication Cadence
- **Updates** Post CI pipeline screenshots/logs after first successful run.
- **Reviews** Request DevOps/QA review for workflow reliability.

# Exit Criteria
- **Technical** CI enforces accessibility + coverage thresholds; README badges reflect latest results.
- **Operational** Team can run accessibility/coverage scripts locally; index updated to in-progress/completed as milestones reached.
