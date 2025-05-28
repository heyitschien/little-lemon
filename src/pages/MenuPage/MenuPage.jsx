import React from 'react';
import styles from './MenuPage.module.css';
import IngredientSpotlight from '../../components/IngredientSpotlight/IngredientSpotlight';
import MenuCategorySection from '../../components/MenuCategorySection/MenuCategorySection';
import { menuItems, menuCategories } from '../../data/menuData';

const MenuPage = () => {
  return (
    <div className={styles.menuPageContainer}>
      <main className={styles.mainContent}>
        <IngredientSpotlight />
        {
          menuCategories.map(category => {
            const itemsInCategory = menuItems.filter(item => item.category === category);
            return (
              <MenuCategorySection 
                key={category} 
                categoryTitle={category} 
                items={itemsInCategory} 
              />
            );
          })
        }
      </main>
    </div>
  );
};

export default MenuPage;
