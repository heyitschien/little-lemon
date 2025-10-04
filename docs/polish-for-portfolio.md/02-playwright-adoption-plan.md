---
Title: Playwright Adoption Implementation Plan
Author: Chien Escalera Duong
Date Created: 2025-10-03
Time Created: 17:13:42 PDT
Last Updated: 2025-10-03 17:13:42 PDT
Version: 1.0
---

# Objective
- **Goal** Introduce Playwright end-to-end coverage for Little Lemon reservation and chat flows with CI integration.
- **Success Criteria** Playwright tests pass locally and on CI, covering happy and invalid reservation paths plus chatbot interaction.

# Scope
- **In-Scope** Reservation booking flow, reservation validation errors, My Reservations listing, AI chatbot quick recommendation.
- **Out-of-Scope** Menu browsing without reservation interaction, non-restaurant pages, performance benchmarking.

# Dependencies
- **Tooling** Install `@playwright/test`, set up test runner config and scripts.
- **Environment** Ensure seed data/localStorage mocks for reservations and Gemini fallback.
- **CI** GitHub Actions runner with browsers; re-use existing pipeline or add new workflow.

# Deliverables
- **Code** Playwright test suite under `tests/e2e/`, reusable fixtures, test utils.
- **Config** `playwright.config.ts`, scripts (`pnpm test:e2e`, `pnpm test:e2e:headed`).
- **CI** Workflow file triggering Playwright on PRs to `staging`/`main`.
- **Docs** README updates describing e2e coverage and usage instructions.

# Work Breakdown Structure
- **Phase 0: Setup** Install dependencies, scaffold config, add scripts, record baseline trace storage.
- **Phase 1: Reservation Happy Path** Test visiting `/reservations`, completing form, verifying confirmation and storage.
- **Phase 2: Reservation Validation Errors** Test missing fields, past date, unavailable time errors.
- **Phase 3: My Reservations Flow** Ensure completed reservations appear in list view.
- **Phase 4: Chatbot Interaction** Mock Gemini response, validate item cards render.
- **Phase 5: CI Integration** Add workflow, enable artifacts (videos, traces), run with axe when available.
- **Phase 6: Documentation** Add README instructions, update index status, capture screenshots.

# Task Tracker
| ID | Task | Owner | Status | Notes |
| --- | --- | --- | --- | --- |
| PW-01 | Install Playwright (`pnpm create playwright` or manual deps). | TBD | Not Started | Choose Chromium only to reduce CI time. |
| PW-02 | Create `playwright.config.ts` with baseURL and project settings. | TBD | Not Started | Configure retries and trace on failure. |
| PW-03 | Author reservation happy-path test (`reservation-happy.spec.ts`). | TBD | Not Started | Include screenshot assertions. |
| PW-04 | Author validation error test (`reservation-errors.spec.ts`). | TBD | Not Started | Verify toast/error messages. |
| PW-05 | Author My Reservations test (`my-reservations.spec.ts`). | TBD | Not Started | Seed via form or fixture. |
| PW-06 | Author chatbot interaction test (`chat-assistant.spec.ts`). | TBD | Not Started | Mock API with route interception. |
| PW-07 | Add Playwright scripts to `package.json`. | TBD | Not Started | `test:e2e`, `test:e2e:ci`. |
| PW-08 | Configure GitHub Action for e2e runs. | TBD | Not Started | Use `microsoft/playwright-github-action`. |
| PW-09 | Update README with usage instructions and embed test badge. | TBD | Not Started | Document CLI commands. |
| PW-10 | Capture demo artifacts (videos/screenshots) for portfolio. | TBD | Not Started | Provide links in README. |

# Implementation Steps
- **Phase 0** Install Playwright, run codegen for baseline selectors, configure env variables (feature flags, API keys).
- **Phase 1-3** Write tests sequentially, leverage fixtures for repeated setup, ensure deterministic localStorage handling.
- **Phase 4** Stub Gemini service by intercepting network call in Playwright, assert message bubble + item cards.
- **Phase 5** Add CI job to `.github/workflows/playwright.yml`, run `pnpm test:e2e --reporter=line` with trace upload on failure.
- **Phase 6** Document commands in `README`, update `recommended-actions-index.md` with progress.

# Validation Plan
- **Local** `pnpm test:e2e` using headless browsers; run with `--debug` when iterating.
- **CI** Validate GitHub Action success, review artifacts on failure.
- **Manual** Spot-check flows in browser to ensure selectors remain stable.

# Risk & Mitigation
- **Flaky tests** due to async UI; use explicit waits and `data-testid` hooks if necessary.
- **Chat API dependency**; mitigate with Playwright route mocks or feature flag forcing local stub.
- **CI runtime**; limit to Chromium by default, allow manual run for WebKit/Firefox when needed.

# Rollback Strategy
- **Branching** Keep e2e work on feature branch; revert workflow if causing CI failures.
- **Config** Wrap new scripts behind optional commands until stable.

# Communication Cadence
- **Updates** Post results in Slack/notes after each spec passes reliably.
- **Reviews** Request FE + QA review to vet coverage and reliability.

# Exit Criteria
- **Technical** All Playwright specs stable for multiple runs, CI pipeline green.
- **Operational** README + index updated, team comfortable expanding e2e coverage.
