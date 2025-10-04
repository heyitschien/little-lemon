import React, { createContext, useState, useEffect } from 'react';
import type { MenuItem } from '../types/chat';

export interface CartItemModifier {
  id: string;
  name: string;
  priceDelta: number;
}

export type CartItem = MenuItem & {
  lineId: string;
  quantity: number;
  modifiers?: CartItemModifier[];
  notes?: string;
};

export interface CartContextValue {
  cartItems: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartTotal: number;
  addToCart: (item: MenuItem, options?: { modifiers?: CartItemModifier[]; notes?: string }) => void;
  removeFromCart: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
}

const STORAGE_KEY = 'littleLemonCart';

interface StoredCartItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  dietaryTags?: string[];
  image?: string;
  quantity: number;
  lineId?: string;
  modifiers?: CartItemModifier[];
  notes?: string;
}

const generateLineId = (): string => {
  if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `line_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const parseStoredCart = (value: string | null): CartItem[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }

    const sanitized: CartItem[] = [];

    parsed.forEach((item) => {
      if (typeof item !== 'object' || item === null) {
        return;
      }

      const record = item as StoredCartItem;
      if (
        typeof record.id !== 'number' ||
        typeof record.name !== 'string' ||
        typeof record.price !== 'number' ||
        typeof record.quantity !== 'number'
      ) {
        return;
      }

      const safeModifiers = Array.isArray(record.modifiers)
        ? record.modifiers.filter((modifier): modifier is CartItemModifier => {
            return (
              modifier !== null &&
              typeof modifier === 'object' &&
              typeof modifier.id === 'string' &&
              typeof modifier.name === 'string' &&
              typeof modifier.priceDelta === 'number'
            );
          })
        : undefined;

      sanitized.push({
        lineId: typeof record.lineId === 'string' ? record.lineId : generateLineId(),
        id: record.id,
        name: record.name,
        description: record.description ?? '',
        price: record.price,
        category: record.category ?? '',
        dietaryTags: Array.isArray(record.dietaryTags) ? record.dietaryTags : [],
        image: record.image ?? '',
        quantity: record.quantity,
        modifiers: safeModifiers,
        notes: typeof record.notes === 'string' ? record.notes : undefined
      });
    });

    return sanitized;
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => parseStoredCart(localStorage.getItem(STORAGE_KEY)));

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (item: MenuItem, options?: { modifiers?: CartItemModifier[]; notes?: string }) => {
    setCartItems(prevItems => {
      const modifiersKey = options?.modifiers?.map((modifier) => modifier.id).sort().join('|') ?? '';
      const notesKey = options?.notes?.trim() ?? '';

      const existingItemIndex = prevItems.findIndex(cartItem => {
        const existingModifiersKey = cartItem.modifiers?.map((modifier) => modifier.id).sort().join('|') ?? '';
        const existingNotesKey = cartItem.notes?.trim() ?? '';
        return cartItem.id === item.id && existingModifiersKey === modifiersKey && existingNotesKey === notesKey;
      });

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      }

      const newItem: CartItem = {
        ...item,
        lineId: generateLineId(),
        quantity: 1,
        modifiers: options?.modifiers,
        notes: notesKey || undefined
      };
      return [...prevItems, newItem];
    });
  };

  const removeFromCart = (lineId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.lineId !== lineId));
  };

  const updateQuantity = (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(lineId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.lineId === lineId ? { ...item, quantity } : item
      )
    );
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total number of items in cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calculate subtotal (items only)
  const cartSubtotal = cartItems.reduce((total, item) => {
    const modifiersTotal = item.modifiers?.reduce((sum, modifier) => sum + modifier.priceDelta, 0) ?? 0;
    const linePrice = (item.price + modifiersTotal) * item.quantity;
    return total + linePrice;
  }, 0);

  // For now total mirrors subtotal (fees to be added in later phases)
  const cartTotal = cartSubtotal;

  // Value to be provided by the context
  const value: CartContextValue = {
    cartItems,
    cartCount,
    cartSubtotal,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
