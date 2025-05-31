import React, { useState, useEffect } from 'react';
import FloatingChatButton from './FloatingChatButton';
import ChatWindow from './ChatWindow';
import { sendMessageToGemini } from '../../../services/geminiService';
import { menuItems, menuCategories } from '../../../data/menuData'; // Import menu data

const INITIAL_WELCOME_MESSAGE = [
  {
    id: 'initial-welcome',
    text: "Hi there! I'm Lemon, your personal dining assistant. How can I help you find the perfect Mediterranean meal today? Feel free to ask about menu items, ingredients, or dietary options!",
    sender: 'ai',
    itemCards: null
  }
];

const ChatFeatureContainer = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [componentMenuItems, setComponentMenuItems] = useState([]);
  
  // Initialize messages state by trying to load from localStorage,
  // or defaulting to the welcome message if localStorage is empty.
  const [messages, setMessages] = useState(() => {
    try {
      const storedMessages = localStorage.getItem('chatMessages');
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        // Ensure messages array is not empty after parsing
        if (parsedMessages && parsedMessages.length > 0) {
          return parsedMessages;
        }
      }
    } catch (error) {
      console.error("Error loading messages from localStorage:", error);
      localStorage.removeItem('chatMessages'); // Clear corrupted data
    }
    // If no stored messages, error, or empty array from storage, return initial welcome message
    return INITIAL_WELCOME_MESSAGE;
  });

  const [isSending, setIsSending] = useState(false);

  // Create a deep copy of menuItems on component mount
  useEffect(() => {
    try {
      setComponentMenuItems(JSON.parse(JSON.stringify(menuItems)));
    } catch (e) {
      console.error("Failed to deep copy menuItems:", e);
      // Fallback to direct import if deep copy fails, though this is not ideal
      setComponentMenuItems(menuItems);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Save messages to localStorage whenever they change
  useEffect(() => {
    // The initial state now always has at least the welcome message or loaded messages.
    // So, we can directly save.
    if (messages && messages.length > 0) {
      try {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
      } catch (error) {
        console.error("Error saving messages to localStorage:", error);
      }
    }
  }, [messages]); // This runs whenever the messages state changes

  const toggleChatWindow = () => {
    setIsChatOpen(prev => !prev);
  };

  const closeChatWindow = () => {
    setIsChatOpen(false);
  };

  const handleClearChat = () => {
    setMessages(INITIAL_WELCOME_MESSAGE);
    try {
      localStorage.removeItem('chatMessages');
    } catch (error) {
      console.error("Error removing chatMessages from localStorage:", error);
    }
    // Optionally, you might want to add a new welcome message after clearing,
    // or ensure the input field is also cleared if needed.
  };

  const constructMenuContext = () => {
    // Basic context construction. This can be refined.
    let context = "Here is the Little Lemon menu information:\n\nCategories: " + menuCategories.join(', ') + "\n\nItems:\n";
    componentMenuItems.forEach(item => {
      context += `- Name: ${item.name}, Description: ${item.description}, Price: ${item.price}, Category: ${item.category}, Dietary Tags: ${item.dietaryTags.join(', ') || 'none'}\n`;
    });
    return context;
  };

  // Clean the AI's text for the prompt (remove item IDs)
  function cleanMessageForPrompt(text) {
    if (typeof text === 'string') {
      return text.replace(/\[ITEM_IDS:.*?\]/g, '').trim();
    }
    return '';
  }

  const handleSendMessage = async (userInput) => {
    if (!userInput.trim()) return;

    const newUserMessage = { id: Date.now(), text: userInput, sender: 'user', itemCards: null };
    
    // Create a unique ID for the AI's placeholder loading message
    const aiLoadingMessageId = Date.now() + 1; 
    const aiLoadingMessage = {
      id: aiLoadingMessageId,
      text: '', // No text, will be replaced by loading indicator
      sender: 'ai',
      isLoading: true, // Special flag
      itemCards: null
    };

    // Add both user message and AI loading placeholder
    // Use a temporary variable for messages to build history correctly before setting state
    const updatedMessages = [...messages, newUserMessage, aiLoadingMessage];
    setMessages(updatedMessages);
    setIsSending(true);

    // Construct the menu context
    const menuContext = constructMenuContext();

    // Get the last few messages for context (excluding the loading message)
    const messagesForContext = updatedMessages.slice(0, -1); // Exclude the loading message
    const conversationHistoryForPrompt = messagesForContext
      .slice(-3) // Get last 3 messages (user and 2 prior, or fewer if not available)
      .map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${cleanMessageForPrompt(msg.text)}`)
      .join('\n');
    
    // Updated prompt with clearer instructions about item IDs
    let promptForAI = `CONVERSATIONAL HISTORY (if any, most recent first):
${conversationHistoryForPrompt}

MENU CONTEXT:
${menuContext}

USER QUERY (Please answer this query based on the menu and conversation history. IMPORTANT: If you recommend specific menu items, you MUST include all their numeric IDs in a single block at the VERY END of your entire response, formatted EXACTLY like this: [ITEM_IDS:1,2,3,...] or [ITEM_IDS:id1,id2,id3,...]. Use ONLY the numeric IDs from the menu data. Do not put IDs anywhere else.):
${userInput}`;

    if (!conversationHistoryForPrompt.trim()) {
      promptForAI = `MENU CONTEXT:
${menuContext}

USER QUERY (Please answer this query based on the menu. IMPORTANT: If you recommend specific menu items, you MUST include all their numeric IDs in a single block at the VERY END of your entire response, formatted EXACTLY like this: [ITEM_IDS:1,2,3,...] or [ITEM_IDS:id1,id2,id3,...]. Use ONLY the numeric IDs from the menu data. Do not put IDs anywhere else.):
${userInput}`;
    }
    console.log("Prompt to AI:", promptForAI); // For debugging

    try {
      const rawAiResponse = await sendMessageToGemini(promptForAI);
      console.log("Raw AI Response:", rawAiResponse); 
      
      const itemExtractionRegex = /\[ITEM_IDS:([\w\s,-_]+)\](?=\s*$|\s*\n)/; // Looks for [ITEM_IDS:...] at the end
      const match = rawAiResponse.match(itemExtractionRegex);
      
      const itemIDsString = match ? match[1] : null;
      const messageText = match ? rawAiResponse.replace(itemExtractionRegex, '').trim() : rawAiResponse.trim();
      
      let itemCardDetails = [];

      if (itemIDsString) {
        const ids = itemIDsString.split(',').map(idStr => idStr.trim()).filter(idStr => idStr);
        
        // Process each ID or item name from the AI response
        itemCardDetails = ids.map(idStr => { 
          // Try to find by numeric ID first (with or without 'id' prefix)
          const numericIdString = idStr.replace(/^id/i, ''); 
          const numericId = parseInt(numericIdString, 10);   

          // If we got a valid numeric ID
          if (!isNaN(numericId)) {
            const foundItem = componentMenuItems.find(item => item.id === numericId);
            
            if (foundItem) {
              return foundItem;
            } else {
              console.warn(`Item with numeric ID ${numericId} not found in menuData.`);
            }
          } else {
            console.warn(`Parsed ID '${idStr}' from AI response resulted in NaN after attempting to convert to number.`);
          }

          // If numeric ID approach failed, try to match by name
          // First, try exact match (case-insensitive)
          const foundByExactName = componentMenuItems.find(
            item => item.name.toLowerCase() === idStr.toLowerCase()
          );
          
          if (foundByExactName) {
            console.log(`Found item by exact name match: ${foundByExactName.name} (ID: ${foundByExactName.id})`);
            return foundByExactName;
          }
          
          // If exact match fails, try matching by normalized name (convert spaces/underscores)
          const normalizedIdStr = idStr.toLowerCase().replace(/_/g, ' ');
          const foundByNormalizedName = componentMenuItems.find(
            item => item.name.toLowerCase() === normalizedIdStr
          );
          
          if (foundByNormalizedName) {
            console.log(`Found item by normalized name match: ${foundByNormalizedName.name} (ID: ${foundByNormalizedName.id})`);
            return foundByNormalizedName;
          }
          
          // If all else fails, try partial match (item name contains the ID string or vice versa)
          const foundByPartialMatch = componentMenuItems.find(
            item => item.name.toLowerCase().includes(normalizedIdStr) || 
                   normalizedIdStr.includes(item.name.toLowerCase())
          );
          
          if (foundByPartialMatch) {
            console.log(`Found item by partial name match: ${foundByPartialMatch.name} (ID: ${foundByPartialMatch.id})`);
            return foundByPartialMatch;
          }
          
          console.warn(`Could not find menu item matching '${idStr}' by any method.`);
          return null;
        }).filter(item => item); // Remove any null entries
      }
      
      // Verification step: Check if the AI's text mentions items that aren't in the itemCardDetails
      // This helps catch mismatches between text and cards
      if (messageText && itemCardDetails.length > 0) {
        // Create a list of item names from the cards we found
        const cardItemNames = itemCardDetails.map(item => item.name.toLowerCase());
        
        // Check if any menu items are mentioned in the text but not in the cards
        const mentionedButMissing = componentMenuItems.filter(menuItem => {
          // Check if the item name is mentioned in the message text
          const isItemMentioned = messageText.toLowerCase().includes(menuItem.name.toLowerCase());
          // Check if this mentioned item is NOT in our card details
          const isInCardDetails = cardItemNames.includes(menuItem.name.toLowerCase());
          return isItemMentioned && !isInCardDetails;
        });
        
        // If we found mentioned items that aren't in the cards, add them
        if (mentionedButMissing.length > 0) {
          console.log(`Found ${mentionedButMissing.length} items mentioned in text but missing from cards:`, 
            mentionedButMissing.map(item => item.name));
          
          // Add these missing items to our card details
          itemCardDetails = [...itemCardDetails, ...mentionedButMissing];
          
          // Log the updated item cards
          console.log("Updated itemCardDetails after text verification:", 
            itemCardDetails.map(item => item.name));
        }
      }

      console.log("ChatFeatureContainer: itemCardDetails for AI message:", 
        JSON.stringify(itemCardDetails.map(item => ({id: item.id, name: item.name}))));

      const finalAiMessage = {
        id: aiLoadingMessageId, 
        text: messageText, // Use the text with [ITEM_IDS:...] removed (if present)
        sender: 'ai',
        isLoading: false, 
        itemCards: itemCardDetails.length > 0 ? itemCardDetails : null
      };

      // Update the loading message with the AI's actual response
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === aiLoadingMessageId ? finalAiMessage : msg
        )
      );

    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      const errorAiMessage = {
        id: aiLoadingMessageId, // Use the same ID
        text: "Sorry, I'm having a little trouble connecting right now. Please try again in a moment.",
        sender: 'ai',
        isLoading: false, // Turn off loading
        itemCards: null
      };
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === aiLoadingMessageId ? errorAiMessage : msg
        )
      );
    } finally {
      setIsSending(false);
    }
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
        onClearChat={handleClearChat} // Pass the new handler
      />
    </>
  );
};

export default ChatFeatureContainer;
