export type ChatSender = 'user' | 'ai';

export interface ChatMessage {
  id: string;
  text: string;
  sender: ChatSender;
  isLoading?: boolean;
  itemCards?: MenuItem[] | null;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  dietaryTags: string[];
}

export interface GeminiResponse {
  messageText: string;
  itemCards: MenuItem[];
}
