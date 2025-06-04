---
Title: Unit Testing Strategy for Little Lemon Reservation Flow (Vite + Vitest)
Author: Chien Escalera Duong
Date Created: 2025-06-02
Time Created: 11:44:23 PDT
Last Updated: 2025-06-03 16:30:00 PDT
Version: 1.8
---

# Unit Testing Strategy for Little Lemon Reservation Flow (Vite + Vitest)

## 1. Introduction & Philosophy

This document outlines the strategy for unit testing the reservation user flow of the Little Lemon application, starting with the `ReservationForm.jsx` component. Our primary goal is to ensure the reliability, maintainability, and correctness of this critical piece of functionality using a testing stack that is native to our Vite project.

We will adhere to the testing philosophy championed by **React Testing Library (RTL)**:
- Tests should resemble how users interact with the application.
- Focus on testing component behavior and output, not internal implementation details.
- Write tests that are resilient to refactoring and provide confidence in the application's stability.

## 2. Testing Stack & Setup (Vite Native: Vitest)

Our chosen testing stack for this Vite-based project is:
- **Vitest:** A blazing fast unit-test framework powered by Vite. It offers a Jest-compatible API, seamless integration with Vite's config, and out-of-the-box support for TypeScript/JSX.
- **React Testing Library (RTL):** Provides light-weight utility functions for testing React components in a user-centric way.
- **`@testing-library/jest-dom`:** Custom matchers for asserting on DOM nodes (works with Vitest due to its Jest compatibility).
- **`@testing-library/user-event`:** Simulates user interactions more realistically.
- **`jsdom`:** Provides a simulated DOM environment for tests that need it.
- **`@vitest/ui` (Optional but Recommended):** An interactive UI for Vitest, making it easier to view test results and debug.

### Setup Steps:

