# Little Lemon Application Architecture Map

This document outlines the architectural structure of the Little Lemon application, detailing pages, their constituent sections/components, and the associated JSX and CSS files.

## I. Global Components

These components are present on most or all pages, providing consistent layout and functionality.

1.  **`Header`**
    *   **Purpose**: Top navigation bar, logo, cart icon.
    *   **JSX**: `src/components/Header/Header.jsx`
    *   **CSS**: `src/components/Header/Header.module.css`
    *   **Contains**:
        *   `Nav` (Navigation links)
            *   **JSX**: `src/components/Nav/Nav.jsx`
            *   **CSS**: `src/components/Nav/Nav.module.css`

2.  **`Footer`**
    *   **Purpose**: Bottom section with copyright, links, etc.
    *   **JSX**: `src/components/Footer/Footer.jsx`
    *   **CSS**: `src/components/Footer/Footer.module.css`

3.  **`ChatFeatureContainer`**
    *   **Purpose**: Floating chat assistant.
    *   **JSX**: `src/components/ChatAssistant/ChatFeatureContainer.jsx`
    *   **CSS**: Primarily `src/components/ChatAssistant/ChatAssistant.module.css` (and other CSS files within `src/components/ChatAssistant/` for its sub-components like `ChatWindow.jsx`, `FloatingChatButton.jsx`, `MessageBubble.jsx`, etc.)

## II. Pages & Their Sections

### A. Landing Page (Route: `/`)

*   **Main Page Component**: `MainComponent`
    *   **JSX**: `src/components/MainComponent/MainComponent.jsx`
    *   **CSS**: `src/components/MainComponent/MainComponent.module.css`
*   **Sections within `MainComponent`**:
    1.  **`Hero`**
        *   **Purpose**: Main promotional banner/area.
        *   **JSX**: `src/components/Hero/Hero.jsx`
        *   **CSS**: `src/components/Hero/Hero.module.css`
    2.  **`OrderForDelivery` (Featured Items Section)**
        *   **Purpose**: Displays a selection of menu items, often used for specials or featured items on the homepage.
        *   **JSX**: `src/components/OrderForDelivery/OrderForDelivery.jsx`
        *   **CSS**: `src/components/OrderForDelivery/OrderForDelivery.module.css`
        *   **Contains**:
            *   `OrderDeliveryCard` (Displays individual menu item)
                *   **JSX**: `src/components/OrderDeliveryCard/OrderDeliveryCard.jsx`
                *   **CSS**: `src/components/OrderDeliveryCard/OrderDeliveryCard.module.css`
    3.  **`Testimonials`**
        *   **Purpose**: Showcases customer reviews.
        *   **JSX**: `src/components/Testimonials/Testimonials.jsx`
        *   **CSS**: `src/components/Testimonials/Testimonials.module.css`
        *   **Contains**:
            *   `TestimonialCard` (Displays individual testimonial)
                *   **JSX**: `src/components/Testimonials/TestimonialCard/TestimonialCard.jsx`
                *   **CSS**: `src/components/Testimonials/TestimonialCard/TestimonialCard.module.css`
    4.  **`About` (Summary Section)**
        *   **Purpose**: Brief introduction to the restaurant, linking to the full About Page.
        *   **JSX**: `src/components/About/About.jsx`
        *   **CSS**: `src/components/About/About.module.css`

### B. Menu Page (Route: `/menu`)

*   **Main Page Component**: `MenuPage`
    *   **JSX**: `src/pages/MenuPage/MenuPage.jsx`
    *   **CSS**: `src/pages/MenuPage/MenuPage.module.css`
*   **Sections within `MenuPage`**:
    1.  **`OrderForDelivery` (Full Menu Display)**
        *   **Purpose**: Reused to display the entire filterable menu under the title "Our Menu".
        *   **JSX**: `src/components/OrderForDelivery/OrderForDelivery.jsx`
        *   **CSS**: `src/components/OrderForDelivery/OrderForDelivery.module.css`
        *   **Contains**:
            *   `OrderDeliveryCard` (Displays individual menu item)
                *   **JSX**: `src/components/OrderDeliveryCard/OrderDeliveryCard.jsx`
                *   **CSS**: `src/components/OrderDeliveryCard/OrderDeliveryCard.module.css`

### C. Cart Page (Route: `/cart`)

