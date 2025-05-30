# AI Chat Assistant: Architecture & Implementation Plan

## 1. Introduction & Goals

This document outlines the architecture and implementation plan for an AI-powered Chat Assistant for the Little Lemon restaurant website. 

**Key Goals:**
- Provide personalized meal recommendations based on user preferences and queries.
- Answer user questions about the menu (e.g., ingredients, dietary information like gluten-free options).
- Enhance user engagement by offering an interactive way to explore the menu.
- Display recommended menu items as rich, interactive cards within the chat interface (Phase 2).

## 2. Proposed Architecture

The AI Chat Assistant will be integrated into the existing React application, leveraging the Gemini API for its conversational AI capabilities and the existing `menuData.js` for menu information.

### 2.1 Frontend (React Components)

A new set of React components will be created to manage the chat interface and functionality:

-   **`ChatFeatureContainer.jsx`**: 
    -   The top-level component for the chat feature.
    -   Manages overall chat state (e.g., visibility, conversation history, loading status).
    -   Handles communication with the `geminiService`.
    -   Could be instantiated in `App.jsx` (for global availability) or `MenuPage.jsx` (if specific to the menu).
-   **`FloatingChatButton.jsx`**: 
    -   A persistent button (e.g., bottom-right of the screen) that toggles the visibility of the `ChatWindow`.
-   **`ChatWindow.jsx`**: 
    -   The main UI container for the conversation.
    -   Displays the message list and the chat input field.
    -   Conditionally rendered based on state managed by `ChatFeatureContainer.jsx`.
-   **`MessageList.jsx`**: 
    -   Renders the list of messages in the conversation.
    -   Scrolls to show the latest messages.
-   **`MessageBubble.jsx`**: 
    -   Represents a single message in the chat (either from the user or the AI).
    -   Styled differently for user vs. AI messages.
    -   In Phase 2, AI messages can contain `MenuItemCardChat.jsx` components.
-   **`ChatInput.jsx`**: 
    -   A text input field for the user to type their queries.
    -   A send button to submit the query.
-   **`MenuItemCardChat.jsx`** (Phase 2):
    -   A specialized version of a menu item card, designed for display within a chat message.
    -   Shows item image, name, price, and a brief description.

### 2.2 Services

-   **`geminiService.js`** (Existing - to be extended):
    -   A new asynchronous function, e.g., `fetchChatResponse(userQuery, conversationHistory, menuContext)` will be added.
    -   This function will:
        -   Construct a detailed prompt for the Gemini API, including the user's query, relevant conversation history (for context), and essential information about Little Lemon's menu (to guide responses and item selection).
        -   Send the request to the Gemini API.
        -   Process the response. In Phase 1, this will be text. In Phase 2, this will include parsing out recommended menu item `id`s.

### 2.3 Data

-   **`menuData.js`** (Existing - to be enhanced):
    -   Crucial for both the AI and the UI.
    -   **Enhancements Needed:**
        -   Ensure every menu item has a unique `id` (currently seems to be the case).
        -   Ensure every menu item has a valid `image` path/URL.
        -   Add a `dietaryTags` array to each item (e.g., `dietaryTags: ["vegetarian", "gluten-free", "vegan"]`). This will significantly improve the AI's ability to filter and recommend accurately.
    -   Used by `ChatWindow.jsx` (or its children) to fetch full details of recommended items (using `id`s from AI) to render `MenuItemCardChat.jsx`.
    -   Portions of this data (item names, categories, dietary tags) will be used to build the `menuContext` for the Gemini prompt.

### 2.4 State Management

-   **Initial Approach:** Local component state within `ChatFeatureContainer.jsx` using React hooks (`useState`, `useEffect`, `useReducer` if complexity warrants) for:
    -   Chat window visibility.
    -   Array of message objects (each with sender, text, timestamp, and potentially type for card display).
    -   Current user input.
    -   AI loading state.
-   **Future Consideration:** If chat state needs to be persisted across sessions or shared more broadly, React Context API or a lightweight global state manager (e.g., Zustand, Jotai) could be introduced.

### 2.5 Conceptual Data Flow

1.  User clicks `FloatingChatButton.jsx` -> `ChatFeatureContainer.jsx` updates state to show `ChatWindow.jsx`.
2.  User types in `ChatInput.jsx` and submits -> `ChatFeatureContainer.jsx` adds user message to state, sets loading state.
3.  `ChatFeatureContainer.jsx` calls `fetchChatResponse` from `geminiService.js` with the query and context.
4.  `geminiService.js` sends a prompt to Gemini API.
5.  Gemini API returns a response.
6.  `geminiService.js` processes the response (text or item `id`s).
7.  `ChatFeatureContainer.jsx` receives the AI response, adds AI message to state, clears loading state.
8.  `MessageList.jsx` re-renders with new messages. If item `id`s are present (Phase 2), it fetches data from `menuData.js` and renders `MenuItemCardChat.jsx` components within the AI's `MessageBubble.jsx`.

## 3. Integration with Existing Architecture

