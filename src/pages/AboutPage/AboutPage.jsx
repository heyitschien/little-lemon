import React from 'react';
import styles from './AboutPage.module.css';
import restaurantImg from '../../assets/images/restaurant.jpg';
import marioAndAdrianA from '../../assets/images/Mario and Adrian A.jpg';
import marioAndAdrianB from '../../assets/images/Mario and Adrian b.jpg';
import restaurantChefB from '../../assets/images/restaurant chef B.jpg';

/**
 * AboutPage Component
 * 
 * Dedicated page that tells the story of Little Lemon restaurant,
 * its founders, philosophy, and showcases the restaurant's atmosphere.
 */
const AboutPage = () => {
  return (
    <div className={styles.aboutPage}>
      
      {/* Introduction Section */}
      <section className={styles.introSection}>
        <div className={styles.container}>
          <div className={styles.introContent}>
            <h2 className={styles.sectionTitle}>LITTLE LEMON</h2>
            <h3 className={styles.sectionSubtitle}>Chicago</h3>
            <p>
              Little Lemon is a charming neighborhood bistro that opened its doors in 2010 in the heart of Chicago. 
              We serve simple food and classic cocktails in a lively but casual environment. The restaurant features 
              a locally-sourced menu with daily specials that capture the essence of Mediterranean cuisine with a 
              modern twist.
            </p>
            <p>
              Our dishes celebrate the rich flavors of Italian, Greek, and Turkish traditions, while incorporating 
              fresh, seasonal ingredients from local Chicago markets. Every plate is designed to tell a story - 
              one of heritage, passion, and culinary craftsmanship.
            </p>
          </div>
          <div className={styles.introImageContainer}>
            <img 
              src={restaurantImg} 
              alt="Little Lemon restaurant interior" 
              className={styles.introImage}
            />
          </div>
        </div>
      </section>
      
      {/* Founders Section */}
      <section className={styles.foundersSection}>
        <div className={styles.container}>
          <div className={styles.foundersImageContainer}>
            <div className={styles.imageWrapper1}>
              <img 
                src={marioAndAdrianA} 
                alt="Mario and Adrian cooking together" 
                className={styles.foundersImage}
              />
            </div>
            <div className={styles.imageWrapper2}>
              <img 
                src={marioAndAdrianB} 
                alt="Mario and Adrian in their restaurant" 
                className={styles.foundersImage}
              />
            </div>
          </div>
          <div className={styles.foundersContent}>
            <h2 className={styles.sectionTitle}>The Founders</h2>
            <h3 className={styles.sectionSubtitle}>Mario & Adrian</h3>
            <p>
              Little Lemon is owned and operated by two Italian brothers, Mario and Adrian, who moved to the 
              United States in 2001 to pursue their shared dream of owning a restaurant. Growing up in a small 
              town near the Amalfi Coast, they were immersed in the traditions of Italian cooking from an early age.
            </p>
            <p>
              Mario, the elder brother, honed his culinary skills working in various restaurants throughout Italy, 
              eventually becoming a chef at a renowned establishment in Rome. Adrian, with his keen business sense 
              and warm personality, complements his brother's culinary expertise by managing the restaurant's operations 
              and creating an inviting atmosphere for guests.
            </p>
            <p>
              To craft the menu, Mario relies on family recipes passed down through generations and his experience 
              as a chef in Italy. Each dish at Little Lemon carries the brothers' commitment to authentic flavors 
              and quality ingredients, creating a dining experience that feels both familiar and extraordinary.
            </p>
          </div>
        </div>
      </section>
      
      {/* Philosophy Section */}
      <section className={styles.philosophySection}>
        <div className={styles.container}>
          <div className={styles.philosophyContent}>
            <h2 className={styles.sectionTitle}>Our Philosophy</h2>
            <h3 className={styles.sectionSubtitle}>Food & Experience</h3>
            <p>
              At Little Lemon, we believe that dining is more than just eating—it's an experience that should 
              engage all the senses and create lasting memories. Our philosophy centers around three core principles:
            </p>
            <ul className={styles.philosophyList}>
              <li>
                <span className={styles.listTitle}>Fresh, Local Ingredients</span>
                <p>We source our ingredients from local farmers and suppliers whenever possible, ensuring the 
                freshest flavors and supporting our community.</p>
              </li>
              <li>
                <span className={styles.listTitle}>Traditional Techniques</span>
                <p>We honor time-tested cooking methods that bring out the authentic flavors of Mediterranean cuisine, 
                while adding our own creative touch.</p>
              </li>
              <li>
                <span className={styles.listTitle}>Welcoming Atmosphere</span>
                <p>We've created a space where everyone feels at home—whether you're celebrating a special occasion 
                or simply enjoying a weeknight dinner.</p>
              </li>
            </ul>
          </div>
          <div className={styles.philosophyImageContainer}>
            <img 
              src={restaurantChefB} 
              alt="Chef preparing food at Little Lemon" 
              className={styles.philosophyImage}
            />
          </div>
        </div>
      </section>
      
      {/* Gallery Section */}
      <section className={styles.gallerySection}>
        <div className={styles.container}>
          <h2 className={styles.galleryTitle}>Our Restaurant</h2>
          <div className={styles.galleryGrid}>
            <div className={styles.galleryItem}>
              <img 
                src={restaurantImg} 
                alt="Little Lemon dining area" 
                className={styles.galleryImage}
              />
            </div>
            <div className={styles.galleryItem}>
              <img 
                src={restaurantChefB} 
                alt="Chef preparing a special dish" 
                className={styles.galleryImage}
              />
            </div>
            <div className={styles.galleryItem}>
              <img 
                src={marioAndAdrianA} 
                alt="Mario and Adrian in the kitchen" 
                className={styles.galleryImage}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Visit Us Section */}
      <section className={styles.visitSection}>
        <div className={styles.container}>
          <div className={styles.visitContent}>
            <h2 className={styles.visitTitle}>Come Visit Us</h2>
            <p className={styles.visitText}>
              We're located in the heart of Chicago and open Tuesday through Sunday for lunch and dinner.
              Reservations are recommended but walk-ins are always welcome.
            </p>
            <a href="/reservations" className={styles.reserveButton}>
              Reserve a Table
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
