import React, { useEffect, useRef } from 'react';
import styles from './CartSummaryDrawer.module.css';
import Button from '../../../common/Button/Button';
import { useCart } from '../../../../context/useCart';

const CartSummaryDrawer = ({ isOpen, onClose }) => {
  const drawerRef = useRef(null);
  const { cartItems, cartSubtotal, cartTotal, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const previouslyFocused = document.activeElement;
    drawerRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
      onClick={handleOverlayClick}
      aria-hidden={!isOpen}
    >
      <aside
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-summary-heading"
        tabIndex={-1}
        ref={drawerRef}
      >
        <div className={styles.drawerHeader}>
          <h2 id="cart-summary-heading">Your Order</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close cart summary"
          >
            ×
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Your cart is currently empty.</p>
            <Button to="/menu" variant="primary" ariaLabel="Browse menu">
              Browse Menu
            </Button>
          </div>
        ) : (
          <>
            <div className={styles.itemsList}>
              {cartItems.map((item) => (
                <article key={item.lineId} className={styles.cartItem}>
                  <div className={styles.itemInfo}>
                    <h3>{item.name}</h3>
                    {item.modifiers && item.modifiers.length > 0 && (
                      <ul className={styles.modifierList}>
                        {item.modifiers.map((modifier) => (
                          <li key={modifier.id}>
                            {modifier.name}
                            {modifier.priceDelta > 0 && ` (+$${modifier.priceDelta.toFixed(2)})`}
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.notes && <p className={styles.itemNotes}>“{item.notes}”</p>}
                  </div>
                  <div className={styles.itemControls}>
                    <div className={styles.quantityControls}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        +
                      </button>
                    </div>
                    <span className={styles.itemPrice}>
                      ${((item.price + (item.modifiers?.reduce((sum, modifier) => sum + modifier.priceDelta, 0) ?? 0)) * item.quantity).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => removeFromCart(item.lineId)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.totals}>
              <div className={styles.totalsRow}>
                <span>Subtotal</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className={styles.totalsRow}>
                <span>Estimated Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className={styles.drawerActions}>
              <Button to="/cart" variant="secondary" ariaLabel="Review cart">
                View Full Cart
              </Button>
              <Button to="/cart" variant="primary" ariaLabel="Proceed to checkout">
                Go to Checkout
              </Button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};

export default CartSummaryDrawer;
