import React from 'react';
import styles from './MenuPage.module.css';
// import IngredientSpotlight from '../../components/IngredientSpotlight/IngredientSpotlight';
// import MenuCategorySection from '../../components/MenuCategorySection/MenuCategorySection';
// import { menuItems, menuCategories } from '../../data/menuData';
import MenuSection from '../../components/features/Menu/MenuSection/MenuSection'; // Import MenuSection

const MenuPage = () => {
  return (
    <div className={styles.menuPageContainer}>
      <main className={styles.mainContent}>
        {/* <IngredientSpotlight /> */}
        {/*
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
        */}
        <MenuSection title="Our Menu" /> {/* Use MenuSection with new title */}
      </main>
    </div>
  );
};

export default MenuPage;
