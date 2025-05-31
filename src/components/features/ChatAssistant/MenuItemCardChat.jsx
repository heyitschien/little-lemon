import React from 'react';
import styles from './ChatAssistant.module.css';
import { useCart } from '../../../context/useCart';

const MenuItemCardChat = ({ item }) => {
  // Use the cart context to get the addToCart function - must be called before any conditional returns
  const { addToCart } = useCart();
  
  if (!item) {
    return null;
  }
  
  // Function to handle adding item to cart
  const handleAddToCart = () => {
    addToCart(item);
    console.log(`Added ${item.name} to cart`);
  };

  return (
    <div className={styles.menuItemCardChat}>
      <img src={item.image} alt={item.name} className={styles.menuItemCardChatImage} />
      <div className={styles.menuItemCardChatDetails}>
        <h4 className={styles.menuItemCardChatName}>{item.name}</h4>
        <p className={styles.menuItemCardChatDescription}>{item.description}</p>
        <div className={styles.menuItemCardChatFooter}>
          <p className={styles.menuItemCardChatPrice}>${item.price.toFixed(2)}</p>
          <button 
            className={styles.addToCartButton}
            onClick={handleAddToCart}
            aria-label={`Add ${item.name} to cart`}
          >
            + Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCardChat;
