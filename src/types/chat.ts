export type ChatSender = 'user' | 'ai';

export interface MenuItemModifierOption {
  id: string;
  label: string;
  priceDelta: number;
}

export interface MenuItemModifierGroup {
  id: string;
  name: string;
  required?: boolean;
  maxSelections?: number;
  options: MenuItemModifierOption[];
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  dietaryTags: string[];
  image: string;
  modifierGroups?: MenuItemModifierGroup[];
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