1.  **Installation:**
    Open your terminal in the project root (`/Users/admin/CascadeProjects/little-lemon`) and run:
    ```bash
    npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
    ```
    *(Note: The previous installation of Jest-related packages can be removed later if desired to keep dependencies clean. For now, we'll focus on installing Vitest.)*

2.  **Vitest Configuration (in `vite.config.js`):**
    Vitest is configured directly within your existing `vite.config.js` (or `vite.config.ts`). If you don't have one, create `/Users/admin/CascadeProjects/little-lemon/vite.config.js`.
    Add a `test` property to your Vite configuration object:

    ```javascript
    // /Users/admin/CascadeProjects/little-lemon/vite.config.js
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react'; // Your existing React plugin

    export default defineConfig({
      plugins: [react()], // Your existing plugins
      test: {
        globals: true, // Allows use of describe, test, expect, etc. without importing
        environment: 'jsdom', // Simulate DOM environment
        setupFiles: './src/setupTests.js', // Path to your setup file (see step 3)
        // Optional: enable CSS processing in tests if needed
        // css: true, 
        // Optional: configure coverage
        coverage: {
          provider: 'v8', // or 'istanbul'
          reporter: ['text', 'json', 'html'], // HTML report will be in coverage/ directory
        },
      },
    });
    ```
    *Make sure to merge this with your existing `vite.config.js` content if it already exists. The key is adding the `test` object.* 

3.  **RTL Setup File (`src/setupTests.js`):**
    This file is used to import `@testing-library/jest-dom` for extended assertions. Create `/Users/admin/CascadeProjects/little-lemon/src/setupTests.js`:
    ```javascript
    // src/setupTests.js
    import '@testing-library/jest-dom';
    ```

4.  **Add Test Scripts to `package.json`:**
    Modify your `/Users/admin/CascadeProjects/little-lemon/package.json` scripts section:
    ```json
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "lint": "eslint .",
      "preview": "vite preview",
      "format": "prettier --write .",
      "test": "vitest", // Run Vitest tests
      "test:ui": "vitest --ui" // Run Vitest with UI
    },
    ```
    You can then run tests using `npm test` or `npm run test:ui`.

    *Handling Static Assets (Images, SVGs, etc.) and CSS:* 
    Vite's build process inherently understands how to handle static assets and CSS. Vitest, by integrating with Vite, can often leverage this. For CSS Modules (`.module.css`), they should work out of the box. For global CSS or specific asset mocking needs not covered by default, Vitest's `vi.mock` can be used, similar to Jest's mocking, or you can configure asset handling in `vite.config.js` if necessary.

## 3. Directory Structure for Tests

For clarity and ease of maintenance, we will **co-locate test files with the source files they are testing**. This means a test file for a component will live in the same directory as the component itself.

**Why this structure?**
- **Easy to Find:** When you're working on `ReservationForm.jsx`, its tests (`ReservationForm.test.jsx`) are right there.
- **Clear Ownership:** It's immediately obvious which tests belong to which component.
- **Component-Focused:** Encourages thinking about tests as an integral part of the component, not an afterthought.
- **Simpler Imports:** Test files can easily import the component they are testing using relative paths (e.g., `import ReservationForm from './ReservationForm';`).

**Example Structure for `ReservationForm.jsx`:**

Here's how the directory structure will look for the `ReservationForm` component and its test file within our Little Lemon project:

```plaintext
/Users/admin/CascadeProjects/little-lemon/
├── src/
│   ├── components/
│   │   ├── features/
│   │   │   ├── Reservation/
│   │   │   │   ├── DateTimeSelector.jsx
│   │   │   │   ├── ReservationConfirmation.jsx
│   │   │   │   ├── ReservationForm.jsx         <-- Your component
│   │   │   │   ├── ReservationForm.test.jsx    <-- Your NEW test file for ReservationForm
│   │   │   │   └── ... (other files related to Reservation feature)
│   │   │   └── ... (other features like Menu, About)
│   │   ├── common/
│   │   │   └── Button.jsx
│   │   │   └── Button.test.jsx (example for a common component)
│   │   └── layout/
│   │       └── Header.jsx
│   ├── hooks/
│   │   └── useReservation.js
│   │   └── useReservation.test.js      <-- Test file for the hook
│   ├── pages/
│   │   └── ReservationPage/
│   │       └── ReservationPage.jsx
│   │       └── ReservationPage.test.jsx  <-- Test file for the page
│   ├── services/
│   │   └── reservationService.js
│   │   └── reservationService.test.js  <-- Test file for the service
│   ├── App.jsx
│   ├── main.jsx
│   └── setupTests.js                 <-- Vitest setup file (created above)
├── vite.config.js                    <-- Vite configuration including Vitest setup
├── package.json
└── ... (other project files)
```

## 4. Advanced Topics & Lessons Learned

### 4.1. Timezone Handling in Date Formatting

-   **Issue:** JavaScript's `new Date('YYYY-MM-DD')` parsing treats the date string as UTC, which can lead to off-by-one day errors when displaying dates in the local timezone, especially if the local timezone is behind UTC.
-   **Solution:** When formatting dates for display (e.g., in `ReservationConfirmation.jsx` and `ReservationList.jsx`), ensure date strings are parsed into their constituent parts (year, month, day) and then reconstructed using `new Date(year, monthIndex, day)` which correctly interprets them in the local timezone. Alternatively, use a robust date-fns/luxon library if more complex timezone management is needed. For simple display formatting, `toLocaleDateString()` with appropriate options was sufficient after correct local Date object creation.

### 4.2. Vitest: Effective Mocking with `vi.mock()`

-   **Hoisting Issues with `vi.mock`:** When mocking modules, especially services that are imported and used within components, Vitest's hoisting behavior can sometimes lead to `undefined` mock functions if not handled correctly.
-   **Solution (`ReservationList.test.jsx`):**
    -   Define mock functions (`vi.fn()`) *inside* the `vi.mock` factory function.
    -   Ensure that the actual module import (e.g., `import { getReservationsFromStorage, cancelReservation } from '...'`) happens *after* the `vi.mock` call.
    -   Use the imported functions directly in tests, as they will be the mocked versions.

    ```javascript
    // Example from ReservationList.test.jsx
    import { getReservationsFromStorage, cancelReservation } from '../../../services/reservationService'; // Actual import

    vi.mock('../../../services/reservationService', () => ({ // Mock definition
      getReservationsFromStorage: vi.fn(),
      cancelReservation: vi.fn(),
    }));

    // In tests:
    // getReservationsFromStorage.mockReturnValue(...);
    // expect(cancelReservation).toHaveBeenCalledWith(...);
    ```
    This pattern ensures that the mocks are properly initialized and hoisted before the component code (which imports the service) is evaluated.

### 4.3. Testing Error States and Conditional Rendering

-   **Challenge:** When testing error states (e.g., a service call fails), the UI might change significantly. An error message might be displayed, and other elements (like a list of items) might be removed or hidden.
-   **Solution (`ReservationList.test.jsx` - Cancellation Error Tests):**
    -   Verify that the expected error message *is* present.
    -   Crucially, verify that elements that *should no longer be visible* are indeed absent. Use `screen.queryByText(...)` (which returns `null` if not found) combined with `.not.toBeInTheDocument()` for these assertions.
    -   Example: After a failed cancellation, the reservation item itself ("Cancel Candidate") should not be displayed if an error message takes over that part of the UI.

### 5.4. Revisiting Loading State Tests

-   **Context (`ReservationList.jsx`):** The initial test for the loading state in `ReservationList` was removed.
-   **Rationale:** The `useEffect` hook in `ReservationList` fetches and processes reservations synchronously (e.g., `getReservationsFromStorage().sort().filter()`). If `getReservationsFromStorage` is mocked to return an unresolved Promise (to simulate loading), the subsequent synchronous operations (`.sort()`) on this Promise object will throw an error. This error is caught, and the component immediately transitions to an error state, bypassing any reliably observable loading state.
-   **Recommendation:** For components with purely synchronous data fetching and processing within `useEffect` (without intermediate `await` points before `setLoading(false)`), testing a distinct "loading" message can be fragile or misleading. Focus on testing the states that occur *after* the synchronous processing: empty state, data-filled state, and error state. If true asynchronous operations are involved before the final data state is set, then a loading state test becomes more viable.

│   │   └── ReservationPage/
│   │       └── ReservationPage.jsx
│   │       └── ReservationPage.test.jsx  <-- Test file for the page
│   ├── services/
│   │   └── reservationService.js
│   │   └── reservationService.test.js  <-- Test file for the service
│   ├── App.jsx
│   ├── main.jsx
│   └── setupTests.js                 <-- Vitest setup file (created above)
├── vite.config.js                    <-- Vite configuration including Vitest setup
├── package.json
└── ... (other project files)
```

When you start testing other components like `DateTimeSelector.jsx`, you'll simply add `DateTimeSelector.test.jsx` next to it in the same `Reservation/` directory.

## 5. Mocking Strategy

Mocking is essential for isolating the unit under test from its dependencies. Vitest provides a Jest-compatible API for mocking:
- **`vi.mock('./path/to/module')`:** Used to automatically mock modules. For example, we'll mock `reservationService.js` when testing components that use it. It's hoisted, so place it at the top of your test file.
- **`vi.fn()`:** Creates a mock function, allowing us to track calls, inputs, and return values.
- **`vi.spyOn(object, 'methodName')`:** Similar to `vi.fn()` but used to spy on or mock a specific method of an existing object/module, allowing restoration of the original implementation if needed using `mockRestore()`.
- **`localStorage`:** Since `reservationService.js` uses `localStorage`, we'll need to mock it. This can be done globally in `setupTests.js` or per test suite using `vi.stubGlobal` or by directly mocking `localStorage` methods.

Example of mocking a module:
```javascript
// In your test file (e.g., ReservationPage.test.jsx)
import { vi } from 'vitest';

// Mock the reservationService
vi.mock('../services/reservationService', () => ({
  createReservation: vi.fn(),
  getAvailableTimeSlots: vi.fn(() => ['17:00', '18:00']), // Example mock implementation
}));
```

### 5.3. Testing Custom React Hooks (e.g., `useReservation.js`)

Custom React hooks encapsulate logic that can be shared across components. Testing them thoroughly is crucial.

-   **Tooling:** Use the `renderHook` function from `@testing-library/react`.
-   **Core Concepts:**
    -   `renderHook(() => useCustomHook(props))` initializes your hook.
    -   The `result.current` property provides access to the hook's return values (state, functions, etc.).
    -   Use `act()` from `@testing-library/react` to wrap any code that causes state updates within the hook.
    -   Use `waitFor()` for asynchronous operations to wait for expectations to pass.

**Example (Conceptual, based on `useReservation.test.js`):**

```javascript
// src/hooks/useReservation.test.js
import { renderHook, act, waitFor } from '@testing-library/react';
import useReservation from './useReservation'; // Your custom hook

// Mock global API functions (see section 5.4)
const mockFetchAPI = vi.fn();
const mockSubmitAPI = vi.fn();

beforeEach(() => {
  vi.spyOn(window, 'fetchAPI').mockImplementation(mockFetchAPI);
  vi.spyOn(window, 'submitAPI').mockImplementation(mockSubmitAPI);
  mockFetchAPI.mockResolvedValue(['17:00', '18:00']); // Default success
  mockSubmitAPI.mockResolvedValue(true); // Default success
});

afterEach(() => {
  vi.restoreAllMocks(); // Clean up spies
});

describe('useReservation Hook', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useReservation());
    expect(result.current.currentStep).toBe(1);
    expect(result.current.reservationData.date).toBe('');
    // ... other initial state checks
  });

  it('should fetch available times on date change', async () => {
    const { result } = renderHook(() => useReservation());
    mockFetchAPI.mockResolvedValueOnce(['19:00', '20:00']);

    act(() => {
      result.current.handleDateTimeChange('date', '2025-12-25');
    });

    expect(result.current.isLoadingTimes).toBe(true);
    await waitFor(() => {
      expect(mockFetchAPI).toHaveBeenCalledWith(new Date('2025-12-25'));
      expect(result.current.availableTimes).toEqual(['19:00', '20:00']);
      expect(result.current.isLoadingTimes).toBe(false);
    });
  });

  it('should handle reservation submission', async () => {
    const { result } = renderHook(() => useReservation());
    // ... set up reservationData and currentStep via act(...)
    act(() => {
      result.current.handleDateTimeChange('date', '2025-12-25');
      result.current.handleDateTimeChange('time', '19:00');
      // ... other data setup ...
      result.current.handleNextStep(); // to step 2
      result.current.handleNextStep(); // to step 3
    });

    let submissionSuccessful;
    await act(async () => {
      submissionSuccessful = await result.current.handleConfirmReservation();
    });

    expect(submissionSuccessful).toBe(true);
    expect(mockSubmitAPI).toHaveBeenCalledWith(result.current.reservationData);
    expect(result.current.currentStep).toBe(4);
    expect(result.current.confirmedReservation).not.toBeNull();
  });
});
```

### 5.4. Mocking Global API Functions (e.g., `window.fetchAPI`)

Sometimes, APIs are not imported as modules but are available globally (e.g., attached to the `window` object), as is the case with `fetchAPI` and `submitAPI` from the Coursera-provided script (or our `mockApi.js` workaround).

-   **Method:** Use `vi.spyOn(window, 'functionName')` to mock these global functions.
    -   `vi.spyOn(window, 'fetchAPI').mockImplementation(mockFetchAPIFunction)`
    -   `vi.spyOn(window, 'submitAPI').mockImplementation(mockSubmitAPIFunction)`
-   **Setup:** This is typically done in a `beforeEach` block in your test file to ensure a fresh mock for each test and cleaned up in `afterEach` using `vi.restoreAllMocks()` or by individually calling `mockRestore()` on each spy.

**Example (from `useReservation.test.js` setup):**

```javascript
// In your test file (e.g., src/hooks/useReservation.test.js)

