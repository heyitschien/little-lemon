---
Title: API Transition and Testing Integration Strategy
Author: Chien Escalera Duong
Date Created: 2025-06-02
Time Created: 19:46:36 PDT
Last Updated: 2025-06-03 16:28:13 PDT
Version: 1.1
---

# API Transition and Testing Integration Strategy

## Current State Analysis

1. **Existing Features**:
   - Mobile-optimized reservation system using localStorage
   - Enhanced date picker for iOS Chrome
   - Implemented time slot availability system
   - Unit tests for DateTimeSelector.jsx
   - Sticky header navigation for menu
   - Enhanced About page responsiveness

2. **Branch Structure**:
   - main
   - staging
   - feature/* branches

## Recommended Transition Strategy

### Phase 1: Pre-API Integration Testing (Completed on `feature/unit-testing-reservation-flow`)

1. **Complete Unit Tests**:
   - Finish DateTimeSelector.test.jsx
   - Complete ReservationConfirmation.jsx tests
   - Complete ReservationList.jsx tests
   - Update unit-testing-reservations-strategy.md

2. **Integration Test Setup**:
   - Create API mock functions matching fetchAPI and submitAPI signatures
   - Set up integration test environment
   - Document API integration test cases

### Phase 2: API Integration (Branch: `feature/api-integration`)

1. **Create Feature Branch**:
   ```bash
   git checkout -b feature/api-integration 
   ```
   *(This step has been completed.)*

## Detailed API Implementation Plan (Post-Audit)

This section outlines the revised plan based on a detailed audit of the codebase, specifically concerning the integration of the external bookings API (`fetchAPI` and `submitAPI`).

### Audit Findings:

*   **`initializeTimes` and `updateTimes` Functions:** The course instructions refer to `initializeTimes` and `updateTimes` functions that were expected to be previously created. A codebase audit revealed that functions with these exact names are not present.
*   **`useReservation` Custom Hook:** The core logic for managing reservation state, including selected date, time, and available slots, is encapsulated within the `useReservation` custom hook located at `src/hooks/useReservation.js`. This hook is utilized by `src/pages/ReservationPage/ReservationPage.jsx`. This is the most logical and centralized location for integrating the API calls.
*   **`DateTimeSelector.jsx` Current Behavior:** The `DateTimeSelector.jsx` component currently fetches its own available time slots using a `useEffect` hook that calls a local service (`getAvailableTimeSlots` from `src/services/reservationService.js`). This logic will be refactored to receive available times as props.

### Revised API Implementation Steps:

1.  **Add API Script to `index.html`**:
    *   **File:** `/Users/admin/CascadeProjects/little-lemon/index.html`
    *   **Action:** Insert the API script tag just before the main application script (`/src/main.jsx`).
    *   **Code:**
        ```html
        <body>
          <div id="root"></div>
          <script src="https://raw.githubusercontent.com/courseraap/capstone/main/api.js"></script>
          <script type="module" src="/src/main.jsx"></script>
        </body>
        ```
    *   **Purpose:** To make `fetchAPI(date)` and `submitAPI(formData)` globally available to the application.

2.  **Integrate `fetchAPI` into `useReservation.js`**:
    *   **File:** `src/hooks/useReservation.js`
    *   **Action (Initial Load - Simulating `initializeTimes`):**
        *   Modify the hook (likely within a `useEffect` that runs on mount or when no date is selected) to call the global `fetchAPI(new Date())` to retrieve available times for the current day.
        *   The fetched times should update a state variable within the hook (e.g., `availableTimes`).
    *   **Action (Date Change - Simulating `updateTimes`):**
        *   Modify the function responsible for handling date changes (e.g., `handleDateTimeChange` or similar, which is triggered by `onDateChange` from `DateTimeSelector.jsx`).
        *   When a new date is selected, this function should call `fetchAPI(selectedDate)`.
        *   The fetched times for the new date should update the `availableTimes` state in the hook.
    *   **State Management:** The `availableTimes` state managed by `useReservation` will be part of the data returned by the hook, which `ReservationPage.jsx` will then pass as a prop to `DateTimeSelector.jsx`.

3.  **Update `DateTimeSelector.jsx`**:
    *   **File:** `src/components/features/Reservation/DateTimeSelector.jsx`
    *   **Action:**
        *   Remove or significantly refactor the existing `useEffect` hook that calls `getAvailableTimeSlots`.
        *   The component will now receive `availableTimeSlots` as a prop from `ReservationPage.jsx`.
        *   The component will render these prop-driven time slots.
        *   Ensure logic for resetting selected time (`onTimeChange('')`) if the current `selectedTime` is not in the new `availableTimeSlots` is preserved, likely handled within `useReservation` or triggered by it.

4.  **Implement `submitAPI` in `useReservation.js` (Future Step, as per course):**
    *   **File:** `src/hooks/useReservation.js`
    *   **Action:** The function responsible for form submission (e.g., `handleConfirmReservation`) will be modified to call `submitAPI(formData)` with the collected reservation details.
    *   The hook will manage the success/failure response from `submitAPI`.

5.  **Error Handling & Loading States**:
    *   Implement robust error handling for API calls within `useReservation.js`.
    *   Display appropriate loading indicators (e.g., when fetching times) and error messages to the user via the UI components. This state should also be managed within `useReservation.js`.

### Updated Testing Requirements:

*   **Unit Tests for `useReservation.js`**:
    *   Verify that `fetchAPI` is called correctly on initial load and on date changes.
    *   Mock `fetchAPI` to test different scenarios (successful fetch, empty slots, API errors).
    *   Test state updates for `availableTimes`, loading states, and error states.
*   **Unit Tests for `DateTimeSelector.jsx`**:
    *   Verify it correctly displays `availableTimeSlots` received via props.
    *   Ensure it correctly calls `onDateChange`, `onTimeChange`, etc.
*   **Integration Tests for `ReservationPage.jsx`**:
    *   Test the end-to-end flow of selecting a date, seeing updated times from the (mocked) API, and proceeding through the reservation steps.

### Phase 3: Transition Testing
*(No changes to this section, remains as is)*

### Phase 4: Deployment Strategy
*(No changes to this section, remains as is)*

## Risk Mitigation
*(No changes to this section, remains as is)*

## Recommendation
*(Adjusted to reflect current status)*

1.  **Complete Pre-API Integration Testing**: *(Marked as completed on `feature/unit-testing-reservation-flow`)*
2.  **Proceed with API Integration on `feature/api-integration` branch**:
    *   Implement the detailed API integration steps outlined above.
    *   Ensure comprehensive testing (unit, integration, E2E).
    *   Follow the phased deployment approach.

This approach ensures:
- Minimal disruption to existing functionality
- Comprehensive test coverage
- Smooth transition to API-based system
- Proper validation at each step

## Next Steps

1.  Review and approve this updated transition strategy.
2.  Begin implementation of the "Revised API Implementation Steps" on the `feature/api-integration` branch.
3.  Regular progress reviews and strategy adjustments as needed.

## Success Criteria
*(No changes to this section, remains as is)*
