 // src/components/Nav/Nav.jsx
import React from 'react'; // Import React for component creation
import { Link, useLocation } from 'react-router-dom'; // Import Link and useLocation for navigation and current route
import styles from './Nav.module.css'; // Import CSS modules for component styling
import BasketIcon from '../../../assets/icons/Basket.svg'; // Import basket icon for cart
import { useCart } from '../../../context/useCart'; // Import cart context for cart count

function Nav({ menuOpen, setMenuOpen, className }) {
  const { cartCount } = useCart(); // Get cart count from context
  const location = useLocation(); // Get current location to determine active page
  return (
    <nav className={`${styles.navContainer} ${className || ''}`}> 
      {/* Navigation list */}
      <ul className={`${styles.navList} ${menuOpen ? styles.navListMobileOpen : ''}`}> 
        {/* Navigation items */}
        <li>
          <Link 
            to="/" 
            className={`${styles.navLink} ${location.pathname === '/' ? styles.activeLink : ''}`} 
            onClick={() => setMenuOpen && setMenuOpen(false)}
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            to="/about" 
            className={`${styles.navLink} ${location.pathname === '/about' ? styles.activeLink : ''}`} 
            onClick={() => setMenuOpen && setMenuOpen(false)}
          >
            About
          </Link>
        </li>
        <li>
          <Link 
            to="/menu" 
            className={`${styles.navLink} ${location.pathname === '/menu' ? styles.activeLink : ''}`} 
            onClick={() => setMenuOpen && setMenuOpen(false)}
          >
            Menu
          </Link>
        </li>
        <li>
          <Link 
            to="/reservations" 
            className={`${styles.navLink} ${location.pathname === '/reservations' ? styles.activeLink : ''}`} 
            onClick={() => setMenuOpen && setMenuOpen(false)}
          >
            Reservations
          </Link>
        </li>
        <li>
          <Link 
            to="/my-reservations" 
            className={`${styles.navLink} ${location.pathname === '/my-reservations' ? styles.activeLink : ''}`} 
            onClick={() => setMenuOpen && setMenuOpen(false)}
          >
            My Reservations
          </Link>
        </li>
        <li>
          <Link 
            to="/cart" 
            className={`${styles.navLink} ${styles.cartLink} ${location.pathname === '/cart' ? styles.activeLink : ''}`} 
            onClick={() => setMenuOpen && setMenuOpen(false)}
          >
            <img src={BasketIcon} alt="Shopping Cart" className={styles.basketIcon} />
            {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav; // Export the component for use in other files
