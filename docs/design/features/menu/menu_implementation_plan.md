# Little Lemon Menu Page: React Implementation Plan

## 1. Introduction

This document outlines the plan to translate the `menu-with-gemini-service.html` prototype into a fully functional Menu page within the Little Lemon React application. It includes component breakdown, data management, API integration for the Gemini "Ingredient Spotlight" feature, styling, and routing.

## 2. Prerequisites

1.  **Gemini API Key:**
    *   Ensure you have a valid Google Gemini API key.
    *   Create a `.env` file at the root of your React project (e.g., `/Users/admin/Desktop/meta-front-end/courses/c8.capstone-project/little-lemon/.env`).
    *   Add your API key to it: `REACT_APP_GEMINI_API_KEY=YOUR_API_KEY_HERE`.
    *   Ensure `.env` is listed in your `.gitignore` file to prevent committing the key.

## 3. Directory Structure

We will follow the existing component-based directory structure:

*   **Pages:**
    *   `src/pages/MenuPage/MenuPage.jsx`
    *   `src/pages/MenuPage/MenuPage.module.css`
*   **Reusable Components:**
    *   `src/components/MenuHero/MenuHero.jsx`
    *   `src/components/MenuHero/MenuHero.module.css`
    *   `src/components/IngredientSpotlight/IngredientSpotlight.jsx`
    *   `src/components/IngredientSpotlight/IngredientSpotlight.module.css`
    *   `src/components/MenuCategorySection/MenuCategorySection.jsx`
    *   `src/components/MenuCategorySection/MenuCategorySection.module.css`
    *   `src/components/MenuItemCard/MenuItemCard.jsx`
    *   `src/components/MenuItemCard/MenuItemCard.module.css`
    *   `src/components/Modal/Modal.jsx` (if a generic one is preferred)
    *   `src/components/Modal/Modal.module.css`
*   **Data:**
    *   `src/data/menuData.js`
*   **Services:**
    *   `src/services/geminiService.js`
*   **Assets:**
    *   `src/assets/images/` (already populated with menu item images)
    *   `src/assets/icons/` (for any necessary icons)

## 4. Data Management

1.  **Static Menu Data (`src/data/menuData.js`):**
    *   This file will export an array of menu item objects and an array of category names.
    *   Example structure:
        ```javascript
        export const menuItems = [
          {
            id: 1,
            category: "Appetizers",
            name: "Bruschetta",
            price: "$8.99",
            description: "Grilled bread rubbed with garlic and topped with fresh tomatoes, basil, and a drizzle of balsamic glaze.",
            imageSrc: "../../assets/images/bruchetta.svg" // Relative path from component using it
          },
          // ... more items
        ];

        export const menuCategories = ["Appetizers", "Main Courses", "Desserts", "Drinks"];
        ```
    *   **Note on `imageSrc`:** Paths will need to be relative to the component importing them or handled via direct imports if using Vite's asset handling for `src` directory.

2.  **Dynamic Data (Ingredient Spotlight):**
    *   Managed within the `IngredientSpotlight.jsx` component using `useState` for `isLoading`, `spotlightData`, and `error` states.

## 5. Component Breakdown

### 5.1. `MenuPage.jsx`
*   **Location:** `src/pages/MenuPage/`
*   **Responsibilities:**
    *   Main container for the entire menu page.
    *   Imports `menuItems` and `menuCategories` from `menuData.js`.
    *   Renders `MenuHero`, `IngredientSpotlight`, and iterates through `menuCategories` to render `MenuCategorySection` for each.
*   **Props:** None.
*   **State:** None initially (could hold modal state if not global).

### 5.2. `MenuHero.jsx`
*   **Location:** `src/components/MenuHero/`
*   **Responsibilities:** Displays the static hero section content ("Our Culinary Delights").
*   **Props:** None.
*   **State:** None.

### 5.3. `IngredientSpotlight.jsx`
*   **Location:** `src/components/IngredientSpotlight/`
*   **Responsibilities:**
    *   Handles the "Discover an Ingredient!" button interaction.
    *   Manages API calls to the Gemini service (either directly or via `geminiService.js`).
    *   Displays loading states, fetched spotlight content, or error messages.
    *   Interacts with the Modal component to show errors.
*   **Props:** None (or `showModal` function if modal is managed by parent).
*   **State:** `isLoading (boolean)`, `spotlightData (object | null)`, `error (string | null)`.

### 5.4. `MenuCategorySection.jsx`
*   **Location:** `src/components/MenuCategorySection/`
*   **Responsibilities:**
    *   Displays the title for a menu category.
    *   Renders a grid of `MenuItemCard` components for the items in that category.
*   **Props:** `categoryName (string)`, `items (array)` - (list of menu item objects for this category).
*   **State:** None.

### 5.5. `MenuItemCard.jsx`
*   **Location:** `src/components/MenuItemCard/`
*   **Responsibilities:**
    *   Displays an individual menu item: image, name, price, description.
    *   Includes an "Add to Order" button (initially a placeholder).
*   **Props:** `item (object)` - (a single menu item object).
*   **State:** None.

