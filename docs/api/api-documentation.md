---
Title: Mock API Documentation - Little Lemon Reservation System
Author: Chien Escalera Duong
Date Created: 2025-06-04
Time Created: 13:11:30 PDT 
Last Updated: 2025-06-04 13:11:30 PDT
Version: 1.0
---

## Mock API Documentation: Little Lemon Reservation System

This document outlines the mock APIs used in the Little Lemon reservation system frontend. These APIs simulate backend interactions for fetching available reservation times and submitting reservation requests. They are implemented directly in the frontend (e.g., in `public/api.js` or a similar setup) and attached to the `window` object for global access.

### 1. `window.fetchAPI(date)`

**Purpose:**
Simulates fetching available reservation time slots for a given date.

**Endpoint (Conceptual):**
N/A (Implemented as a JavaScript function `window.fetchAPI`)

**Request:**
-   **Parameter:** `date` (String)
    -   Description: The selected date for which to fetch available times.
    -   Format: `YYYY-MM-DD` (e.g., "2025-12-31")
-   **Method (Conceptual):** `GET`

**Response (Simulated):**
-   **Success (Array of Strings):**
    -   Description: An array of strings, where each string represents an available time slot.
    -   Format: `["HH:MM", "HH:MM", ...]` (e.g., `["17:00", "17:30", "18:00"]`)
    -   Example: `window.fetchAPI("2025-06-15")` might return `["17:00", "17:30", "18:00", "19:00", "20:00"]`.
-   **Failure/Error Cases:**
    -   The mock API is designed to always return a list of times, potentially varying based on the date to simulate real-world availability. It doesn't explicitly simulate network errors or server-side failures beyond returning an empty array or a predefined set of times.

**Assumptions & Behavior:**
-   The function is synchronous or returns a Promise that resolves quickly with the data.
-   The available times are pseudo-randomly generated or follow a simple logic based on the input date to mimic a real API.
-   It does not require authentication or any headers.
-   The implementation in `public/api.js` (or equivalent) contains the logic for generating these times.

### 2. `window.submitAPI(formData)`

**Purpose:**
Simulates submitting a completed reservation form to the backend.

**Endpoint (Conceptual):**
N/A (Implemented as a JavaScript function `window.submitAPI`)

**Request:**
-   **Parameter:** `formData` (Object)
    -   Description: An object containing all the details of the reservation.
    -   Format:
        ```javascript
        {
          date: "YYYY-MM-DD",
          time: "HH:MM",
          partySize: Number, // e.g., 2
          name: "String",    // e.g., "John Doe"
          email: "String",   // e.g., "john.doe@example.com"
          phone: "String",   // e.g., "123-456-7890"
          occasion: "String", // e.g., "Birthday", "Anniversary", or ""
          specialRequests: "String" // e.g., "Window seat if possible." or ""
        }
        ```
-   **Method (Conceptual):** `POST`

**Response (Simulated):**
-   **Success (Boolean):**
    -   Description: Returns `true` if the submission is "successful".
    -   Example: `window.submitAPI(reservationData)` might return `true`.
-   **Failure (Boolean):**
    -   Description: Returns `false` if the submission "fails" (e.g., to simulate a scenario where the time slot was just taken).
    -   Example: `window.submitAPI(reservationData)` might return `false`.

**Assumptions & Behavior:**
-   The function is synchronous or returns a Promise that resolves quickly.
-   The mock API has a simple logic (e.g., always returns `true`, or randomly returns `true`/`false`) to simulate success or failure.
-   It does not perform actual data storage or complex validation beyond what's simulated.
-   It does not return detailed error messages or codes; success/failure is indicated by the boolean return value.
-   The implementation in `public/api.js` (or equivalent) contains the logic for this simulation.

**Integration:**
Both `window.fetchAPI` and `window.submitAPI` are typically initialized in a script loaded in `index.html`, making them available globally for the React application to use, as seen in the `useReservation` hook.
