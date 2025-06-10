import React from 'react';
import Button from './Button';
import styles from './ButtonExamples.module.css';
import BasketIcon from '../../../assets/icons/Basket.svg';

/**
 * Component that demonstrates all the variants and options of the Button component.
 * This serves as both documentation and a visual test for the Button component.
 */
const ButtonExamples = () => {
  return (
    <div className={styles.container}>
      <h2>Button Component Examples</h2>
      
      <section className={styles.section}>
        <h3>Button Variants</h3>
        <div className={styles.buttonRow}>
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="tertiary">Tertiary Button</Button>
          <Button disabled>Disabled Button</Button>
        </div>
      </section>
      
      <section className={styles.section}>
        <h3>Button Sizes</h3>
        <div className={styles.buttonRow}>
          <Button size="small">Small Button</Button>
          <Button size="medium">Medium Button</Button>
          <Button size="large">Large Button</Button>
        </div>
      </section>
      
      <section className={styles.section}>
        <h3>Buttons with Icons</h3>
        <div className={styles.buttonRow}>
          <Button icon={<img src={BasketIcon} alt="" />} iconPosition="left">
            Icon Left
          </Button>
          <Button icon={<img src={BasketIcon} alt="" />} iconPosition="right">
            Icon Right
          </Button>
          <Button icon={<img src={BasketIcon} alt="" />} iconPosition="only" ariaLabel="Cart">
            {/* Text not displayed when iconPosition is "only" */}
          </Button>
        </div>
      </section>
      
      <section className={styles.section}>
        <h3>Link Buttons</h3>
        <div className={styles.buttonRow}>
          <Button to="/">Link Button</Button>
          <Button to="/" variant="secondary">Secondary Link</Button>
          <Button to="/" icon={<img src={BasketIcon} alt="" />}>
            Link with Icon
          </Button>
        </div>
      </section>
      
      <section className={styles.section}>
        <h3>Combined Examples</h3>
        <div className={styles.buttonRow}>
          <Button 
            variant="primary" 
            size="large" 
            icon={<img src={BasketIcon} alt="" />}
          >
            Add to Cart
          </Button>
          <Button 
            variant="secondary" 
            size="small" 
            icon={<img src={BasketIcon} alt="" />}
            iconPosition="right"
          >
            View Cart
          </Button>
          <Button 
            variant="tertiary" 
            size="medium" 
            icon={<img src={BasketIcon} alt="" />}
            iconPosition="only"
            ariaLabel="Cart"
          />
        </div>
      </section>
    </div>
  );
};

export default ButtonExamples;
