// src/components/layout/Header/Header.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from '../Nav/Nav';
import styles from './Header.module.css';
import logoSrc from '../../../assets/icons/Logo.svg';
import BasketIcon from '../../../assets/icons/Basket.svg';
import { useCart } from '../../../context/useCart';
import CartSummaryDrawer from '../../features/Cart/CartSummaryDrawer/CartSummaryDrawer';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [isCartDrawerOpen, setCartDrawerOpen] = useState(false);
  const location = useLocation();
  const { cartCount, cartSubtotal } = useCart();

  // Preload the logo image
  useEffect(() => {
    const img = new Image();
    img.src = logoSrc;
    img.onload = () => setLogoLoaded(true);
  }, []);

  useEffect(() => {
    setCartDrawerOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setCartDrawerOpen(false);
    setMenuOpen(!menuOpen);
  };

  const handleCartToggle = () => {
    setMenuOpen(false);
    setCartDrawerOpen(prev => !prev);
  };

  const handleCloseCart = () => {
    setCartDrawerOpen(false);
  };

  const cartLabel = cartCount > 0
    ? `Open cart drawer. ${cartCount} item${cartCount === 1 ? '' : 's'} totaling $${cartSubtotal.toFixed(2)}`
    : 'Open cart drawer. Cart is currently empty';

  return (
    <header 
      className={styles.headerBar}
      role="banner"
    >
      <div className={styles.headerContent} data-component-name="Header">
        {/* Hamburger menu - visible only on mobile */}
        <button 
          className={styles.hamburger} 
          onClick={toggleMenu} 
          aria-label="Toggle menu" 
          aria-expanded={menuOpen} 
        >
          <span className={styles.hamburgerBar}></span>
          <span className={styles.hamburgerBar}></span>
          <span className={styles.hamburgerBar}></span>
        </button>

        {/* Logo - centered on mobile */}
        <div className={`${styles.logoContainer} ${logoLoaded ? styles.logoLoaded : ''}`}>
          <img
            src={logoSrc}
            alt="Little Lemon Logo"
            className={styles.logo}
            onLoad={() => setLogoLoaded(true)}
          />
          {!logoLoaded && <div className={styles.logoPlaceholder}></div>}
        </div>

        {/* Cart trigger */}
        <button
          type="button"
          className={styles.cartTrigger}
          onClick={handleCartToggle}
          aria-label={cartLabel}
          aria-expanded={isCartDrawerOpen}
        >
          <img src={BasketIcon} alt="" aria-hidden="true" className={styles.basketIcon} />
          <div className={styles.cartDetails}>
            <span className={styles.cartLabel}>Cart</span>
            <span className={styles.cartSubtotal}>
              {cartCount > 0 ? `$${cartSubtotal.toFixed(2)}` : 'Empty'}
            </span>
          </div>
          {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
        </button>

        {/* Navigation - responsive for both desktop and mobile */}
        <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} className={`${styles.mainNav} ${menuOpen ? styles.navVisible : ''}`} />
      </div>
      <CartSummaryDrawer isOpen={isCartDrawerOpen} onClose={handleCloseCart} />
    </header>
  );
}

export default Header;