const mockFetchAPI = vi.fn();
const mockSubmitAPI = vi.fn();

beforeEach(() => {
  // Spy on the global functions and provide mock implementations
  vi.spyOn(window, 'fetchAPI').mockImplementation(mockFetchAPI);
  vi.spyOn(window, 'submitAPI').mockImplementation(mockSubmitAPI);

  // Set default behaviors for the mocks for most test cases
  mockFetchAPI.mockResolvedValue(['17:00', '17:30', '18:00']); // Default successful fetch
  mockSubmitAPI.mockResolvedValue(true); // Default successful submission
});

afterEach(() => {
  // Restore original implementations and clear spies after each test
  vi.restoreAllMocks();
});

// ... your test cases ...
```

This approach allows you to control the behavior of these global APIs (e.g., simulate successful calls, failures, or specific return data) for different test scenarios.

## 6. Detailed Testing Plans

### 6.1. `ReservationForm.jsx` (Initial Focus)

**Focus:** Rendering, controlled inputs, validation logic, and callback invocation. This will be our first component to test.

- **Rendering:**
    - Renders all input fields (name, email, phone, occasion, special requests) and their labels.
    - Displays initial values from `formData` prop if provided.
- **Input Handling & State Updates:**
    - Typing into the name field updates its value.
    - Typing into the email field updates its value.
    - Typing into the phone field updates its value.
    - Selecting an occasion updates its value.
    - Typing into special requests updates its value.
    - `onFormChange` callback is called with the correct, updated `formData` whenever an input changes.
- **Validation Logic (as triggered by form interactions, e.g., on blur or via a submit attempt if applicable to the component's usage in `ReservationPage`):
    - **Name:** Required. Shows an error message if empty/whitespace when validation is triggered.
    - **Email:** Required and must be a valid email format. Shows an error message if empty or invalid when validation is triggered.
    - **Phone:** Required and must be a plausible phone number format. Shows an error message if empty or invalid when validation is triggered.
    - Valid inputs do not show error messages.
    - Error messages are cleared when the user corrects the input and validation is re-triggered or input focus changes as per component logic.
- **Accessibility:**
    - Inputs are correctly associated with their labels (e.g., using `htmlFor` and `id`).

*(The following sections outline tests for other parts of the reservation flow, which can be implemented after `ReservationForm.jsx` is successfully tested. For now, our practical focus is solely on `ReservationForm.jsx`.)*

### 6.2. `reservationService.js`

**Focus:** Test data manipulation, `localStorage` interaction, and business logic in isolation. Mock `localStorage`.

- **`getAvailableTimeSlots(date)`:**
    - Given a date with no existing reservations, returns all base operating slots.
    - Given a date with some booked slots, returns only the truly available slots.
    - Given a date with all slots booked, returns an empty array.
- **`createReservation(reservationData)`:**
    - Successfully creates a reservation, saves it to `localStorage`, and returns the reservation with an ID.
    - Throws an error if required `reservationData` fields are missing.
    - Throws an error if the selected time slot is not available (mock `isTimeSlotAvailable` or internal `getAvailableTimeSlots` logic).
- **`getReservationsFromStorage()` / `saveReservationsToStorage()`:**
    - Correctly retrieves from and saves to `localStorage`.
    - Handles cases where `localStorage` is empty or data is malformed (though `JSON.parse` errors are harder to simulate without direct `localStorage` method mocks).
- **`generateReservationId()`:**
    - Returns a non-empty string.
- **`getReservationById(id)`:**
    - Returns the correct reservation if found.
    - Returns `null` if not found.
- **`cancelReservation(id)` / `updateReservation(id, data)`:**
    - Correctly modifies the reservation status/data in `localStorage`.
    - Returns appropriate success/failure indicators or updated objects.

### 6.3. `DateTimeSelector.jsx`

**Focus:** Rendering, user interactions, callback invocations, and interaction with mocked `getAvailableTimeSlots`.

- **Rendering:**
    - Renders date input, time select, and party size select.
    - Displays `selectedDate`, `selectedTime`, `partySize` props correctly.
    - Date input has correct `min` and `max` attributes.
    - Time select is disabled if no date is selected or no times are available.
- **User Interactions & Callbacks:**
    - Selecting a date calls `onDateChange` with the new date.
    - Selecting a time calls `onTimeChange` with the new time.
    - Selecting a party size calls `onPartySizeChange` with the new size.
- **Available Times Logic (mock `getAvailableTimeSlots`):**
    - When a date is selected, `getAvailableTimeSlots` is called.
    - Time select options are populated based on the mocked return of `getAvailableTimeSlots`.
    - If `selectedTime` prop is not in the new available slots, `onTimeChange('')` is called.
    - Displays "No available times" message if applicable.
- **Error Handling:**
    - Displays an error message if a past date is selected.

*(This section is now covered in 5.1 as the initial focus. The original content for ReservationForm can be referred to if expanding tests beyond the initial scope later)*

**Focus:** Rendering, controlled inputs, validation logic, and callback invocation.

- **Rendering:**
    - Renders all input fields (name, email, phone, occasion, special requests) and their labels.
    - Displays initial values from `formData` prop.
- **Input Handling:**
    - Typing into any field calls `onFormChange` with the updated `formData`.
    - Error messages for a field are cleared when the user types into it.
- **Validation (`validateForm` implicitly tested via `handleSubmit` or directly if exposed):**
    - **Name:** Required, error if empty/whitespace.
    - **Email:** Required, valid format, error if empty/invalid.
    - **Phone:** Required, valid format (simple check), error if empty/invalid.
    - Displays appropriate error messages next to fields.
- **Submission (mock `onSubmit` or test through parent):**
    - If `validateForm` (triggered by an attempt to submit, though this form doesn't have its own submit button) returns `false`, errors are displayed.

### 5.4. `ReservationConfirmation.jsx`

**Focus:** Correct display of `reservationData` and invocation of `onConfirm`/`onModify` callbacks.

- **Rendering:**
    - Displays all details from `reservationData` prop: date, time, party size, name, email, phone, occasion, special requests.
    - Correctly formats date and time for display.
    - Conditionally displays occasion and special requests.
- **User Interactions & Callbacks:**
    - Clicking "Confirm Reservation" button calls `onConfirm` prop.
    - Clicking "Modify" button calls `onModify` prop.

### 6.5. `useReservation.js` (Custom Hook)

**Focus:** Test the hook's logic in isolation using `@testing-library/react-hooks` (or `@testing-library/react`'s `renderHook` for newer versions). Mock `reservationService.js` functions.

- **Initial State:**
    - `reservationData` is initialized correctly.
    - `currentStep` is 1.
    - `confirmedReservation` is `null`.
    - `errorMessage` is empty.
- **`handleDateTimeChange(field, value)` / `handleFormChange(newFormData)`:**
    - Correctly update the `reservationData` state.
- **`useEffect` for `availableTimes` (mock `getAvailableTimeSlots`):**
    - When `reservationData.date` changes, `getAvailableTimeSlots` is called.
    - `availableTimes` state is updated.
    - If `reservationData.time` is no longer available, it's reset.
- **`canProceedToNextStep()`:**
    - Step 1: Returns `true` if date, time, party size are filled; `false` otherwise.
    - Step 2: Returns `true` if name, email, phone are filled; `false` otherwise.
    - Other steps: Returns `true`.
- **`handleNextStep()`:**
    - If `canProceedToNextStep` is true, increments `currentStep` and clears `errorMessage`.
    - If `canProceedToNextStep` is false, sets `errorMessage` and `currentStep` remains unchanged.
- **`handlePreviousStep()`:**
    - Decrements `currentStep`.
    - Clears `errorMessage`.
- **`handleConfirmReservation()` (mock `createReservation`):**
    - Calls `createReservation` with current `reservationData`.
    - On success: sets `confirmedReservation`, sets `currentStep` to 4, clears `errorMessage`.
    - On failure: sets `errorMessage`, `confirmedReservation` remains `null`, `currentStep` doesn't change to 4.
- **`resetReservation()`:**
    - Resets `reservationData`, `currentStep`, `confirmedReservation`, and `errorMessage` to initial values.

### 6.6. `ReservationPage.jsx`

**Focus:** Integration of child components and the `useReservation` hook. Test step rendering and navigation. Mock `useReservation` to control its state/behavior for more isolated tests of `ReservationPage`, or test it more integratedly.

- **Rendering:**
    - Renders the correct component (`DateTimeSelector`, `ReservationForm`, `ReservationConfirmation`, success message) based on `currentStep` from `useReservation`.
    - Displays progress indicator correctly for steps 1-3.
    - Displays `errorMessage` from `useReservation`.
- **Navigation:**
    - "Next" button:
        - Calls `handleNextStep` from `useReservation`.
        - Is disabled if `canProceedToNextStep` from `useReservation` returns `false`.
    - "Back" button: Calls `handlePreviousStep` from `useReservation`.
    - "Cancel" button (Step 1): Navigates to home.
    - "Confirm Reservation" button (Step 3): Calls `handleConfirmReservation` from `useReservation`.
    - "Return to Home" button (Step 4 - Success): Navigates to home.
- **Scroll Behavior:**
    - `window.scrollTo(0,0)` is called on step transitions (harder to test in JSDOM, might need `jest.spyOn(window, 'scrollTo')`).

## 7. ESLint Configuration for Vitest Globals

To ensure ESLint recognizes Vitest's global variables (`describe`, `test`, `expect`, `vi`, `beforeEach`, etc.) and doesn't report them as undefined, we need to configure the ESLint plugin for Vitest.

1.  **Install `eslint-plugin-vitest`:**
    ```bash
    npm install --save-dev eslint-plugin-vitest
    ```

2.  **Configure `.eslintrc.json` (or your ESLint config file):**
    Add `vitest` to the `plugins` array and enable the recommended globals or specific rules.

    ```json
    {
      "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime", // If using new JSX transform
        "plugin:react-hooks/recommended"
      ],
      "plugins": [
        "react",
        "vitest" // Add vitest plugin
      ],
      "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "ecmaFeatures": {
          "jsx": true
        }
      },
      "env": {
        "browser": true,
        "es2021": true,
        "node": true // Keep if you have Node.js specific code
      },
      "settings": {
        "react": {
          "version": "detect"
        }
      },
      "rules": {
        // Your existing rules
      },
      "overrides": [
        {
          "files": [
            "**/*.test.js",
            "**/*.test.jsx",
            "**/*.spec.js",
            "**/*.spec.jsx"
          ],
          "env": {
            "vitest/globals": true // Enable Vitest globals for test files
          }
          // Or, more explicitly:
          // "extends": ["plugin:vitest/recommended"]
        }
      ]
    }
    ```
    This setup ensures that ESLint is aware of Vitest's environment specifically within your test files.

## 8. Test Types & Focus

- **Unit Tests:** The majority of tests will be unit tests, focusing on individual components, hooks, and service functions in isolation. This ensures that each part works correctly on its own.
- **Integration Tests:** We will have a few integration tests, primarily for `ReservationPage.jsx`, to ensure that the different parts of the reservation flow (steps, hook interactions) work together as expected. These will be less about deep component logic (covered by unit tests) and more about the orchestration.
