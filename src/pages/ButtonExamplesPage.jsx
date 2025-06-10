import React from 'react';
import ButtonExamples from '../components/common/Button/ButtonExamples';
import styles from './ButtonExamplesPage.module.css';

const ButtonExamplesPage = () => {
  return (
    <div className={styles.container}>
      <h1>Button Component Library</h1>
      <p className={styles.description}>
        This page demonstrates the standardized button components available for use across the Little Lemon application.
        All buttons follow the design system guidelines for colors, typography, and accessibility.
      </p>
      <ButtonExamples />
    </div>
  );
};

export default ButtonExamplesPage;
