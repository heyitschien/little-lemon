import React from 'react';
import styles from './SpecialCard.module.css';
import bikeIcon from '../../../assets/icons/bike.svg'; // Import the bike icon

// Dynamically import images from src/assets/images/
// This approach assumes your build tool (Vite) can handle it.
const images = import.meta.glob('/src/assets/images/*.(svg|jpg|jpeg|png)');

const SpecialCard = ({ imageName, title, price, description }) => {
  // Construct the path for the dynamic import
  const imagePath = `/src/assets/images/${imageName}`;
  const imageUrl = images[imagePath] ? images[imagePath]() : null;

  // Fallback for image if not found or during loading
  // In a real app, you might have a placeholder image or loading state
  const [ imgSrc, setImgSrc ] = React.useState(null);

  React.useEffect(() => {
    if (imageUrl instanceof Promise) {
        imageUrl.then(module => setImgSrc(module.default || module));
    } else if (typeof imageUrl === 'string') {
        setImgSrc(imageUrl);
    }
  }, [imageUrl]);

  return (
    <article className={styles.specialCard}>
      <div className={styles.specialImageContainer}>
        {imgSrc ? (
          <img src={imgSrc} alt={title} className={styles.specialImage} />
        ) : (
          <div className={styles.imagePlaceholder}>Loading...</div>
        )}
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{title}</h3>
          <p className={styles.cardPrice}>{price}</p>
        </div>
        <p className={styles.cardDescription}>{description}</p>
        <a href="#order-delivery" className={styles.cardDeliveryLink}>
          Order a delivery
          <img src={bikeIcon} alt="Delivery icon" className={styles.deliveryIcon} />
        </a>
      </div>
    </article>
  );
};

export default SpecialCard;
