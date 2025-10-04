# Repository Guidelines

## Project Structure & Module Organization
Little Lemon is a Vite-based React app. Runtime code lives in `src/`, with UI components split into `components/common`, `components/features/Reservation`, and `components/layout`. Pages sit in `pages/`, shared hooks in `hooks/`, domain logic in `services/`, and context providers in `context/`. CSS Modules accompany components as `*.module.css`, while static assets are under `public/` and reusable imagery in `src/assets/`. Build output lands in `dist/`; generated coverage lives in `coverage/`; automation scripts remain in `scripts/`; long-form docs belong in `docs/`.

## Build, Test, and Development Commands
Install dependencies with `pnpm install` (lockfile source) or `npm install` when pnpm is unavailable—keep `pnpm-lock.yaml` authoritative. Use `pnpm dev` (or `npm run dev`) for the Vite dev server at http://localhost:5173. `pnpm build` produces `dist/`, `pnpm preview` serves the build locally, `pnpm lint` runs ESLint, and `pnpm format` applies Prettier. Testing flows through Vitest: `pnpm test` for CI-friendly runs, `pnpm test:ui` for interactive debugging, `pnpm test:coverage` for quick coverage, and `pnpm coverage:report` to regenerate the HTML summary in `coverage/`.

## Coding Style & Naming Conventions
Adhere to Prettier (`pnpm format`) with two-space indentation, single quotes, trailing commas, and semicolons as configured in `.prettierrc`. ESLint uses the React, hooks, and Vitest presets; resolve all warnings before opening a PR. Structure React files in PascalCase (`ReservationForm.jsx`) and colocate module styles (`ReservationForm.module.css`). Keep hooks in camelCase starting with `use`, contexts in `SomethingContext.jsx`, and test doubles or fixtures in `*.mock.js`.

## Testing Guidelines
Vitest and Testing Library power unit and integration tests. Name specs `*.test.jsx` or `*.test.js` and mirror the source path (`ReservationForm.test.jsx`). Target at least the existing reservation-flow coverage (100% statements) when touching that domain, and avoid regressions below current overall coverage (≈33%). Run `pnpm coverage:report` after significant changes and review the HTML report under `coverage/` for gaps. Include accessibility assertions via `jest-axe` or `vitest-axe` when adding interactive widgets.

## Commit & Pull Request Guidelines
Follow the prevailing concise, imperative style seen in history (e.g., `Improve project setup for reviewers`). Keep commits scoped to a single concern and include relevant scripts or fixtures. PRs should describe the feature or fix, link issues when applicable, list verification commands, and attach screenshots or GIFs for UI-facing changes. Confirm lint, tests, and coverage locally before requesting review.
