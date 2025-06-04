---
Title: Form Accessibility Guidelines - Little Lemon
Author: Chien Escalera Duong
Date Created: 2025-06-04
Time Created: 13:14:45 PDT 
Last Updated: 2025-06-04 13:14:45 PDT
Version: 1.0
---

## Form Accessibility Guidelines: Little Lemon Reservation System

Ensuring web accessibility is crucial for providing an inclusive experience to all users, including those with disabilities. This document outlines key accessibility considerations and best practices applied to the forms within the Little Lemon reservation system, aligning with Web Content Accessibility Guidelines (WCAG).

### 1. Semantic HTML

-   **Labels:** Every form input (`<input>`, `<select>`, `<textarea>`) is associated with a corresponding `<label>` element using the `for` and `id` attributes. This ensures that screen readers can announce the purpose of each control.
    -   Example: `<label for="name">Full Name:</label><input type="text" id="name" name="name">`
-   **Fieldsets and Legends:** For groups of related controls (e.g., radio buttons for an occasion, or sections of a form), `<fieldset>` and `<legend>` are used to provide context. (To be reviewed if applicable for current forms).
-   **Buttons:** Buttons (`<button>` or `<input type="submit">`) have clear, descriptive text indicating their action.

### 2. Keyboard Navigation & Focus Management

-   **Navigability:** All form controls are navigable and operable using only the keyboard, in a logical order.
-   **Focus Indicators:** Clear and visible focus indicators are present for all interactive elements, ensuring users know which element currently has keyboard focus. Default browser outlines are maintained or enhanced with custom styling that meets contrast requirements.
-   **Skip Links:** (Consideration for overall site) A "skip to main content" link is available to allow keyboard users to bypass repetitive navigation.

### 3. Error Handling & Validation

-   **Clear Error Identification:** When validation errors occur:
    -   Errors are clearly indicated visually (e.g., red border, error icon).
    -   Textual error messages are displayed adjacent to or near the problematic field.
-   **Programmatic Association:** Error messages are programmatically associated with their respective input fields using `aria-describedby`. The input field itself can be marked with `aria-invalid="true"`.
    -   Example: `<input type="email" id="email" name="email" aria-describedby="email-error" aria-invalid="true"><div id="email-error" role="alert">Please enter a valid email address.</div>`
-   **`aria-live` Regions:** For dynamic error messages or success messages appearing on the page without a full reload (like our form submission messages), `aria-live` regions (e.g., `role="alert"` or `role="status"`) are used to ensure screen readers announce them.
-   **Guidance:** Instructions and formatting requirements (e.g., "Phone: XXX-XXX-XXXX") are provided upfront or as placeholder text where appropriate.

### 4. ARIA Attributes (Accessibility Rich Internet Applications)

-   **`aria-required`:** Used for mandatory fields if not otherwise indicated by HTML5's `required` attribute.
-   **`aria-label` / `aria-labelledby`:** Used when a visible label is not feasible or sufficient, or to provide more context.
-   **Progress Indicators:** For multi-step forms (like the reservation process), the current step is clearly indicated both visually and programmatically (e.g., using `aria-current="step"` on the active step indicator).
-   **Loading States:** For actions like form submission (`isSubmitting`), ARIA attributes like `aria-busy="true"` can be used on the form or button, and loading indicators should be accessible.

### 5. Visual Design & Usability

-   **Color Contrast:** Text, icons, and important UI elements (like input borders, focus indicators) meet WCAG AA contrast ratios against their background.
-   **Responsive Design:** Forms are responsive and usable across various screen sizes and devices.
-   **Sufficient Target Size:** Clickable targets (buttons, links, form controls) are large enough to be easily activated.

### 6. Testing

-   **Automated Testing:** Tools like Axe or Lighthouse are used to catch common accessibility issues.
-   **Manual Testing:**
    -   Keyboard-only navigation testing.
    -   Screen reader testing (e.g., NVDA, VoiceOver, JAWS).
    -   Zoom testing to ensure content reflows and remains readable.

This document serves as a living guide and will be updated as the application evolves.
