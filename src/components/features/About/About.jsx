import React, { useState } from 'react';
import styles from './About.module.css';
import marioAndAdrianImg from '../../../assets/images/Mario and Adrian A.jpg';
import restaurantChefImg from '../../../assets/images/restaurant chef B.jpg';

const About = () => {
  const [imagesLoaded, setImagesLoaded] = useState({
    image1: false,
    image2: false
  });

  // Track when both images are loaded
  const handleImageLoad = (imageKey) => {
    setImagesLoaded(prev => ({
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
            <img 
              src={restaurantChefImg} 
              alt="Restaurant Chef" 
              className={styles.aboutImage1} 
              loading="lazy"
              onLoad={() => handleImageLoad('image1')}
            />
          </div>
          <div className={`${styles.imageWrapper2} ${imagesLoaded.image2 ? styles.imageLoaded : ''}`}>
            <img 
              src={marioAndAdrianImg} 
              alt="Mario and Adrian" 
              className={styles.aboutImage2} 
              loading="lazy"
              onLoad={() => handleImageLoad('image2')}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
