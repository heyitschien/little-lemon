import React, { createContext, useState, useEffect } from 'react';
import type { MenuItem } from '../types/chat';

export type CartItem = MenuItem & { quantity: number };

export interface CartContextValue {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
}

const STORAGE_KEY = 'littleLemonCart';

const parseStoredCart = (value: string | null): CartItem[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map((item) => {
        if (typeof item !== 'object' || item === null) return null;
        const record = item as Partial<CartItem>;
        if (
          typeof record.id !== 'number' ||
          typeof record.name !== 'string' ||
          typeof record.price !== 'number' ||
          typeof record.quantity !== 'number'
        ) {
          return null;
        }
        return {
          id: record.id,
          name: record.name,
          description: record.description ?? '',
          price: record.price,
          category: record.category ?? '',
          dietaryTags: Array.isArray(record.dietaryTags) ? record.dietaryTags : [],
          image: record.image ?? '',
          quantity: record.quantity
        } satisfies CartItem;
      })
      .filter((item): item is CartItem => item !== null);
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

  const addToCart = (item: MenuItem) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(cartItem => cartItem.id === item.id);

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
        quantity: 1
      };
      return [...prevItems, newItem];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total number of items in cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate total price of items in cart
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Value to be provided by the context
  const value: CartContextValue = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
