import React, { useState, useRef, useEffect } from 'react';
import styles from './OrderForDelivery.module.css';
import OrderDeliveryCard from '../OrderDeliveryCard/OrderDeliveryCard';
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
    setActiveCategory(category);
  };

  return (
    <section className={styles.orderForDeliverySection}>
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
        
        {/* Menu items */}
        <div className={styles.menuItemsContainer}>
          {filteredItems.map((item) => (
            <OrderDeliveryCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrderForDelivery;