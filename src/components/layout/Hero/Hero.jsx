import React, { useState } from 'react';
import styles from './Hero.module.css';
import defaultHeroImage from '../../../assets/images/restauranfood.jpg'; // Renamed for clarity
import Button from '../../common/Button/Button'; // Import the new Button component

const Hero = ({
  title = "Little Lemon",
  subtitle = "Chicago",
  paragraph = "We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.",
  imageSrc = defaultHeroImage,
  imageAlt = "Delicious Mediterranean food",
  ctaText = "Reserve a Table",
  ctaLink = "/reservations",
  showCta = true, // New prop to control CTA visibility
  customHeroStyles = {}, // New prop for additional hero section styling
  customContainerStyles = {}, // New prop for additional container styling
  customContentStyles = {}, // New prop for additional content styling
  customImageContainerStyles = {}, // New prop for additional image container styling
  customImageStyles = {} // New prop for additional image styling
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Handle image load event
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  return (
    <section className={styles.hero} style={customHeroStyles} data-component-name="Hero">
      <div className={`container ${styles.heroContainer}`} style={customContainerStyles}>
        <div className={styles.heroContent} style={customContentStyles}>
          <h1>{title}</h1>
          {subtitle && <h2>{subtitle}</h2>}
          {paragraph && <p>{paragraph}</p>}
          {showCta && ctaText && ctaLink && (
            <Button 
              to={ctaLink} 
              ariaLabel={ctaText}
              variant="primary"
              size="large"
              className={styles.heroButton}
            >
              {ctaText}
            </Button>
          )}
        </div>
        <div className={styles.heroImageContainer} style={customImageContainerStyles}>
          <div className={`${styles.imageWrapper} ${imageLoaded ? styles.imageLoaded : ''}`}>
            <img 
              src={imageSrc} 
              alt={imageAlt} 
              style={customImageStyles} 
              loading="lazy"
              onLoad={handleImageLoad}
              className={styles.heroImage}
            />
            {!imageLoaded && <div className={styles.imagePlaceholder}></div>}
          </div>
        </div>
      </div>
    </section>
  );
};

Hero.defaultProps = {
  title: "Little Lemon",
  subtitle: "Chicago",
  paragraph: "We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.",
  imageSrc: defaultHeroImage,
  imageAlt: "Delicious Mediterranean food",
  ctaText: "Reserve a Table",
  ctaLink: "/reservations",
  showCta: true,
  customHeroStyles: {},
  customContainerStyles: {},
  customContentStyles: {},
  customImageContainerStyles: {},
  customImageStyles: {}
};

export default Hero;
