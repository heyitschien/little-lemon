# Little Lemon AI Chat Assistant Documentation

## Overview

The Little Lemon AI Chat Assistant provides an interactive way for customers to get information about the restaurant's menu items. It uses the Gemini AI API to generate contextually relevant responses and displays rich menu item cards when specific dishes are recommended.

## Model Information

- **API**: Google Gemini API
- **Model**: `gemma-3-27b-it` (Free tier model)
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent`

## Complete Setup Guide

### Prerequisites

1. A React project set up with a modern bundler (like Vite)
2. A Google Gemini API key (can be obtained from [Google AI Studio](https://makersuite.google.com/))
3. Basic menu data structure with items, descriptions, and images

### File Structure

```
src/
├── components/
│   └── ChatAssistant/
│       ├── ChatAssistant.module.css
│       ├── ChatFeatureContainer.jsx
│       ├── ChatInput.jsx
│       ├── ChatWindow.jsx
│       ├── ErrorBoundary.jsx
│       ├── FloatingChatButton.jsx
│       ├── LoadingIndicator.jsx
│       ├── MenuItemCardChat.jsx
│       └── MessageBubble.jsx
├── services/
│   └── geminiService.js
├── data/
│   └── menuData.js
└── assets/
    └── images/
        └── [menu item images]
```

### Environment Setup

Create a `.env` file in your project root with your Gemini API key:

```
VITE_REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

### Component Implementation

#### 1. geminiService.js

```javascript
import { menuItems as allMenuItems } from '../data/menuData'; // Import all menu items

const API_KEY = import.meta.env.VITE_REACT_APP_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent?key=${API_KEY}`;

// Helper function to get a random subset of item names for the prompt
const getRandomMenuItemsPrompt = (items, count = 3) => {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(item => item.name).join(', ');
};

export const sendMessageToGemini = async (promptText) => {
  if (!API_KEY) {
    console.error("Gemini API Key is missing. Please set VITE_REACT_APP_GEMINI_API_KEY in your .env file.");
    throw new Error("API Key missing. Cannot send message.");
  }

  // Add system instructions as part of the user prompt instead of using system role
  // This is more compatible with different Gemini models
  const systemInstructions = `
===SYSTEM INSTRUCTIONS (FOLLOW THESE EXACTLY)===
You are Lemon, the Little Lemon restaurant's AI assistant. When recommending menu items, you MUST:
1. ONLY recommend items that actually exist in our menu (with exact IDs 1-12)
2. ALWAYS include the numeric IDs at the end of your response in this exact format: [ITEM_IDS:1,2,3]
3. Make sure your item recommendations match what you describe in your text
4. NEVER make up menu items or IDs that don't exist
5. If recommending items for dietary restrictions (vegan, vegetarian, etc.), verify the items actually have those dietary tags
===END SYSTEM INSTRUCTIONS===

`;

  // Combine system instructions with user prompt
  const combinedPrompt = systemInstructions + promptText;

  const payload = {
    contents: [{ role: "user", parts: [{ text: combinedPrompt }] }],
    generationConfig: {
      temperature: 0.2, // Lower temperature for more consistent outputs
      maxOutputTokens: 1024,
    }
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Error from Gemini API:', response.status, errorBody);
      throw new Error(`Gemini API request failed with status ${response.status}: ${errorBody}`);
    }

    const data = await response.json();

    // Standard path for Gemini text response
    if (data.candidates && data.candidates.length > 0 &&
        data.candidates[0].content && data.candidates[0].content.parts &&
        data.candidates[0].content.parts.length > 0 &&
        typeof data.candidates[0].content.parts[0].text === 'string') {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error('Unexpected response structure from Gemini API:', data);
      throw new Error("Received an unexpected response structure from the AI.");
    }

  } catch (error) {
    console.error('Network or other error calling Gemini API:', error);
    throw error;
  }
};
```

#### 2. menuData.js

```javascript
// Import images
import bruschettaImg from '../assets/images/bruchetta.svg';
// Import other images...

export const menuCategories = [
  "Appetizers",
  "Main Courses",
  "Desserts",
  "Drinks"
];

export const menuItems = [
  // Appetizers
  {
    id: 1,
    category: "Appetizers",
    name: "Bruschetta",
    price: 8.99,
    description: "Grilled bread rubbed with garlic and topped with fresh tomatoes, basil, and a drizzle of balsamic glaze.",
    image: bruschettaImg,
    dietaryTags: ["vegetarian", "vegan", "dairy-free"]
  },
  // Add more menu items...
];
```

#### 3. ChatFeatureContainer.jsx

```jsx
import React, { useState, useEffect } from 'react';
import FloatingChatButton from './FloatingChatButton';
import ChatWindow from './ChatWindow';
import { sendMessageToGemini } from '../../services/geminiService';
import { menuItems, menuCategories } from '../../data/menuData';