*   **Main Page Component**: `CartPage`
    *   **JSX**: `src/pages/CartPage/CartPage.jsx`
    *   **CSS**: `src/pages/CartPage/CartPage.module.css`
*   **Sections/Functionality within `CartPage`**:
    1.  **Empty Cart Display**
        *   Uses `Button` component for "Browse Menu" link.
            *   **JSX**: `src/components/Button/Button.jsx`
            *   **CSS**: `src/components/Button/Button.module.css`
    2.  **Cart Items List**
        *   Displays item image, details, price, quantity controls, remove button.
        *   Styling primarily within `CartPage.module.css`.
    3.  **Cart Summary**
        *   Displays total price, "Clear Cart" button, "Checkout" button.
        *   Styling primarily within `CartPage.module.css`.
*   **Context Used**: `useCart` (from `src/context/CartContext.js` or `useCart.js`)

### D. About Page (Route: `/about`)

*   **Main Page Component**: `AboutPage`
    *   **JSX**: `src/pages/AboutPage/AboutPage.jsx`
    *   **CSS**: `src/pages/AboutPage/AboutPage.module.css`
*   **Sections within `AboutPage`** (Content and structure defined directly in `AboutPage.jsx`):
    1.  **Introduction Section** (Restaurant overview, image)
    2.  **Founders Section** (Story of Mario & Adrian, image)
    3.  **Philosophy Section** (Core principles, image, list)
    4.  **Gallery Section** (Grid of restaurant images)
    5.  **Visit Us Section** (Location info, call to action button to `/reservations`)

### E. Reservation Page (Route: `/reservations`)

*   **Main Page Component**: `ReservationPage`
    *   **JSX**: `src/pages/ReservationPage/ReservationPage.jsx`
    *   **CSS**: `src/pages/ReservationPage/ReservationPage.module.css`
*   **Hook Used**: `useReservation` (from `src/hooks/useReservation.js`)
*   **Multi-Step Process**:
    *   **Progress Indicator**: Visual step display (Styled by `ReservationPage.module.css`).
    1.  **Step 1: Date & Time Selection**
        *   Component: `DateTimeSelector`
            *   **JSX**: `src/components/Reservation/DateTimeSelector.jsx`
            *   **CSS**: `src/components/Reservation/DateTimeSelector.module.css` (Assumed)
    2.  **Step 2: Your Information**
        *   Component: `ReservationForm`
            *   **JSX**: `src/components/Reservation/ReservationForm.jsx`
            *   **CSS**: `src/components/Reservation/ReservationForm.module.css`
    3.  **Step 3: Review & Confirm**
        *   Component: `ReservationConfirmation`
            *   **JSX**: `src/components/Reservation/ReservationConfirmation.jsx`
            *   **CSS**: `src/components/Reservation/ReservationConfirmation.module.css` (Assumed)
    4.  **Step 4: Success Display**
        *   Content defined within `ReservationPage.jsx`.
*   **General Buttons**: Uses `Button` component for some actions (e.g., Cancel, Return Home) and custom styled buttons for step navigation.
    *   `Button` JSX: `src/components/Button/Button.jsx`
    *   `Button` CSS: `src/components/Button/Button.module.css`

### F. My Reservations Page (No direct route in `App.jsx` - likely linked from user profile/menu)

*   **Main Page Component**: `MyReservationsPage`
    *   **JSX**: `src/pages/MyReservationsPage/MyReservationsPage.jsx`
    *   **CSS**: `src/pages/MyReservationsPage/MyReservationsPage.module.css`
*   **Sections within `MyReservationsPage`**:
    1.  **`ReservationList`**
        *   **Purpose**: Displays a list of user's reservations.
        *   **JSX**: `src/components/Reservation/ReservationList.jsx`
        *   **CSS**: `src/components/Reservation/ReservationList.module.css` (Assumed)

## III. Notes

-   CSS module paths for sub-components (like `DateTimeSelector.module.css`) are assumed based on convention. If a component doesn't have its own specific CSS module, its styles might be part of a parent component's CSS module or global styles.
-   The `OrderForDelivery` component is versatile, used both for a featured section on the homepage and as the main menu display on the Menu Page.
-   Contexts like `CartContext` and hooks like `useReservation` play a crucial role in state management but are not detailed component by component here, only where they are primarily consumed at the page level.

This map should provide a clear overview of the application's structure. It can be updated as the project evolves.
