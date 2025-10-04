import React, { useEffect, useRef } from 'react';
import styles from './MenuItemModal.module.css';
import { useCart } from '../../../../context/useCart';

const dietaryLabelMap = {
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  pescatarian: 'Pescatarian',
  'dairy-free': 'Dairy-Free',
  'gluten-free': 'Gluten-Free',
  'gluten-free-option': 'Gluten-Free Option',
  'contains-nuts': 'Contains Nuts'
};

const MenuItemModal = ({ item, onClose }) => {
  const { addToCart } = useCart();
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!item) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) {
    return null;
  }

  const { name, price, description, image, dietaryTags = [] } = item;

  const handleAddToCart = () => {
    addToCart(item);
    onClose();
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const formattedTags = dietaryTags.length
    ? dietaryTags.map((tag) => dietaryLabelMap[tag] || tag)
    : ['No specific dietary notes'];

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`menu-item-${item.id}-title`}
      onClick={handleOverlayClick}
    >
      <div className={styles.modalContent} role="document">
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close menu item details"
        >
          ×
        </button>

        <div className={styles.imageWrapper}>
          <img src={image} alt={name} className={styles.modalImage} />
        </div>

        <div className={styles.modalBody}>
          <h2 id={`menu-item-${item.id}-title`} className={styles.modalTitle}>
            {name}
          </h2>
          <p className={styles.modalDescription}>{description}</p>

          <div className={styles.tagList}>
            {formattedTags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.modalActions}>
          <span className={styles.price}>${price.toFixed(2)}</span>
          <button
            type="button"
            className={styles.addToCartButton}
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

export default MenuItemModal;
