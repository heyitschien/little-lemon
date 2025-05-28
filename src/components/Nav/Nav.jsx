 // src/components/Nav/Nav.jsx
import React from 'react'; // Import React for component creation
import styles from './Nav.module.css'; // Import CSS modules for component styling

function Nav({ menuOpen, setMenuOpen, className }) {
  return (
    <nav className={`${styles.navContainer} ${className || ''}`}> 
      {/* Navigation list */}
      <ul className={`${styles.navList} ${menuOpen ? styles.navListMobileOpen : ''}`}> 
        {/* Navigation items */}
        <li><a href="/" className={styles.navLink} onClick={() => setMenuOpen && setMenuOpen(false)}>Home</a></li>
        <li><a href="/about" className={styles.navLink} onClick={() => setMenuOpen && setMenuOpen(false)}>About</a></li>
        <li><a href="/menu" className={styles.navLink} onClick={() => setMenuOpen && setMenuOpen(false)}>Menu</a></li>
        <li><a href="/reservations" className={styles.navLink} onClick={() => setMenuOpen && setMenuOpen(false)}>Reservations</a></li>
        <li>
          <a href="/cart" className={`${styles.navLink} ${styles.cartLink}`} onClick={() => setMenuOpen && setMenuOpen(false)}>
            Cart
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Nav; // Export the component for use in other files
