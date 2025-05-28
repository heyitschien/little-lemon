import React from 'react';
import styles from './Testimonials.module.css';
import TestimonialCard from './TestimonialCard/TestimonialCard';
import johnDollImg from '../../assets/images/testimonials/john-doll.png';
import janeSmithImg from '../../assets/images/testimonials/jane-smith.png';
import mikeJonesImg from '../../assets/images/testimonials/mike-jones.png';
import sarahWilliamsImg from '../../assets/images/testimonials/sarah-williams.png';

// Testimonials data with profile pictures
const testimonialsData = [
  {
    id: 1,
    rating: 5,
    imageSrc: johnDollImg, 
    userName: 'John Doll',
    reviewText: '"Absolutely delicious food and great service. Will definitely come back!"',
  },
  {
    id: 2,
    rating: 4,
    imageSrc: janeSmithImg, 
    userName: 'Jane Smith',
    reviewText: '"The Greek salad was fresh and authentic. Loved the atmosphere too!"',
  },
  {
    id: 3,
    rating: 5,
    imageSrc: mikeJonesImg, 
    userName: 'Mike Jones',
    reviewText: '"Best Mediterranean food in Chicago! The lemon dessert is to die for."',
  },
  {
    id: 4,
    rating: 5,
    imageSrc: sarahWilliamsImg, 
    userName: 'Sarah Williams',
    reviewText: '"Family friendly with excellent food. The bruschetta is exceptional!"',
  },
];

const Testimonials = () => {
  return (
    <section className={styles.testimonialsSection} data-component-name="Testimonials">
      <div className={styles.container}>
        <h2 className={styles.testimonialsTitle}>Testimonials</h2>
        <div className={styles.testimonialsGrid}>
          {testimonialsData.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              rating={testimonial.rating}
              imageSrc={testimonial.imageSrc} 
              userName={testimonial.userName}
              reviewText={testimonial.reviewText}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;