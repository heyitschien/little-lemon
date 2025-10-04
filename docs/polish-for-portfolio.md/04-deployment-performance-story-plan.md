---
Title: Deployment and Performance Story Plan
Author: Chien Escalera Duong
Date Created: 2025-10-03
Time Created: 17:13:42 PDT
Last Updated: 2025-10-03 17:13:42 PDT
Version: 1.0
---

# Objective
- **Goal** Deploy Little Lemon to a production host (Vercel/Netlify) and craft a performance narrative anchored by Lighthouse metrics and mobile experience wins.
- **Success Criteria** Live deployment URL available, Lighthouse scores documented, README reflects performance strategy and evidence.

# Scope
- **In-Scope** Deployment setup, environment configuration, Lighthouse audits, README updates, asset optimization review.
- **Out-of-Scope** Backend API hosting (project uses local storage), full CDN strategy beyond build-time optimizations.

# Dependencies
- **Infrastructure** Vercel or Netlify account access, ability to connect GitHub repo.
- **Tooling** Lighthouse CLI/CI, potentially `lighthouse-ci` GitHub Action, screenshot tooling for documentation.
- **Data** Ensure built app references correct assets and environment variables.

# Deliverables
- **Deployment** Configured hosting with production URL, preview deployments on branches.
- **Performance Reports** Lighthouse run (mobile + desktop) with stored JSON/HTML, summarized metrics in README.
- **Docs** README section highlighting deployment steps, performance strategy, and key metrics; update `recommended-actions-index.md` status.

# Work Breakdown Structure
- **Phase 0: Pre-Deployment Audit** Verify build readiness, adjust base paths, confirm environment variables (if any).
- **Phase 1: Hosting Setup** Configure Vercel/Netlify project, connect repo, set build command (`pnpm build`) and output directory (`dist`).
- **Phase 2: Lighthouse Benchmarking** Run Lighthouse locally and via CI, capture metrics and screenshots.
- **Phase 3: Performance Enhancements** Address findings (image optimization, code splitting, caching) as needed.
- **Phase 4: Documentation** Add deployment URL, Lighthouse summary, and performance insights to README; update index.

# Task Tracker
| ID | Task | Owner | Status | Notes |
| --- | --- | --- | --- | --- |
| DP-01 | Verify production build locally (`pnpm build && pnpm preview`). | TBD | Not Started | Ensure no console errors. |
| DP-02 | Configure Vercel/Netlify project with repo connection. | TBD | Not Started | Set environment variables if needed. |
| DP-03 | Enable preview deployments on feature branches. | TBD | Not Started | Useful for QA/testing. |
| DP-04 | Run Lighthouse locally (mobile + desktop) and save reports. | TBD | Not Started | Use `lighthouse --preset=desktop`. |
| DP-05 | Create GitHub Action for Lighthouse CI (optional). | TBD | Not Started | Upload reports as artifacts. |
| DP-06 | Analyze Lighthouse findings; implement optimizations. | TBD | Not Started | Prioritize mobile LCP and accessibility suggestions. |
| DP-07 | Update README with deployment badge/link and Lighthouse scores. | TBD | Not Started | Include screenshots. |
| DP-08 | Update `recommended-actions-index.md` status and milestone. | TBD | Not Started | Note completion in dashboard. |

# Implementation Steps
- **Phase 0** Ensure `vite.config` configured for production base path, confirm environment usage for API keys (Gemini) is safe.
- **Phase 1** Choose hosting (default Vercel), connect repo, configure build (pnpm, Node version), verify production deploy.
- **Phase 2** Run Lighthouse on deployed URL; optionally use `lighthouse-ci` for repeatable audits and commit comparisons.
- **Phase 3** Address top Lighthouse recommendations (e.g., compress images, preconnect fonts, reduce bundle size).
- **Phase 4** Document performance story in README with metrics table, highlight mobile-first improvements, link to reports.

# Validation Plan
- **Deployment** Confirm live URL loads across devices (desktop/mobile) without errors.
- **Performance** Lighthouse score ≥90 for Performance, Accessibility, Best Practices, SEO; capture evidence.
- **Documentation** README reflects final metrics and narrative; index updated.

# Risk & Mitigation
- **Risk** Build fails in hosting environment. **Mitigation** Match Node/pnpm versions, run build locally before pushing.
- **Risk** Lighthouse scores vary due to network. **Mitigation** Use multiple runs and median result; document variance.
- **Risk** Gemini API keys exposed. **Mitigation** Use environment variables or stub for demos if needed.

# Rollback Strategy
- **Deployment** Keep previous deployment as fallback; disable auto-deploy if issues arise.
- **Perf Changes** Revert optimization commits if regressions observed.

# Communication Cadence
- **Updates** Share deployment URL and Lighthouse screenshots with team; log in `recommended-actions-index.md`.
- **Reviews** Request peer review for README updates and performance adjustments.

# Exit Criteria
- **Technical** Production deployment stable; Lighthouse reports stored; README updated with metrics and narrative.
- **Operational** Team comfortable maintaining deployment pipeline; index milestone 3 marked in progress/completed.
