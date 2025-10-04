export type ChatSender = 'user' | 'ai';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  dietaryTags: string[];
  image: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: ChatSender;
  isLoading?: boolean;
  itemCards?: MenuItem[] | null;
}

export interface GeminiResponse {
  messageText: string;
  itemCards: MenuItem[];
}

export type ChatStorageKey = 'chatMessages';

export type ChatMessageList = ChatMessage[];
