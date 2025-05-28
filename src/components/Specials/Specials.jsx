import React from 'react';
import styles from './Specials.module.css';
import MenuItemCard from '../MenuItemCard/MenuItemCard';
import { menuItems } from '../../data/menuData';
import { Link } from 'react-router-dom';

// Function to get random featured items from menuData
const getRandomFeaturedItems = (items, count = 3) => {
  // Create a copy of the array to avoid modifying the original
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  // Get the first 'count' items
  return shuffled.slice(0, count);
};

const Specials = () => {
  // Use useMemo to only recalculate featured items when menuItems changes
  const featuredItems = React.useMemo(() => {
    return getRandomFeaturedItems(menuItems, 3);
  }, []);

  return (
    <section className={styles.specialsSection}>
      <div className={styles.container}>
        <div className={styles.specialsHeader}>
          <h2 className={styles.specialsTitle}>This week's specials!</h2>
          <Link to="/menu" className={`${styles.btn} ${styles.btnOnlineMenu}`}>Online Menu</Link>
        </div>
        <div className={styles.specialsGrid}>
          {featuredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Specials;
