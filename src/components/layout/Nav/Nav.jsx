 // src/components/Nav/Nav.jsx
import React from 'react'; // Import React for component creation
import { Link } from 'react-router-dom'; // Import Link for client-side navigation
import styles from './Nav.module.css'; // Import CSS modules for component styling

function Nav({ menuOpen, setMenuOpen, className }) {
  return (
    <nav className={`${styles.navContainer} ${className || ''}`}> 
      {/* Navigation list */}
      <ul className={`${styles.navList} ${menuOpen ? styles.navListMobileOpen : ''}`}> 
        {/* Navigation items */}
        <li><Link to="/" className={styles.navLink} onClick={() => setMenuOpen && setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/about" className={styles.navLink} onClick={() => setMenuOpen && setMenuOpen(false)}>About</Link></li>
        <li><Link to="/menu" className={styles.navLink} onClick={() => setMenuOpen && setMenuOpen(false)}>Menu</Link></li>
        <li><Link to="/reservations" className={styles.navLink} onClick={() => setMenuOpen && setMenuOpen(false)}>Reservations</Link></li>
        <li><Link to="/my-reservations" className={styles.navLink} onClick={() => setMenuOpen && setMenuOpen(false)}>My Reservations</Link></li>
        <li>
          <Link to="/cart" className={`${styles.navLink} ${styles.cartLink}`} onClick={() => setMenuOpen && setMenuOpen(false)}>
            Cart
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav; // Export the component for use in other files
