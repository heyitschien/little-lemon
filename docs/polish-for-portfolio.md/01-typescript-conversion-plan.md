---
Title: TypeScript Conversion Implementation Plan
Author: Chien Escalera Duong
Date Created: 2025-10-03
Time Created: 17:05:35 PDT
Last Updated: 2025-10-03 17:19:26 PDT
Version: 1.0
---

# Objective
- **Goal** Establish a strict TypeScript foundation across critical Little Lemon modules while preserving existing behavior and tests.
- **Success Criteria** `tsc --noEmit` passes, reservation/chat pathways function identically, and unit tests remain green.

# Scope
- **In-Scope** `ReservationForm`, `DateTimeSelector`, `ReservationConfirmation`, `ReservationList`, `useReservation`, `reservationService`, Gemini chat components, shared utilities, and related tests.
- **Out-of-Scope** Non-reservation pages, global CSS tokens, major UX refactors (handled post-migration).

# Dependencies
- **Tooling** Install TypeScript, configure `tsconfig.json`, ensure ESLint recognizes TS.
- **Data** Confirm existing `yup` schemas and reservation models translate cleanly to TS types.
- **People** Assign reviewers comfortable with TS to validate PRs.

# Deliverables
- **Code** Converted `.tsx`/`.ts` files with shared type definitions in `src/types/`.
- **Config** Strict `tsconfig.json`, ESLint + Prettier adjustments, Vitest TS support.
- **Docs** Update `SETUP.md` and `README.md` with TS instructions, add migration notes to `docs/polish-for-portfolio.md/00-recommended-actions-index.md` when complete.

# Work Breakdown Structure
- **Phase 0: Preparation** Install TypeScript + typings, scaffold config, update lint/test scripts.
- **Phase 1: Core Domain Types** Create `Reservation`, `CustomerInfo`, `MenuItem`, `ChatMessage` interfaces; add utility type guards.
- **Phase 2: Reservation Components** Convert form and selectors sequentially, introduce props/state typing, resolve implicit anys.
- **Phase 3: Services & Hooks** Migrate `reservationService` and `useReservation`, ensuring async return types and hook generics align.
- **Phase 4: Chat Assistant** Convert chat container, message list, button, and Gemini service.
- **Phase 5: Test Suite** Update affected tests to `.tsx`, configure Vitest type expectations, add custom matchers typing.
- **Phase 6: Hardening** Run `tsc`, lint, unit tests, adjust for regressions, document learnings.

# Task Tracker
| ID | Task | Owner | Status | Notes |
| --- | --- | --- | --- | --- |
| TS-01 | Add `typescript`, `@types/react`, `@types/node`, configure `tsconfig.json`. | TBD | Not Started | Include `strict: true` and `paths` if needed. |
| TS-02 | Align ESLint/Prettier with TS extensions. | TBD | Not Started | Extend from `typescript-eslint`. |
| TS-03 | Create `src/types/reservation.ts` with shared interfaces. | TBD | Not Started | Export for reuse across services. |
| TS-04 | Convert `ReservationForm.jsx` to `.tsx` and type props/state. | TBD | Not Started | Add form field enum. |
| TS-05 | Convert `DateTimeSelector.jsx` and dependent modules. | TBD | Not Started | Ensure `availableTimes` typed as `string[]`. |
| TS-06 | Convert `ReservationConfirmation.jsx` and `ReservationList.jsx`. | TBD | Not Started | Use discriminated union for status messages. |
| TS-07 | Convert `useReservation.js` to `.ts` with hook generics. | TBD | Not Started | Type localStorage interactions. |
| TS-08 | Convert `reservationService.js` to `.ts` and enforce return types. | TBD | Not Started | Replace dynamic objects with typed responses. |
| TS-09 | Convert Gemini chat components/services to TS. | TBD | Not Started | Create `ChatMessage` and `MenuRecommendation` types. |
| TS-10 | Update Vitest config/tests for TS support. | TBD | Not Started | Ensure `setupTests.ts` typed. |
| TS-11 | Execute validation suite (`tsc`, lint, tests) and document results. | TBD | Not Started | Capture output for portfolio notes. |

# Implementation Steps
- **Phase 0** Install dependencies, add `tsconfig.json`, update scripts (`"tsc": "tsc --noEmit"`).
- **Phase 1** Create shared type files (`src/types/reservation.ts`, `src/types/chat.ts`), export enums/constants, adjust imports.
- **Phase 2** Rename reservation files to `.tsx`, apply type annotations, resolve implicit any warnings, ensure `forwardRef` signatures typed.
- **Phase 3** Migrate `reservationService` + `useReservation`, replace loose objects with typed returns, add helper functions for parsing LS data.
- **Phase 4** Convert chat components, enforce message/item typing, type Gemini service responses, add fallback types for API failures.
- **Phase 5** Update tests to `.test.tsx`, adjust mocks, extend Vitest config to support TS path aliases, ensure jest-dom types imported.
- **Phase 6** Run full validation, fix errors, push branch, update docs and index status.

# Validation Plan
- **Static** `pnpm lint`, `pnpm tsc --noEmit`.
- **Unit** `pnpm test` and `pnpm test ReservationForm.test.tsx` targeting converted suites.
- **Manual** Smoke test reservation flow and chat assistant locally.

# Risk & Mitigation
- **Risk** Type mismatch between stored localStorage data and new interfaces. **Mitigation** Add parsing guards and migration scripts.
- **Risk** Third-party libs lacking types. **Mitigation** Add ambient declarations or community typings.
- **Risk** Timeline creep from large PRs. **Mitigation** Ship phases as separate, reviewable branches.

# Rollback Strategy
- **Branching** Use feature branch (`feature/ts-migration`) per phase, revert via Git if `tsc` introduces issues.
- **Data** Maintain backup of original JS files until TS PRs merged.
- **Config** Keep `allowJs` temporarily to unblock incremental conversion.

# Communication Cadence
- **Checkpoints** End of each phase update `00-recommended-actions-index.md` with status.
- **Reviews** Require code review focusing on type correctness and runtime parity.
- **Docs** Append outcomes and lessons learned to `docs/testing/unit-testing/unit-testing-reflections.md` if tests evolve.

# Exit Criteria
- **Technical** No `any` usage without justification, `tsc --noEmit` passes, Vitest suite green.
- **Operational** Documentation refreshed, team comfortable extending TS coverage to remaining modules.
