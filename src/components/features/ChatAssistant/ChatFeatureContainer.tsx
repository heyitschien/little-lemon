import React, { useEffect, useState } from 'react';
import FloatingChatButton from './FloatingChatButton';
import ChatWindow from './ChatWindow';
import { sendMessageToGemini } from '../../../services/geminiService';
import { menuItems, menuCategories } from '../../../data/menuData';
import type {
  ChatMessage,
  ChatMessageList,
  ChatStorageKey,
  MenuItem
} from '../../../types/chat';

const LOCAL_STORAGE_KEY: ChatStorageKey = 'chatMessages';

const INITIAL_WELCOME_MESSAGE: ChatMessageList = [
  {
    id: 'initial-welcome',
    text: "Hi there! I'm Lemon, your personal dining assistant. How can I help you find the perfect Mediterranean meal today? Feel free to ask about menu items, ingredients, or dietary options!",
    sender: 'ai',
    itemCards: null
  }
];

const generateMessageId = (): string => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const sanitizeMenuItem = (value: unknown): MenuItem | null => {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const record = value as Partial<MenuItem>;
  if (
    typeof record.id !== 'number' ||
    typeof record.name !== 'string' ||
    typeof record.description !== 'string' ||
    typeof record.price !== 'number' ||
    typeof record.category !== 'string' ||
    typeof record.image !== 'string' ||
    !Array.isArray(record.dietaryTags) ||
    !record.dietaryTags.every(tag => typeof tag === 'string')
  ) {
    return null;
  }

  return {
    id: record.id,
    name: record.name,
    description: record.description,
    price: record.price,
    category: record.category,
    dietaryTags: record.dietaryTags,
    image: record.image
  };
};

const sanitizeChatMessage = (value: unknown): ChatMessage | null => {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const record = value as Partial<ChatMessage> & { itemCards?: unknown };
  if (
    typeof record.id !== 'string' ||
    typeof record.text !== 'string' ||
    (record.sender !== 'user' && record.sender !== 'ai')
  ) {
    return null;
  }

  let itemCards: MenuItem[] | null | undefined = null;
  if (Array.isArray(record.itemCards)) {
    const sanitizedCards = record.itemCards
      .map(sanitizeMenuItem)
      .filter((item): item is MenuItem => item !== null);
    itemCards = sanitizedCards.length > 0 ? sanitizedCards : null;
  } else if (record.itemCards === null) {
    itemCards = null;
  }

  return {
    id: record.id,
    text: record.text,
    sender: record.sender,
    isLoading: typeof record.isLoading === 'boolean' ? record.isLoading : undefined,
    itemCards
  };
};

const parseStoredMessages = (value: string | null): ChatMessageList | null => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return null;
    }

    const sanitized = parsed
      .map(sanitizeChatMessage)
      .filter((message): message is ChatMessage => message !== null);

    return sanitized.length > 0 ? sanitized : null;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error loading messages from localStorage:', error);
    }
    return null;
  }
};

const loadStoredMessages = (): ChatMessageList => {
  if (typeof window === 'undefined') {
    return INITIAL_WELCOME_MESSAGE;
  }

  try {
    const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    const parsed = parseStoredMessages(stored);
    return parsed ?? INITIAL_WELCOME_MESSAGE;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error loading chat messages from localStorage:', error);
    }
    return INITIAL_WELCOME_MESSAGE;
  }
};

