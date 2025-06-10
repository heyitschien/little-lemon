import React from 'react';
import styles from './CartMenuItemCard.module.css';
import { useCart } from '../../../context/useCart';
import Button from '../../../components/common/Button/Button';

const CartMenuItemCard = ({ item }) => {
  // Use the cart context to get the addToCart function
  const { addToCart } = useCart();
  
  if (!item) {
    return null;
  }

  const { name, price, description, image } = item;
  
  // Function to handle adding item to cart
  const handleAddToCart = () => {
    addToCart(item);
    console.log(`Added ${name} to cart`);
  };

  return (
    <div className={styles.menuItemCard}>
      <div className={styles.cardContent}>
        {/* Image and text are horizontally aligned */}
        <div className={styles.cardHeader}>
          <img src={image} alt={name} className={styles.cardImage} />
          <div className={styles.cardInfo}>
            <h3 className={styles.cardTitle}>{name}</h3>
            <p className={styles.cardDescription}>{description}</p>
          </div>
        </div>
        
        {/* Price and Add button */}
        <div className={styles.cardFooter}>
          <span className={styles.cardPrice}>${price.toFixed(2)}</span>
          <Button 
            className={styles.addButton}
            onClick={handleAddToCart}
            ariaLabel={`Add ${name} to cart`}
            variant="primary"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartMenuItemCard;
