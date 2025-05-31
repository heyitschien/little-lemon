import React, { useState, useRef, useEffect } from 'react';
import styles from './OrderForDelivery.module.css';
import MenuItemCard from '../features/Menu/MenuItemCard/MenuItemCard';
import { menuItems, menuCategories } from '../../data/menuData';
import bikeIcon from '../../assets/icons/bike.svg';

const OrderForDelivery = ({ title = "ORDER FOR DELIVERY!" }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredItems, setFilteredItems] = useState(menuItems);
  const filterContainerRef = useRef(null);

  // Filter menu items when category changes
  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter(item => item.category === activeCategory));
    }
  }, [activeCategory]);

  // Handle category click
  const handleCategoryClick = (category) => {
    // First, scroll to the top of the menu section to reset the view
    const menuSection = document.querySelector(`.${styles.orderForDeliverySection}`);
    if (menuSection) {
      // Use scrollTo to position right below the sticky header
      window.scrollTo({
        top: menuSection.offsetTop - 70, // Adjust for header height
        behavior: 'auto' // Use 'auto' for immediate scrolling
      });
    }
    
    // Then update the active category
    setActiveCategory(category);
  };

  // Group items by category
  const itemsByCategory = activeCategory === 'All'
    ? menuCategories.reduce((acc, category) => {
        acc[category] = menuItems.filter(item => item.category === category);
        return acc;
      }, {})
    : { [activeCategory]: filteredItems };

  return (
    <section className={styles.orderForDeliverySection}>
      <div className={styles.stickyWrapper}>
        <div className={styles.container}>
          <div className={styles.sectionTitleContainer}>
            <h2 className={styles.sectionTitle}>
              {title}
              {title === "ORDER FOR DELIVERY!" && <img src={bikeIcon} alt="Delivery" className={styles.bikeIcon} />}
            </h2>
          </div>
          
          {/* Filter pills */}
          <div className={styles.filterContainer} ref={filterContainerRef}>
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
        </div>
      </div>
      
      <div className={styles.container}>
        
        {/* Menu items by category */}
        <div className={styles.menuCategoriesContainer}>
          {Object.entries(itemsByCategory).map(([category, items]) => 
            items.length > 0 ? (
              <div key={category} className={styles.categorySection}>
                <h3 className={styles.categoryTitle}>{category}</h3>
                <div className={styles.menuItemsGrid}>
                  {items.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
};

export default OrderForDelivery;