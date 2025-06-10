import React, { useState, useEffect, useRef } from 'react';
import styles from './CartMenuSection.module.css';
import CartMenuItemCard from './CartMenuItemCard';
import { menuItems, menuCategories } from '../../../data/menuData';

const CartMenuSection = ({ title = "Add More To Your Order!" }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredItems, setFilteredItems] = useState(menuItems);
  const menuGridRef = useRef(null);

  // Filter menu items when category changes
  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter(item => item.category === activeCategory));
    }
    
    // Reset scroll position when category changes
    if (menuGridRef.current) {
      menuGridRef.current.scrollLeft = 0;
    }
  }, [activeCategory]);
  
  // Add scroll event listener for future enhancements if needed
  useEffect(() => {
    // Component mounted
    return () => {
      // Component cleanup
    };
  }, [filteredItems]);

  // Handle category click
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  return (
    <section className={styles.menuSection}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      
      {/* Filter pills */}
      <div className={styles.filterContainer}>
        <button 
          className={`${styles.filterPill} ${activeCategory === 'All' ? styles.active : ''}`}
          onClick={() => handleCategoryClick('All')}
          aria-pressed={activeCategory === 'All'}
        >
          All
        </button>
        {menuCategories.map((category) => (
          <button
            key={category}
            className={`${styles.filterPill} ${activeCategory === category ? styles.active : ''}`}
            onClick={() => handleCategoryClick(category)}
            aria-pressed={activeCategory === category}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Menu items horizontal scroll container */}
      <div className={styles.menuItemsContainer}>
        <div 
          ref={menuGridRef}
          className={styles.menuItemsGrid}
        >
          {filteredItems.map((item) => (
            <CartMenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CartMenuSection;
