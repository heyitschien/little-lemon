// src/components/Header/Header.jsx
import React, { useState } from 'react';
import Nav from '../Nav/Nav';
import styles from './Header.module.css';
import logoSrc from '../../assets/icons/Logo.svg'; 
import BasketIcon from '../../assets/icons/Basket.svg'; 
import { useCart } from '../../context/useCart'; 

function Header() {
  const [menuOpen, setMenuOpen] = useState(false); 
  const { cartCount } = useCart();

  const toggleMenu = () => { 
    setMenuOpen(!menuOpen);
  };

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
        <img
          src={logoSrc}
          alt="Little Lemon Logo"
          className={styles.logo}
        />

        {/* Cart icon - visible only on mobile */}
        <a href="/cart" className={styles.mobileCartLink}>
          <img src={BasketIcon} alt="Shopping Cart" className={styles.basketIcon} />
          {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
        </a>

        {/* Desktop navigation - hidden on mobile */}
        <div className={styles.desktopNav}>
          <Nav />
        </div>

        {/* Mobile Navigation - rendered outside headerContent for full-width display if needed, but managed by Nav component */}
        <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </div>
    </header>
  );
}

export default Header;
