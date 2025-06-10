import React from 'react';
import styles from './Footer.module.css';
import Logo from '../../../assets/icons/Logo.svg';

const Footer = () => {
    return (
        <footer className={styles.footerContainer}>
            <div className={`container ${styles.footerSections}`}> 
                <div className={`${styles.footerSection} ${styles.logoSection}`}>
                    <img src={Logo} alt="Little Lemon Logo" className={styles.footerLogo} />
                    <p>&copy; 2025 Little Lemon. All rights reserved.</p>
                </div>

                <div className={`${styles.footerSection} ${styles.navSection}`}>
                    <h3>Site Navigation</h3>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a href="/menu">Menu</a></li>
                        <li><a href="/reservations">Reservations</a></li>
                        <li><a href="/my-reservations">My Reservations</a></li>
                        <li><a href="/cart">Cart</a></li>
                    </ul>
                </div>

                <div className={`${styles.footerSection} ${styles.contactSection}`}>
                    <h3>Contact</h3>
                    <ul>
                        <li>123 Main Street</li>
                        <li>Chicago, IL 60614</li>
                        <li>(123) 456-7890</li>
                        <li><a href="mailto:info@littlelemon.com">info@littlelemon.com</a></li>
                    </ul>
                </div>

                <div className={`${styles.footerSection} ${styles.socialSection}`}>
                    <h3>Social Media Links</h3>
                    <ul>
                        <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                        <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                        <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                        <li><a href="https://yelp.com" target="_blank" rel="noopener noreferrer">Yelp</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
