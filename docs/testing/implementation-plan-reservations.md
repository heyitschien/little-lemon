---
Title: Implementation Plan - Unit & Integration Testing for Reservation Flow
Author: Chien Escalera Duong
Date Created: 2025-06-02
Time Created: 12:09:00 PDT 
Last Updated: 2025-06-02 12:09:00 PDT 
Version: 1.0
---

# Implementation Plan: Unit & Integration Testing for Reservation Flow

This document outlines the phased approach and specific steps for implementing unit and integration tests for the Little Lemon reservation flow, using Vitest and React Testing Library.

## Guiding Principles

- **Start Simple:** Begin with basic rendering tests and build complexity.
- **Isolate Units:** Mock dependencies effectively.
- **Test Behavior:** Focus on what the user experiences and how the component behaves.
- **Iterate:** Write a test, make it pass, refactor, then write the next test.
- **Use Vitest UI:** Leverage `npm run test:ui` for an interactive testing experience.

## Phase 1: Environment Setup & Verification (1-2 hours)

**Goal:** Ensure the Vitest testing environment is correctly configured and operational.

1.  **Configure Vitest in `vite.config.js`:**
    *   **Action:** Open `/Users/admin/CascadeProjects/little-lemon/vite.config.js`.
    *   **Details:** Add the `test` configuration block as specified in the `unit-testing-reservations-strategy.md` (Version 1.2, Section 2). Ensure `globals: true`, `environment: 'jsdom'`, and `setupFiles: './src/setupTests.js'` are included.
    *   **Verification:** The Vite development server (`npm run dev`) should still work without issues.

2.  **Create `src/setupTests.js`:**
    *   **Action:** Create the file `/Users/admin/CascadeProjects/little-lemon/src/setupTests.js`.
    *   **Details:** Add `import '@testing-library/jest-dom';` to this file.
    *   **Verification:** This file will be picked up by Vitest.

3.  **Update `package.json` Test Scripts:**
    *   **Action:** Open `/Users/admin/CascadeProjects/little-lemon/package.json`.
    *   **Details:** Ensure the `scripts` section includes:
        ```json
        "test": "vitest",
        "test:ui": "vitest --ui"
        ```
    *   **Verification:** You can run `npm test -- --help` to see Vitest options.

4.  **Initial Test Run (Smoke Test):**
    *   **Action:** Create a temporary dummy test file, e.g., `src/App.test.jsx`.
        ```javascript
        // src/App.test.jsx (temporary)
        import { describe, test, expect } from 'vitest';

        describe('Simple Math Test', () => {
          test('1 + 1 should equal 2', () => {
            expect(1 + 1).toBe(2);
          });
        });
        ```
    *   **Run:** `npm test` and `npm run test:ui`.
    *   **Verification:** The test should pass. This confirms Vitest is running. Delete the dummy file afterward.

## Phase 2: Core Component - `ReservationForm.jsx` Unit Testing (Est. 6-10 hours)

**Goal:** Achieve comprehensive unit test coverage for `ReservationForm.jsx`, ensuring all functionalities, validations, and user interactions are tested in isolation.

1.  **Create Test File:**
    *   **Action:** Create `/Users/admin/CascadeProjects/little-lemon/src/components/features/Reservation/ReservationForm.test.jsx`.

2.  **Basic Rendering Test:**
    *   **Test:** Ensure the form and all its essential input fields (Name, Email, Phone, Occasion, Special Requests), labels, and the submit button render correctly.
    *   **RTL Queries:** Use `screen.getByLabelText`, `screen.getByRole('button', { name: /submit|book/i })`.

3.  **Initial State & Default Values:**
    *   **Test:** If applicable, check that fields are initialized with correct default values passed via props or set internally.

4.  **Controlled Input Tests (for each relevant field):**
    *   **Test:** Simulate user typing into each input field (`userEvent.type`).
    *   **Assert:** Verify that the `onFormChange` prop is called with the correctly updated form data.
    *   **Assert:** Verify that the input field's value reflects the change.

5.  **Validation Logic Tests (for each validated field - Name, Email, Phone):**
    *   **Scenario 1: Valid Input:**
        *   **Act:** Enter valid data. Trigger validation (e.g., on blur, or before submit).
        *   **Assert:** No error message is shown for that field.
    *   **Scenario 2: Invalid Input (Required, Format):**
        *   **Act:** Enter invalid data (empty for required, incorrect format for email/phone). Trigger validation.
        *   **Assert:** The specific error message for that field is displayed (e.g., `screen.getByText('Name is required')`).
    *   **Scenario 3: Clearing Errors:**
        *   **Act:** Enter invalid data, see error. Then, enter valid data.
        *   **Assert:** The error message for that field is cleared.

6.  **Form Submission Tests:**
    *   **Scenario 1: Valid Form:**
        *   **Arrange:** Fill the form with valid data. Mock the `onSubmit` prop (or equivalent logic if `onFormChange` handles it).
        *   **Act:** Simulate clicking the submit button.
        *   **Assert:** The `onSubmit` prop (or equivalent) is called.
        *   **Assert:** No validation errors are displayed.
    *   **Scenario 2: Invalid Form:**
        *   **Arrange:** Fill the form with some invalid data. Mock `onSubmit`.
        *   **Act:** Simulate clicking the submit button.
        *   **Assert:** The `onSubmit` prop is NOT called.
        *   **Assert:** Relevant validation error messages are displayed.

