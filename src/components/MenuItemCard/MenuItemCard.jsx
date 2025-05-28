import React from 'react';
import styles from './MenuItemCard.module.css';
import { useCart } from '../../context/useCart';

const MenuItemCard = ({ item }) => {
  // Use the cart context to get the addToCart function - must be called before any conditional returns
  const { addToCart } = useCart();
  
  if (!item) {
    return null; // Or some placeholder/error
  }

  const { name, price, description, image } = item;
  
  // Function to handle adding item to cart
  const handleAddToCart = () => {
    addToCart(item);
    console.log(`Added ${name} to cart`);
  };

  return (
    <div className={styles.menuItemCard}>
      <div className={styles.menuItemImageContainer}>
        <img src={image} alt={name} className={styles.menuItemImage} />
      </div>
      <div className={styles.menuItemContent}>
        <div className={styles.menuItemHeader}>
          <h3 className={styles.menuItemTitle}>{name}</h3>
          <span className={styles.menuItemPrice}>{price}</span>
        </div>
        <p className={styles.menuItemDescription}>{description}</p>
        <div className={styles.menuItemFooter}>
          <button 
            className={`${styles.btn} ${styles.btnTertiary}`}
            onClick={handleAddToCart}
            aria-label={`Add ${name} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
