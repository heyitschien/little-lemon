import React from 'react';
import { useCart } from '../../context/useCart';
import styles from './CartPage.module.css';
import Button from '../../components/Button/Button';

const CartPage = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

  return (
    <div className={styles.cartPageWrapper}>
      <h1 className={styles.pageTitle}>Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className={styles.emptyCartContainer}>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <Button to="/menu" ariaLabel="Browse Menu">
            Browse Menu
          </Button>
        </div>
      ) : (
        <div className={styles.cartPageContainer}>
          <h2 className={styles.cartTitle}>Your Cart</h2>
          
          <div className={styles.cartItems}>
            {cartItems.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemImageContainer}>
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
                </div>
                
                <div className={styles.itemDetails}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemDescription}>{item.description}</p>
                  <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
                </div>
                
                <div className={styles.itemActions}>
                  <div className={styles.quantityControl}>
                    <button 
                      className={styles.quantityButton}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className={styles.quantityValue}>{item.quantity}</span>
                    <button 
                      className={styles.quantityButton}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    className={styles.removeButton}
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.cartSummary}>
            <div className={styles.cartTotal}>
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            
            <div className={styles.cartActions}>
              <button 
                className={styles.clearCartButton}
                onClick={clearCart}
                aria-label="Clear cart"
              >
                Clear Cart
              </button>
              <button 
                className={styles.checkoutButton}
                onClick={() => alert('Checkout functionality would go here!')}
                aria-label="Proceed to checkout"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
