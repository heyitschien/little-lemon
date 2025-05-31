import React from 'react';
import styles from './TestimonialCard.module.css';

// Helper function to render stars
const renderRating = (rating) => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
};

const TestimonialCard = ({ rating, imageSrc, userName, reviewText }) => {
  return (
    <article className={styles.testimonialCard}>
      <p className={styles.rating}>{renderRating(rating)}</p>
      <div className={styles.userInfo}>
        {imageSrc ? (
          <img src={imageSrc} alt={userName} className={styles.userImage} />
        ) : (
          <div className={styles.imagePlaceholder}></div>
        )}
        <h4 className={styles.userName}>{userName}</h4>
      </div>
      <p className={styles.reviewText}>{reviewText}</p>
    </article>
  );
};

export default TestimonialCard;