const ChatFeatureContainer = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [componentMenuItems, setComponentMenuItems] = useState([]);
  const [messages, setMessages] = useState(() => {
    try {
      const storedMessages = localStorage.getItem('chatMessages');
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        if (parsedMessages && parsedMessages.length > 0) {
          return parsedMessages;
        }
      }
    } catch (error) {
      console.error("Error loading messages from localStorage:", error);
    }
    return [
      {
        id: Date.now(),
        text: "Hi there! I'm Lemon, your personal dining assistant. How can I help you find the perfect Mediterranean meal today?",
        sender: 'ai',
        itemCards: null
      }
    ];
  });

  const [isSending, setIsSending] = useState(false);

  // Create a deep copy of menuItems on component mount
  useEffect(() => {
    try {
      setComponentMenuItems(JSON.parse(JSON.stringify(menuItems)));
    } catch (e) {
      console.error("Failed to deep copy menuItems:", e);
      setComponentMenuItems(menuItems);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages && messages.length > 0) {
      try {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
      } catch (error) {
        console.error("Error saving messages to localStorage:", error);
      }
    }
  }, [messages]);

  const toggleChatWindow = () => {
    setIsChatOpen(prev => !prev);
  };

  const closeChatWindow = () => {
    setIsChatOpen(false);
  };

  const constructMenuContext = () => {
    let context = "Here is the Little Lemon menu information:\n\nCategories: " + menuCategories.join(', ') + "\n\nItems:\n";
    componentMenuItems.forEach(item => {
      context += `- Name: ${item.name}, Description: ${item.description}, Price: ${item.price}, Category: ${item.category}, Dietary Tags: ${item.dietaryTags.join(', ') || 'none'}, ID: ${item.id}\n`;
    });
    return context;
  };

  function cleanMessageForPrompt(text) {
    if (typeof text === 'string') {
      return text.replace(/\[ITEM_IDS:.*?\]/g, '').trim();
    }
    return '';
  }

  const handleSendMessage = async (userInput) => {
    // Message handling code with robust item parsing
    // See full implementation in the GitHub repository
    // Key parts include:
    // 1. Multi-tiered item matching
    // 2. Text verification
    // 3. Error handling
  };

  return (
    <>
      <FloatingChatButton onClick={toggleChatWindow} />
      <ChatWindow 
        isOpen={isChatOpen} 
        onClose={closeChatWindow}
        messages={messages}
        onSendMessage={handleSendMessage}
        isSending={isSending}
      />
    </>
  );
};

export default ChatFeatureContainer;
```

#### 4. MessageBubble.jsx

```jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './ChatAssistant.module.css';
import MenuItemCardChat from './MenuItemCardChat';
import ErrorBoundary from './ErrorBoundary';
import LoadingIndicator from './LoadingIndicator';

