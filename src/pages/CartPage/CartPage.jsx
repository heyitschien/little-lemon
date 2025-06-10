import React, { useState, useRef } from 'react';
import { useCart } from '../../context/useCart';
import { Link } from 'react-router-dom';
import styles from './CartPage.module.css';
import Button from '../../components/common/Button/Button';
import CartMenuSection from '../../components/features/Cart/CartMenuSection';
import BikeIcon from '../../assets/icons/bike.svg';

// CartItem component for better organization and swipe functionality
const CartItem = ({ item, updateQuantity, removeFromCart }) => {
  const itemRef = useRef(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const [swiping, setSwiping] = useState(false);
  
  // Touch handlers for swipe-to-remove functionality
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    setSwiping(true);
  };
  
  const handleTouchMove = (e) => {
    if (!swiping) return;
    
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    
    // Only allow swiping left (negative diff)
    if (diff < 0) {
      // Apply transform to the item element
      if (itemRef.current) {
        const translateX = Math.max(diff, -100); // Limit swipe to -100px
        itemRef.current.style.transform = `translateX(${translateX}px)`;
      }
    }
  };
  
  const handleTouchEnd = () => {
    if (!swiping) return;
    
    const diff = currentX.current - startX.current;
    
    // If swiped far enough left, remove the item
    if (diff < -80) {
      removeFromCart(item.id);
    } else {
      // Reset position
      if (itemRef.current) {
        itemRef.current.style.transform = 'translateX(0)';
      }
    }
    
    setSwiping(false);
  };
  
  return (
    <div 
      ref={itemRef}
      className={styles.summaryItem}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Item name */}
      <div className={styles.itemInfo}>
        <span className={styles.itemName}>{item.name}</span>
      </div>
      
      {/* Quantity controls */}
      <div className={styles.quantityControlWrapper}>
        <div className={styles.quantityControl}>
          <Button 
            className={styles.quantityButton}
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            ariaLabel="Decrease quantity"
            variant="primary"
          >
            -
          </Button>
          <span className={styles.quantityValue}>{item.quantity}</span>
          <Button 
            className={styles.quantityButton}
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            ariaLabel="Increase quantity"
            variant="primary"
          >
            +
          </Button>
        </div>
        
        {/* Desktop-only X button for removing items */}
        <div className={styles.desktopRemoveWrapper}>
          <button 
            onClick={() => removeFromCart(item.id)}
            aria-label={`Remove ${item.name} from cart`}
            className={styles.desktopXButton}
          >
            ×
          </button>
        </div>
      </div>
      
      {/* Price */}
      <span className={styles.itemTotalPrice}>
        ${(item.price * item.quantity).toFixed(2)}
      </span>
    </div>
  );
};

const CartPage = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [deliveryTime, setDeliveryTime] = useState('20 minutes');
  const [cutleryNeeded, setCutleryNeeded] = useState(false);
  
  // Function to change delivery time (fixes unused setDeliveryTime lint)
  const changeDeliveryTime = (newTime) => {
    setDeliveryTime(newTime);
    alert(`Delivery time updated to ${newTime}`);
  };
  
  // Calculate additional fees
  const subtotal = cartTotal;
  const deliveryFee = 2.00;
  const serviceFee = 1.00;
  const total = subtotal + deliveryFee + serviceFee;
  
  // Cart page component

  return (
    <div className={styles.cartPageWrapper}>
      {cartItems.length === 0 ? (
        <div className={styles.emptyCartContainer}>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven&apos;t added any items to your cart yet.</p>
          <Button to="/menu" ariaLabel="Browse Menu">
            Browse Menu
          </Button>
        </div>
      ) : (
        <div className={styles.cartPageContainer}>
          
          {/* Delivery time section */}
          <div className={styles.deliveryTime}>
            <img src={BikeIcon} alt="Delivery" className={styles.bikeIcon} />
            <div className={styles.deliveryTimeInfo}>
              <span>Delivery Time</span>
              <span>{deliveryTime}</span>
            </div>
            <Button 
              variant="secondary" 
              className={styles.changeButton}
              onClick={() => changeDeliveryTime('30 minutes')}
            >
              Change
            </Button>
          </div>
          
          {/* Cutlery option */}
          <div className={styles.cutlerySection}>
            <div className={styles.cutleryInfo}>
              <h3>Cutlery</h3>
              <p>Help reduce plastic waste. only ask for cutlery if you need it</p>
            </div>
            <div 
              className={`${styles.cutleryToggle} ${cutleryNeeded ? styles.active : ''}`}
              onClick={() => setCutleryNeeded(!cutleryNeeded)}
            >
              <div className={styles.toggleCircle}></div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className={styles.orderSummary}>
            <h3 className={styles.summaryTitle}>Order Summary</h3>
            
            {/* Items list */}
            <div className={styles.itemsList}>
              <h4 className={styles.itemsListTitle}>Items</h4>
              <div className={styles.itemsContainer}>
                {cartItems.map(item => (
                  <CartItem 
                    key={item.id} 
                    item={item} 
                    updateQuantity={updateQuantity} 
                    removeFromCart={removeFromCart} 
                  />
                ))}
                <div className={styles.swipeHint}>
                  <span>← Swipe left to remove items</span>
                </div>
              </div>
            </div>
            
            {/* Add More To Your Order section */}
            <div style={{ marginTop: '0' }}>
              <CartMenuSection />
            </div>
            
            {/* Cost breakdown */}
            <div className={styles.costBreakdown}>
              <div className={styles.costItem}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.costItem}>
                <span>Delivery</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className={styles.costItem}>
                <span>Service</span>
                <span>${serviceFee.toFixed(2)}</span>
              </div>
              <div className={`${styles.costItem} ${styles.totalCost}`}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Checkout and Clear Cart buttons */}
            <div className={styles.checkoutActions}>
              <Button 
                variant="secondary"
                onClick={clearCart}
                ariaLabel="Clear cart"
                className={styles.clearCartButton}
              >
                Clear Cart
              </Button>
              <Button 
                variant="primary"
                onClick={() => alert('Checkout functionality would go here!')}
                ariaLabel="Proceed to checkout"
                className={styles.checkoutButton}
              >
                Checkout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
