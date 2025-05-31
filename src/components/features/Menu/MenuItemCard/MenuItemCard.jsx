import React from 'react';
import styles from './MenuItemCard.module.css';
import { useCart } from '../../../../context/useCart';

const MenuItemCard = ({ item }) => {
  // Use the cart context to get the addToCart function
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
      <div className={styles.cardImageContainer}>
        <img src={image} alt={name} className={styles.cardImage} />
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{name}</h3>
        <p className={styles.cardDescription}>{description}</p>
        <div className={styles.cardPriceContainer}>
          <span className={styles.cardPrice}>${price.toFixed(2)}</span>
          <button 
            className={styles.addToCartButton}
            onClick={handleAddToCart}
            aria-label={`Add ${name} to cart`}
          >
            <span className={styles.plusIcon}>+</span>
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;