-   The main entry point, `ChatFeatureContainer.jsx`, will likely be rendered conditionally within `App.jsx` to make the chat globally accessible, or within `MenuPage.jsx` if it's intended to be menu-specific.
-   The extended `geminiService.js` will continue to use the `VITE_REACT_APP_GEMINI_API_KEY` from the `.env` file.
-   `menuData.js` will be imported and used as described above.

## 4. Component Hierarchy

```
App.jsx (or MenuPage.jsx)
└── ChatFeatureContainer.jsx
    ├── FloatingChatButton.jsx
    └── ChatWindow.jsx (conditionally rendered)
        ├── MessageList.jsx
        │   ├── MessageBubble.jsx (sender: 'user', content: text)
        │   └── MessageBubble.jsx (sender: 'ai', content: text or array of MenuItemCardChat.jsx)
        │       └── MenuItemCardChat.jsx (optional, Phase 2)
        └── ChatInput.jsx
```

## 5. Phased Implementation Plan

### Phase 0: Preparation & Foundation

1.  **Decision:** Determine if the chat assistant should be global (in `App.jsx`) or menu-specific (in `MenuPage.jsx`). (User to decide)
2.  **Enhance `menuData.js`**:
    *   Add `dietaryTags: []` to each menu item (e.g., `["vegetarian", "gluten-free"]`).
    *   Verify all items have unique `id`s and valid `image` paths.

### Phase 1: Core Text-Based Chat Functionality

1.  **Develop Basic Chat UI Components:**
    *   `ChatFeatureContainer.jsx` (initial state management for visibility, messages array, input).
    *   `FloatingChatButton.jsx` (toggles visibility).
    *   `ChatWindow.jsx` (basic structure).
    *   `MessageList.jsx` (renders simple text messages).
    *   `MessageBubble.jsx` (styles for user/AI text messages).
    *   `ChatInput.jsx` (captures user input, triggers send).
2.  **Implement `fetchChatResponse` in `geminiService.js` (Text-Based):**
    *   Develop an initial prompt for Gemini focusing on answering questions about the Little Lemon menu and providing text-based recommendations.
    *   The prompt should instruct Gemini on its persona and how to use provided menu context (e.g., a summarized list of dishes and categories).
3.  **Integrate and Test:**
    *   Connect UI to the service.
    *   Display user messages and AI's text responses.
    *   Basic loading state indication.

### Phase 2: Rich Menu Item Card Display

1.  **Develop `MenuItemCardChat.jsx`:**
    *   Create a component to display a menu item's image, name, price, and short description, suitable for embedding in a chat message.
2.  **Update `fetchChatResponse` & Prompt (for Item IDs):**
    *   Modify the Gemini prompt to request a list of menu item `id`s (from `menuData.js`) when making recommendations, in a structured format (e.g., JSON array within the response text, or a specific field if the API supports structured output directly).
    *   Update the service function to parse these `id`s from Gemini's response.
3.  **Implement Dynamic Card Rendering:**
    *   In `ChatFeatureContainer.jsx` or `MessageList.jsx`, when an AI response contains item `id`s:
        *   Fetch the full details for each `id` from the imported `menuItems` array.
        *   Pass this data to `MenuItemCardChat.jsx` and render these cards as part of the AI's message.
4.  **Test and Refine:**
    *   Ensure cards display correctly and AI reliably returns `id`s.

### Phase 3: Advanced Features & Refinements (Future Considerations)

-   Conversation history persistence (e.g., using `localStorage`).
-   Quick reply buttons for common queries.
-   More sophisticated context management (e.g., remembering user preferences across a session).
-   Error handling for API failures or unexpected AI responses.

## 6. File Structure Proposal

```
src/
├── assets/
│   └── images/ ...
├── components/
│   ├── ... (existing components)
│   └── ChatAssistant/               # New directory for chat components
│       ├── ChatFeatureContainer.jsx
│       ├── FloatingChatButton.jsx
│       ├── ChatWindow.jsx
│       ├── MessageList.jsx
│       ├── MessageBubble.jsx
│       ├── ChatInput.jsx
│       ├── MenuItemCardChat.jsx   # (Phase 2)
│       └── ChatAssistant.module.css # Styles for chat components
├── data/
│   └── menuData.js                # (To be enhanced)
├── pages/
│   └── MenuPage/
│       └── MenuPage.jsx
├── services/
│   └── geminiService.js           # (To be extended)
└── App.jsx
```

## 7. Key Considerations & Next Steps

-   **Prompt Engineering:** This will be an iterative process. Getting high-quality, relevant, and correctly formatted responses from Gemini is key.
-   **User Experience:** Continuous testing and refinement of the chat flow and UI.
-   **Initial Decisions for User:**
    1.  Global chat (in `App.jsx`) or MenuPage-specific?
    2.  Confirmation to proceed with enhancing `menuData.js` (adding `dietaryTags`).

This plan provides a structured approach to developing the AI Chat Assistant. We can adjust and refine it as we progress.
