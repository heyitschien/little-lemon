---
Title: Balancing Course Learning with Modern Capstone Development
Author: Chien Escalera Duong
Date Created: 2025-06-03
Time Created: 18:19:34 PDT
Last Updated: 2025-06-03 18:19:34 PDT
Version: 1.0
---

It's a common and important consideration to balance the curriculum of a structured course, like the Meta Front-End Developer certification, with the ambition to build a cutting-edge capstone project that reflects current industry best practices, especially looking towards 2025. This document outlines an approach to achieve this balance for your Little Lemon project.

## Analysis of Your Current Tech Stack (as of June 2025)

Your `package.json` reveals a surprisingly modern and strong foundation:

*   **React & Build Tools:**
    *   `react: "^19.1.0"`, `react-dom: "^19.1.0"`: You're using a very new version of React, which is excellent.
    *   `vite: "^6.3.5"`: A fast, modern build tool.
*   **Routing:**
    *   `react-router-dom: "^7.6.0"`: A recent version of React Router, compatible with React 19.
*   **Testing (A Major Strength):**
    *   `vitest: "^3.2.0"`: Modern, fast test runner.
    *   `@testing-library/react: "^16.3.0"`: Standard for testing React components.
    *   `@playwright/test: "^1.52.0"`: Powerful tool for end-to-end testing.
    *   Includes coverage (`@vitest/coverage-v8`) and UI (`@vitest/ui`) for Vitest. This setup already covers many of the "2025 Capstone Recommendations" for testing.
*   **Linting & Formatting:**
    *   `eslint: "^9.25.0"`, `prettier: "^3.5.3"`: Latest versions for maintaining code quality.
*   **TypeScript Hint:** The presence of `@types/*` packages suggests potential or planned TypeScript usage, a modern practice.

## Key Gaps Compared to "2025 Capstone Recommendations"

While your foundation is strong, here are the main areas for potential enhancement based on the "2025 Capstone Recommendations":

1.  **Advanced State Management:** No dedicated library like **Redux Toolkit** or **Zustand** is currently listed.
2.  **API Mocking (MSW):** **Mock Service Worker (MSW)** for realistic API simulation is not present.
3.  **Performance Optimization (Explicit Focus):** Beyond Vite's inherent benefits, explicit strategies like code splitting, lazy loading, and performance monitoring (Lighthouse CI, Web Vitals) are recommended.
4.  **Accessibility (WCAG AA):** This is more about implementation practices but is a key focus.
5.  **Progressive Web App (PWA) Features:** Service Workers for offline capabilities and a PWA manifest.
6.  **Visual Regression Testing:** Tools like **Storybook** and **Chromatic**.
7.  **Comprehensive Documentation:** JSDoc, Architecture Decision Records (ADRs).

## Recommended Course of Action: An Incremental Hybrid Approach

The best path is an incremental hybrid approach, allowing you to leverage your course learning while progressively modernizing your capstone.

### Phase 1: Solidify Core React Skills (Continue with Course)

*   **Leverage Your Modern Stack:** Continue building with React 19, Vite, and your excellent testing setup. Course fundamentals on components, hooks, state, and context are directly applicable.
*   **Master React's Built-in State Management:** Focus on `useState`, `useReducer`, and Context API as taught. Understanding these is crucial before adopting external libraries.
*   **Basic API Interaction:** Follow course guidance on `fetch` or `axios` with simple mock data.
*   **Test Rigorously:** **This is paramount.** Use Vitest, React Testing Library, and Playwright for *everything* you build. Do not defer testing.

### Phase 2: Incrementally Introduce "2025 Capstone" Enhancements

Once comfortable with core React concepts, layer in advanced features:

1.  **Integrate MSW (Mock Service Worker):**
    *   **Why:** More realistic API interactions for development/testing.
    *   **How:** Learn MSW and refactor features to use it.
2.  **Explore Advanced State Management (e.g., Zustand):**
    *   **Why:** Simplifies state logic for larger apps. Zustand is often a good starting point.
    *   **How:** Learn Zustand and refactor a significant feature's state management.
3.  **Deepen Focus on Accessibility (WCAG AA):**
    *   **Why:** Essential for modern web development.
    *   **How:** Apply accessibility principles (semantic HTML, ARIA, keyboard navigation). Use tools like Axe DevTools.
4.  **Implement Performance Optimizations:**
    *   **Why:** Crucial for user experience.
    *   **How:** Apply `React.lazy()`, route-based code splitting, and consider Lighthouse CI.
5.  **Introduce PWA Features:**
    *   **Why:** Offline capabilities and installability.
    *   **How:** Start with a basic service worker and PWA manifest. Vite plugins can assist.
6.  **(Optional, but Recommended) Storybook:**
    *   **Why:** Component development in isolation, documentation, visual testing precursor.
    *   **How:** Set up Storybook and create stories for key UI components.

## Addressing Specific Concerns

*   **Finishing the course then updating vs. transforming now:** Finish core React learning first, but integrate modern practices (especially testing) *as you go*. Enhancements are mostly additions, not replacements.
*   **Comprehensive testing:** **Do comprehensive testing from day one.** Your current stack is perfect for this. This is non-negotiable.

## Summary

Your Little Lemon project has a very modern foundation. The "2025 Capstone Recommendations" are about layering additional best practices and tools onto this solid base, not overhauling it. Proceed by:

1.  Continuing your course, focusing on core React.
2.  Using your modern testing tools diligently throughout.
3.  Incrementally introducing advanced features after mastering related core concepts.

This balanced approach will maximize your learning and result in an impressive, modern capstone project.