7.  **Accessibility Tests (Basic):**
    *   **Test:** Ensure all input fields are correctly associated with their labels (already implicitly tested by `getByLabelText`).
    *   **Consider:** If there are any ARIA attributes, test their presence and values if critical.

## Phase 3: Service Layer - `reservationService.js` Unit Testing (Est. 3-5 hours)

**Goal:** Test the business logic within `reservationService.js`, especially functions related to fetching/submitting reservations and `localStorage` interactions.

1.  **Create Test File:**
    *   **Action:** Create `/Users/admin/CascadeProjects/little-lemon/src/services/reservationService.test.js`.

2.  **Mock `localStorage`:**
    *   **Action:** Use `vi.stubGlobal` or create a manual mock for `localStorage` (getItem, setItem, removeItem, clear) at the top of your test file or in `setupTests.js` if used globally.

3.  **Test `getAvailableTimeSlots(date)` (Example Function):**
    *   **Test:** Given a date, verify it returns the expected array of time slots.
    *   **Consider:** Edge cases (e.g., dates with no slots, invalid date formats if handled by this function).
    *   **Assert:** Based on its current implementation (if it uses `localStorage` or a predefined list).

4.  **Test `createReservation(data)` (Example Function):**
    *   **Arrange:** Mock any API calls if this function makes them (e.g., using `vi.fn()` for a mocked `fetch`). Provide sample reservation data.
    *   **Act:** Call `createReservation(data)`.
    *   **Assert:** If it returns a promise, check for successful resolution.
    *   **Assert:** Verify `localStorage` was updated correctly (if applicable).
    *   **Assert:** Verify the mocked API was called with correct parameters.

## Phase 4: Custom Hook - `useReservation.js` Unit Testing (Est. 3-5 hours)

**Goal:** Test the logic, state management, and side effects encapsulated within the `useReservation` hook.

1.  **Create Test File:**
    *   **Action:** Create `/Users/admin/CascadeProjects/little-lemon/src/hooks/useReservation.test.js`.

2.  **Use `renderHook` from `@testing-library/react`:**
    *   **Action:** Import `renderHook` and `act` (for updates that cause state changes).

3.  **Test Initial State:**
    *   **Test:** When the hook is first rendered, assert that its returned state variables are initialized correctly.

4.  **Test State Updates:**
    *   **Arrange:** Render the hook.
    *   **Act:** Call functions returned by the hook that are supposed to update its internal state (e.g., `updateDate`, `submitReservation`). Use `act(() => { ... })`.
    *   **Assert:** Check that the hook's returned state variables reflect the changes.

5.  **Test Side Effects:**
    *   **Arrange:** Mock any service functions (e.g., `reservationService.getAvailableTimeSlots`) that the hook calls.
    *   **Act:** Trigger actions in the hook that would cause these service functions to be called.
    *   **Assert:** Verify that the mocked service functions were called with the correct arguments.

## Phase 5: Integration Testing - `ReservationPage.jsx` (Est. 4-6 hours)

**Goal:** Ensure that `ReservationForm`, `useReservation` hook (if used by the page), and `reservationService` (via the hook or directly) work together correctly on the `ReservationPage`.

1.  **Create Test File:**
    *   **Action:** Create `/Users/admin/CascadeProjects/little-lemon/src/pages/ReservationPage/ReservationPage.test.jsx`.

2.  **Mock `reservationService`:**
    *   **Action:** Use `vi.mock` at the top of the test file to provide controlled responses for service calls (e.g., `getAvailableTimeSlots`, `createReservation`).

3.  **Test Full User Flow (Happy Path):**
    *   **Arrange:** Render `ReservationPage`. Mock service functions to return successful responses.
    *   **Act:**
        *   Simulate user selecting a date.
        *   Simulate user filling out the `ReservationForm` with valid data.
        *   Simulate user submitting the form.
    *   **Assert:**
        *   Verify that available time slots are displayed/updated (based on mocked service).
        *   Verify that `createReservation` service function was called with correct data.
        *   Verify that a confirmation message or navigation to a confirmation page occurs (mock navigation if needed).

4.  **Test User Flow (With Validation Errors):**
    *   **Arrange:** Render `ReservationPage`.
    *   **Act:** Simulate user attempting to submit the form with invalid data.
    *   **Assert:** Verify that validation errors appear on the form.
    *   **Assert:** Verify that the submission service function was NOT called.

## Phase 6: Testing Other Components (As Needed)

**Goal:** Test other components involved in the reservation flow (e.g., `DateTimeSelector.jsx`, `ReservationConfirmation.jsx`) individually.

*   **Method:** Follow the same unit testing principles as for `ReservationForm.jsx`.
*   **Prioritization:** Test components based on their complexity and criticality to the user flow.

## Continuous Activities

- **Review and Refactor Tests:** Keep tests clean, readable, and maintainable.
- **Monitor Code Coverage:** Aim for a healthy coverage percentage, but prioritize testing critical paths and complex logic over chasing 100%. (Configure coverage in `vite.config.js` for Vitest).
- **Update Tests with Code Changes:** When application code changes, update corresponding tests.
