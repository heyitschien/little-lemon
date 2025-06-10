import React, { useState, useEffect } from 'react';
import styles from './About.module.css';
import marioAndAdrianImg from '../../../assets/images/Mario and Adrian A.jpg';
import restaurantChefImg from '../../../assets/images/restaurant chef B.jpg';

const About = () => {
  const [imagesLoaded, setImagesLoaded] = useState({
    image1: false,
    image2: false
  });
  
  const [imagesError, setImagesError] = useState({
    image1: false,
    image2: false
  });

  // Preload images for better user experience
  useEffect(() => {
    const preloadImages = () => {
      const image1 = new Image();
      const image2 = new Image();
      
      image1.src = restaurantChefImg;
      image2.src = marioAndAdrianImg;
      
      // Optional: Add load event listeners here if needed
      // This is in addition to the onLoad handlers on the actual img elements
      image1.onload = () => console.log('Image 1 preloaded');
      image2.onload = () => console.log('Image 2 preloaded');
      
      image1.onerror = () => setImagesError(prev => ({ ...prev, image1: true }));
      image2.onerror = () => setImagesError(prev => ({ ...prev, image2: true }));
    };
    
    preloadImages();
  }, []);

  // Track when images are loaded
  const handleImageLoad = (imageKey) => {
    setImagesLoaded(prev => ({
      ...prev,
      [imageKey]: true
    }));
  };
  
  // Handle image load errors
  const handleImageError = (imageKey) => {
    setImagesError(prev => ({
      ...prev,
      [imageKey]: true
    }));
  };

  return (
    <section className={styles.aboutSection} data-component-name="About">
      <div className={styles.container}>
        <div className={styles.aboutContent}>
          <h2 className={styles.title}>LITTLE LEMON</h2>
          <h3 className={styles.subtitle}>Chicago</h3>
          <div className={styles.aboutText}>
            <p>
              Little Lemon is a charming neighborhood bistro that serves simple food
              and classic cocktails in a lively but casual environment. The
              restaurant features a locally-sourced menu with daily specials.
            </p>
            <p>
              Owned by two Italian brothers, Mario and Adrian, who moved to the
              United States to pursue their shared dream of owning a restaurant.
              To craft the menu, Mario relies on family recipes and his experience
              as a chef in Italy.
            </p>
          </div>
        </div>
        <div className={styles.aboutImages}>
          <div className={`${styles.imageWrapper1} ${imagesLoaded.image1 ? styles.imageLoaded : ''}`}>
            {/* First image with placeholder */}
            <img 
              src={restaurantChefImg} 
              alt="Restaurant Chef" 
              className={styles.aboutImage1} 
              loading="lazy"
              onLoad={() => handleImageLoad('image1')}
              onError={() => handleImageError('image1')}
              width="320" 
              height="350"
              fetchPriority="high"
            />
            {!imagesLoaded.image1 && !imagesError.image1 && (
              <div className={styles.imagePlaceholder}></div>
            )}
            {imagesError.image1 && (
              <div className={styles.imageError}>
                <span>Image could not be loaded</span>
              </div>
            )}
          </div>
          <div className={`${styles.imageWrapper2} ${imagesLoaded.image2 ? styles.imageLoaded : ''}`}>
            {/* Second image with placeholder */}
            <img 
              src={marioAndAdrianImg} 
              alt="Mario and Adrian" 
              className={styles.aboutImage2} 
              loading="lazy"
              onLoad={() => handleImageLoad('image2')}
              onError={() => handleImageError('image2')}
              width="320" 
              height="350"
              fetchPriority="high"
            />
            {!imagesLoaded.image2 && !imagesError.image2 && (
              <div className={styles.imagePlaceholder}></div>
            )}
            {imagesError.image2 && (
              <div className={styles.imageError}>
                <span>Image could not be loaded</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
