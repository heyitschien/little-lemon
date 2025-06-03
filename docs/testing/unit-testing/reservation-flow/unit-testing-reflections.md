---
Title: Unit Testing Reflections - Reservation Flow
Author: Chien Escalera Duong
Date Created: 2025-06-02
Time Created: 17:33:00 PDT
Last Updated: 2025-06-02 17:33:00 PDT
Version: 1.0
---

# Unit Testing Reflections - Reservation Flow

This document captures key learnings, challenges, and solutions encountered during the unit testing phase for the Little Lemon reservation feature.

## Key Learnings & Challenges

1.  **ESLint Configuration for Vitest Globals:**
    *   **Challenge:** ESLint initially reported 'not defined' errors for Vitest global functions (`describe`, `test`, `expect`, `vi`, etc.).
    *   **Solution:** Installed `eslint-plugin-vitest` and configured `.eslintrc.json` to include the plugin and enable `vitest/globals` for test files (e.g., `*.test.jsx`). This resolved the linting errors and ensured a smoother development experience.

2.  **Consistent Coverage Reporting:**
    *   **Challenge:** Vitest coverage reports were not always generated or updated automatically with simple `vitest` commands, sometimes requiring specific UI modes or flags.
    *   **Solution:** Updated the `package.json` test script to `vitest run --coverage`. The `run` flag ensures Vitest runs in non-watch mode (suitable for CI or single runs) and `--coverage` explicitly enables coverage report generation. This provides consistent and reliable coverage metrics after each test execution.

3.  **Date and Time Formatting & Timezone Issues:**
    *   **Challenge:** JavaScript's `new Date('YYYY-MM-DD')` constructor parses the date string as UTC. This can lead to off-by-one day errors when converting to local time or formatting, especially if the local timezone is behind UTC.
    *   **Solution:** For creating `Date` objects from `YYYY-MM-DD` strings intended to represent local dates, it's more reliable to parse the string into year, month, and day components and then use `new Date(year, monthIndex, day)`. This constructor interprets the components in the local timezone. For display, `toLocaleDateString()` and `toLocaleTimeString()` with appropriate options were used.

4.  **Mocking Strategies with `vi.mock`:**
    *   **Challenge:** Vitest's `vi.mock` is hoisted. If mock implementations (e.g., `vi.fn()`) are not defined correctly within the mock factory or are defined outside and reassigned, they might be `undefined` when the mocked module is imported by the component under test.
    *   **Solution:** Define mock functions (`vi.fn()`) *inside* the `vi.mock` factory function for services or modules that are imported at the top level of components. This ensures the mocks are correctly established before the component module is evaluated.
        ```javascript
        // Example from unit-testing-reservations-strategy.md
        vi.mock('../services/reservationService', () => ({
          getReservationsFromStorage: vi.fn(),
          cancelReservationInStorage: vi.fn(() => Promise.resolve(true)), // Mock implementation inside
        }));
        ```

5.  **Achieving Full Branch Coverage:**
    *   **Challenge:** Initial tests for components like `ReservationConfirmation.jsx` missed some branches, particularly around conditional formatting of time (AM/PM, 12 AM/PM edge cases) and handling of empty or invalid date/time inputs.
    *   **Solution:** Added specific test cases to target these un-covered branches. This involved testing with various time inputs (e.g., "00:00", "12:00", "13:00") and ensuring that conditional logic for formatting and default fallbacks was exercised.

6.  **Documentation Organization (Strategy vs. Logs):**
    *   **Challenge:** The main unit testing strategy document (`unit-testing-reservations-strategy.md`) became cluttered with detailed daily progress logs and historical setup instructions.
    *   **Solution:** Refactored the strategy document to focus on high-level strategy, best practices, and evergreen testing plans. Detailed progress and session-specific notes are now moved to dated log files in a dedicated `/docs/logs/` directory. This improves the readability and utility of the core strategy document.

## Future Considerations

*   Continue to apply these learnings to other features.
*   Regularly review and update reflection documents as new challenges and solutions arise.