### 5.6. `Modal.jsx` (Generic Reusable Modal)
*   **Location:** `src/components/Modal/`
*   **Responsibilities:** Displays modal dialogs for notifications or errors.
*   **Props:** `isOpen (boolean)`, `onClose (function)`, `title (string)`, `message (string)`.
*   **State:** Internal state to manage visibility if not fully controlled by `isOpen` prop.

## 6. Styling Strategy

*   Each component will have its own CSS Module (e.g., `MenuPage.module.css`, `MenuItemCard.module.css`).
*   Styles will be migrated from the `menu-with-gemini-service.html` prototype.
*   Class names in JSX will use the `styles.className` convention.
*   Global styles (colors, fonts from `index.css` or `App.css`) should be leveraged, ensuring consistency with the Little Lemon Style Guide (e.g., `--primary-green`, `--primary-yellow`, 'Karla', 'Markazi Text' fonts, 16px border-radius).

## 7. Gemini API Integration

1.  **Service Function (`src/services/geminiService.js`):**
    *   Encapsulate the `fetch` call to the Gemini API.
    *   Function signature: `async function getIngredientSpotlight(apiKey, menuItemsForPrompt)`.
    *   Construct the prompt and payload as in the prototype.
        *   **Model Name:** Verify and use the correct Gemini model name (e.g., `gemini-1.5-flash-latest` or `gemini-pro` if `gemini-2.0-flash` is incorrect). The prototype uses `gemini-2.0-flash` in the URL, this might need adjustment to a current, available model that supports JSON schema output.
    *   Set `responseMimeType: "application/json"` and define `responseSchema` in `generationConfig`.
    *   Handle API response, parse the JSON string from `result.candidates[0].content.parts[0].text`.
    *   Implement robust error handling (network errors, API errors).

2.  **API Key Usage:**
    *   In `IngredientSpotlight.jsx` (or `geminiService.js`), access the API key using `process.env.REACT_APP_GEMINI_API_KEY`.

3.  **Invocation:**
    *   `IngredientSpotlight.jsx` will call `getIngredientSpotlight` from the service on button click.

## 8. Modal Implementation

*   The `Modal.jsx` component will be used by `IngredientSpotlight.jsx` to display API errors or other important messages.
*   The `IngredientSpotlight` component will manage the state for modal visibility (`isModalOpen`) and content (`modalTitle`, `modalMessage`), passing them as props to `Modal.jsx`.

## 9. Routing

*   In `App.jsx` (or your main router configuration file, e.g., using React Router DOM):
    *   Add a new route:
        ```jsx
        import MenuPage from './pages/MenuPage/MenuPage';
        // ... other imports

        <Routes>
          {/* ... other routes ... */}
          <Route path="/menu" element={<MenuPage />} />
        </Routes>
        ```
*   Ensure there's a link in your `Nav.jsx` or `Header.jsx` component pointing to `/menu`.

## 10. Step-by-Step Implementation Guide

1.  **Setup:** Create `.env` file and add `REACT_APP_GEMINI_API_KEY`.
2.  **Data:** Create `src/data/menuData.js` with the structure for all menu items and categories.
3.  **Static Components (Bottom-up):**
    *   Develop `MenuItemCard.jsx` and its CSS module. Test with sample item data.
    *   Develop `MenuHero.jsx` and its CSS module.
4.  **Layout Components:**
    *   Develop `MenuCategorySection.jsx` to display a category title and a grid of `MenuItemCard`s.
    *   Develop `MenuPage.jsx` to assemble `MenuHero`, `IngredientSpotlight` (initially as a placeholder), and `MenuCategorySection`s. Populate with data from `menuData.js`.
5.  **Routing:** Add the `/menu` route in `App.jsx` and a link in the navigation.
6.  **Gemini Service:**
    *   Implement `src/services/geminiService.js` with the API call logic.
7.  **Interactive Component (`IngredientSpotlight.jsx`):
    *   Develop `IngredientSpotlight.jsx` and its CSS module.
    *   Integrate the call to `geminiService.js`.
    *   Implement state management for loading, data, and errors.
    *   Render content dynamically.
8.  **Modal:**
    *   Develop or integrate a `Modal.jsx` component.
    *   Connect `IngredientSpotlight.jsx` to use the modal for error reporting.
9.  **Styling Refinement:** Thoroughly review and test styles on all components, ensuring responsiveness and adherence to the style guide.
10. **Testing:** Perform manual and (if time permits) automated tests.

## 11. Testing Considerations

*   **Manual Testing:**
    *   Verify all menu items display correctly with their images and details.
    *   Test the "Ingredient Spotlight" button: loading state, successful data display, error message display (e.g., by temporarily using a wrong API key or disconnecting internet).
    *   Check responsiveness on different screen sizes.
*   **Automated Testing (Jest & React Testing Library):**
    *   **Unit Tests:** For individual components, especially logic-heavy ones like `IngredientSpotlight` or pure presentational ones like `MenuItemCard`.
    *   **Service Test:** Test `geminiService.js` by mocking `fetch`.
    *   **Integration Tests:** Test the interaction between `IngredientSpotlight` and `geminiService` (with the service mocked).
    *   Mock `fetch` or the `geminiService.js` module to avoid actual API calls during tests.

This plan provides a comprehensive roadmap for implementing the menu page. We can proceed with these steps when you're ready.
