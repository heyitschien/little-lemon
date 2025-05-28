import React from 'react';
import styles from './MenuCategorySection.module.css';
import MenuItemCard from '../MenuItemCard/MenuItemCard';

const MenuCategorySection = ({ categoryTitle, items }) => {
  if (!items || items.length === 0) {
    return null; // Don't render section if no items
  }

  return (
    <section className={styles.menuCategorySection} data-component-name="MenuCategorySection">
      <div className={styles.sectionContentWrapper}>
        <h2 className={styles.categoryTitle}>{categoryTitle}</h2>
        <div className={styles.menuGrid}>
          {items.map(item => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuCategorySection;