const ChatFeatureContainer: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [componentMenuItems, setComponentMenuItems] = useState<MenuItem[]>(() => menuItems.map(item => ({ ...item })));
  const [messages, setMessages] = useState<ChatMessageList>(() => loadStoredMessages());
  const [isSending, setIsSending] = useState<boolean>(false);

  useEffect(() => {
    setComponentMenuItems(menuItems.map(item => ({ ...item })));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (messages.length === 0) {
      return;
    }

    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error saving messages to localStorage:', error);
      }
    }
  }, [messages]);

  const toggleChatWindow = () => {
    setIsChatOpen(prev => !prev);
  };

  const closeChatWindow = () => {
    setIsChatOpen(false);
  };

  const handleClearChat = () => {
    setMessages(INITIAL_WELCOME_MESSAGE.map(message => ({ ...message })));

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error removing chatMessages from localStorage:', error);
        }
      }
    }
  };

  const constructMenuContext = (): string => {
    const categoryList = menuCategories.join(', ');
    const itemsDescription = componentMenuItems
      .map(item => `- Name: ${item.name}, Description: ${item.description}, Price: ${item.price}, Category: ${item.category}, Dietary Tags: ${item.dietaryTags.length > 0 ? item.dietaryTags.join(', ') : 'none'}`)
      .join('\n');

    return `Here is the Little Lemon menu information:\n\nCategories: ${categoryList}\n\nItems:\n${itemsDescription}`;
  };

  const cleanMessageForPrompt = (text: string): string => text.replace(/\[ITEM_IDS:.*?\]/g, '').trim();

  const handleSendMessage = async (userInput: string): Promise<void> => {
    const trimmedInput = userInput.trim();
    if (!trimmedInput) {
      return;
    }

    const newUserMessage: ChatMessage = {
      id: generateMessageId(),
      text: trimmedInput,
      sender: 'user',
      itemCards: null
    };

    const aiLoadingMessageId = generateMessageId();
    const aiLoadingMessage: ChatMessage = {
      id: aiLoadingMessageId,
      text: '',
      sender: 'ai',
      isLoading: true,
      itemCards: null
    };

    const nextMessages: ChatMessageList = [...messages, newUserMessage, aiLoadingMessage];
    setMessages(nextMessages);
    setIsSending(true);

    const menuContext = constructMenuContext();
    const messagesForContext = nextMessages.slice(0, -1);
    const conversationHistoryForPrompt = messagesForContext
      .slice(-3)
      .map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${cleanMessageForPrompt(msg.text)}`)
      .join('\n');

    let promptForAI = `CONVERSATIONAL HISTORY (if any, most recent first):
${conversationHistoryForPrompt}

MENU CONTEXT:
${menuContext}

USER QUERY (Please answer this query based on the menu and conversation history. IMPORTANT: If you recommend specific menu items, you MUST include all their numeric IDs in a single block at the VERY END of your entire response, formatted EXACTLY like this: [ITEM_IDS:1,2,3,...] or [ITEM_IDS:id1,id2,id3,...]. Use ONLY the numeric IDs from the menu data. Do not put IDs anywhere else.):
${trimmedInput}`;

    if (!conversationHistoryForPrompt.trim()) {
      promptForAI = `MENU CONTEXT:
${menuContext}

USER QUERY (Please answer this query based on the menu. IMPORTANT: If you recommend specific menu items, you MUST include all their numeric IDs in a single block at the VERY END of your entire response, formatted EXACTLY like this: [ITEM_IDS:1,2,3,...] or [ITEM_IDS:id1,id2,id3,...]. Use ONLY the numeric IDs from the menu data. Do not put IDs anywhere else.):
${trimmedInput}`;
    }

    try {
      const rawAiResponse = await sendMessageToGemini(promptForAI);

      const itemExtractionRegex = /\[ITEM_IDS:([\w\s,-_]+)\](?=\s*$|\s*\n)/;
      const match = rawAiResponse.match(itemExtractionRegex);

      const itemIDsString = match ? match[1] : null;
      const messageText = match ? rawAiResponse.replace(itemExtractionRegex, '').trim() : rawAiResponse.trim();

      let itemCardDetails: MenuItem[] = [];

      if (itemIDsString) {
        const ids = itemIDsString
          .split(',')
          .map(idStr => idStr.trim())
          .filter(idStr => idStr.length > 0);

        itemCardDetails = ids
          .map(idStr => {
            const numericIdString = idStr.replace(/^id/i, '');
            const numericId = Number.parseInt(numericIdString, 10);

            if (!Number.isNaN(numericId)) {
              const foundById = componentMenuItems.find(item => item.id === numericId);
              if (foundById) {
                return foundById;
              }
            }

            const exactMatch = componentMenuItems.find(item => item.name.toLowerCase() === idStr.toLowerCase());
            if (exactMatch) {
              return exactMatch;
            }

            const normalizedIdStr = idStr.toLowerCase().replace(/_/g, ' ');
            const normalizedMatch = componentMenuItems.find(item => item.name.toLowerCase() === normalizedIdStr);
            if (normalizedMatch) {
              return normalizedMatch;
            }

            const partialMatch = componentMenuItems.find(item =>
              item.name.toLowerCase().includes(normalizedIdStr) ||
              normalizedIdStr.includes(item.name.toLowerCase())
            );

            return partialMatch ?? null;
          })
          .filter((item): item is MenuItem => item !== null);
      }

      if (messageText && itemCardDetails.length > 0) {
        const cardItemNameSet = new Set(itemCardDetails.map(item => item.name.toLowerCase()));

        const mentionedButMissing = componentMenuItems.filter(menuItem => {
          const lowerCaseName = menuItem.name.toLowerCase();
          return messageText.toLowerCase().includes(lowerCaseName) && !cardItemNameSet.has(lowerCaseName);
        });

        if (mentionedButMissing.length > 0) {
          itemCardDetails = [...itemCardDetails, ...mentionedButMissing];
        }
      }

      const finalAiMessage: ChatMessage = {
        id: aiLoadingMessageId,
        text: messageText,
        sender: 'ai',
        isLoading: false,
        itemCards: itemCardDetails.length > 0 ? itemCardDetails : null
      };

      setMessages(prevMessages =>
        prevMessages.map(msg => (msg.id === aiLoadingMessageId ? finalAiMessage : msg))
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error sending message to Gemini:', error);
      }

      const errorAiMessage: ChatMessage = {
        id: aiLoadingMessageId,
        text: "Sorry, I'm having a little trouble connecting right now. Please try again in a moment.",
        sender: 'ai',
        isLoading: false,
        itemCards: null
      };

      setMessages(prevMessages =>
        prevMessages.map(msg => (msg.id === aiLoadingMessageId ? errorAiMessage : msg))
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
        onClearChat={handleClearChat}
      />
    </>
  );
};

export default ChatFeatureContainer;
