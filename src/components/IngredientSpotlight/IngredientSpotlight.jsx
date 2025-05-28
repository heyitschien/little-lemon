import React, { useState } from 'react';
import styles from './IngredientSpotlight.module.css';
import { fetchIngredientSpotlightData } from '../../services/geminiService';

const IngredientSpotlight = () => {
  const [spotlightData, setSpotlightData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchSpotlight = async () => {
    setIsLoading(true);
    setError(null);
    setSpotlightData(null); // Clear previous data
    try {
      const data = await fetchIngredientSpotlightData();
      setSpotlightData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch ingredient spotlight. Please ensure your API key is correctly configured and try again.');
      console.error(err); // Log the full error for debugging
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.ingredientSpotlightSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>✨ Today's Featured Ingredient Spotlight ✨</h2>
        <button 
          onClick={handleFetchSpotlight} 
          disabled={isLoading} 
          className={`${styles.btn} ${styles.btnPrimary}`}
        >
          {isLoading ? 'Discovering...' : 'Discover an Ingredient!'}
        </button>

        <div className={styles.spotlightContent}>
          {isLoading && <div className={styles.loader}>Loading...</div>}
          {error && <div className={styles.error}><p>Oops! Something went wrong.</p><p>{error}</p></div>}
          {!isLoading && !error && spotlightData && (
            <>
              <h3 className={styles.ingredientName}>{spotlightData.ingredientName}</h3>
              <p className={styles.description}><strong>Description:</strong> {spotlightData.ingredientDescription}</p>
              <p className={styles.featuredDish}><strong>Featured In:</strong> {spotlightData.featuredDishName}</p>
              <p className={styles.reasoning}><strong>Why:</strong> {spotlightData.dishReasoning}</p>
            </>
          )}
          {!isLoading && !error && !spotlightData && (
            <p className={styles.defaultText}>
              Click the button above to learn about a special Mediterranean ingredient and a dish that features it!
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default IngredientSpotlight;