const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'user';
  const bubbleClass = isUser ? styles.userMessage : styles.aiMessage;
  const alignClass = isUser ? styles.messageRight : styles.messageLeft;

  const cleanMessageText = (text) => {
    if (typeof text === 'string') {
      return text.replace(/\[ITEM_IDS:.*?\]/g, '').trim();
    }
    return '';
  };

  const displayMessageText = cleanMessageText(message.text);

  if (message.sender === 'ai' && message.itemCards && message.itemCards.length > 0) {
    console.log(`MessageBubble: Rendering itemCards for AI message id ${message.id}:`, 
      JSON.stringify(message.itemCards.map(item => item ? {id: item.id, name: item.name} : {id: 'null_item'})));
  }

  return (
    <div className={`${styles.messageBubbleContainer} ${alignClass}`}>
      <div className={`${styles.messageBubble} ${bubbleClass}`}>
        {isUser ? (
          <ReactMarkdown>{message.text}</ReactMarkdown>
        ) : message.isLoading ? (
          <LoadingIndicator />
        ) : (
          <ErrorBoundary>
            {displayMessageText && <ReactMarkdown>{displayMessageText}</ReactMarkdown>}
            {message.itemCards && message.itemCards.length > 0 && (
              <div className={styles.itemCardsContainer}>
                {message.itemCards.map((item) => (
                  item ? <MenuItemCardChat key={item.id} item={item} /> : null
                ))}
              </div>
            )}
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
```

#### 5. MenuItemCardChat.jsx

```jsx
import React from 'react';
import styles from './ChatAssistant.module.css';

const MenuItemCardChat = ({ item }) => {
  if (!item) {
    return null;
  }

  return (
    <div className={styles.menuItemCardChat}>
      <img src={item.image} alt={item.name} className={styles.menuItemCardChatImage} />
      <div className={styles.menuItemCardChatDetails}>
        <h4 className={styles.menuItemCardChatName}>{item.name}</h4>
        <p className={styles.menuItemCardChatDescription}>{item.description}</p>
        <p className={styles.menuItemCardChatPrice}>${item.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default MenuItemCardChat;
```

### CSS Styling

Create `ChatAssistant.module.css` with styles for all chat components:

```css
/* Chat button */
.floatingChatButton {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #495E57;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  transition: all 0.3s ease;
}

.floatingChatButton:hover {
  background-color: #F4CE14;
  color: #333333;
  transform: scale(1.05);
}

/* Chat window */
.chatWindowOverlay {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 350px;
  height: 500px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  transition: all 0.3s ease;
}

.chatWindowHeader {
  background-color: #495E57;
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chatWindowTitle {
  margin: 0;
  font-family: 'Markazi Text', serif;
  font-size: 1.5rem;
}

.closeButton {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.messagesContainer {
  flex-grow: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.inputContainer {
  padding: 10px;
  border-top: 1px solid #EDEFEE;
  display: flex;
  gap: 10px;
}

.messageInput {
  flex-grow: 1;
  padding: 10px 15px;
  border: 1px solid #EDEFEE;
  border-radius: 20px;
  font-family: 'Karla', sans-serif;
  font-size: 0.9rem;
}

.sendButton {
  background-color: #F4CE14;
  color: #333333;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-family: 'Karla', sans-serif;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sendButton:hover {
  background-color: #495E57;
  color: white;
}

/* Message bubbles */
.messageBubbleContainer {
  display: flex;
  margin-bottom: 10px;
  max-width: 100%;
}

.messageLeft {
  justify-content: flex-start;
}

.messageRight {
  justify-content: flex-end;
}

.messageBubble {
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 16px;
  font-family: 'Karla', sans-serif;
  font-size: 0.9rem;
  line-height: 1.4;
}

.messageBubble p {
  margin: 0 0 8px 0;
}

.messageBubble p:last-child {
  margin-bottom: 0;
}

.userMessage {
  background-color: #F4CE14;
  color: #333333;
  border-top-right-radius: 4px;
}

.aiMessage {
  background-color: #EDEFEE;
  color: #333333;
  border-top-left-radius: 4px;
}

/* Menu item cards */
.itemCardsContainer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.menuItemCardChat {
  display: flex;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.menuItemCardChatImage {
  width: 80px;
  height: 80px;
  object-fit: cover;
}

.menuItemCardChatDetails {
  padding: 8px 12px;
  flex-grow: 1;
}

.menuItemCardChatName {
  margin: 0 0 4px 0;
  font-size: 0.9rem;
  font-weight: bold;
  color: #495E57;
}

.menuItemCardChatDescription {
  margin: 0 0 4px 0;
  font-size: 0.75rem;
  color: #333333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.menuItemCardChatPrice {
  margin: 0;
  font-size: 0.9rem;
  font-weight: bold;
  color: #EE9972;
}

/* Quick reply buttons */
.quickRepliesContainer {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.quickReplyButton {
  background-color: #EDEFEE;
  border: 1px solid #DDDDDD;
  border-radius: 16px;
  padding: 8px 12px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quickReplyButton:hover {
  background-color: #F4CE14;
}

/* Loading indicator */
.loadingIndicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.loadingDot {
  width: 8px;
  height: 8px;
  background-color: #495E57;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loadingDot:nth-child(1) { animation-delay: -0.32s; }
.loadingDot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
}
```

### Integration Steps

1. **Set up the API Key**:
   - Create a `.env` file with your Gemini API key
   - Make sure your bundler is configured to use environment variables

2. **Import the Chat Feature**:
   ```jsx
   import ChatFeatureContainer from './components/ChatAssistant/ChatFeatureContainer';
   
   function App() {
     return (
       <div className="app">
         {/* Your other components */}
         <ChatFeatureContainer />
       </div>
     );
   }
   ```

3. **Prepare Menu Data**:
   - Ensure your `menuData.js` file has the correct structure with:
     - Unique numeric IDs for each item
     - Complete item details (name, description, price, image)
     - Dietary tags for filtering

4. **Test the Integration**:
   - Verify the chat button appears in your application
   - Test various queries about menu items
   - Confirm that menu cards display correctly

## Troubleshooting

### API Connection Issues

If you encounter connection issues with the Gemini API:

1. **Check your API key** is correctly set in the `.env` file
2. **Verify the API endpoint** is correct for the model you're using
3. **Check the console** for specific error messages
4. **Ensure your prompt format** is compatible with the model

### Menu Card Display Issues

If menu cards aren't displaying correctly:

1. **Check the console logs** for parsing warnings
2. **Verify your menu data structure** matches what the code expects
3. **Ensure images are correctly imported** and accessible
4. **Test the text verification feature** by logging mentioned items

## Performance Considerations

- The chat history is stored in localStorage, which has a size limit (typically 5-10MB)
- Consider implementing a maximum history length to prevent exceeding storage limits
- Large menu datasets might need pagination or lazy loading for optimal performance
- The free Gemini model has rate limits that may affect heavy usage scenarios

## Usage Examples

```jsx
// Basic integration
import ChatFeatureContainer from './components/ChatAssistant/ChatFeatureContainer';

function App() {
  return (
    <div className="app">
      <Header />
      <Main />
      <Footer />
      <ChatFeatureContainer /> {/* Chat feature will appear as a floating button */}
    </div>
  );
}

// With custom styling
import ChatFeatureContainer from './components/ChatAssistant/ChatFeatureContainer';
import './custom-chat-styles.css'; // Override default styles

function App() {
  return (
    <div className="app custom-theme">
      <Header />
      <Main />
      <Footer />
      <ChatFeatureContainer />
    </div>
  );
}
```
