// src/components/ChatAssistant/LoadingIndicator.jsx
import React from 'react';
import styles from './ChatAssistant.module.css';

const LoadingIndicator = () => {
  return (
    <div className={styles.loadingIndicator}>
      <span className={styles.dot}></span>
      <span className={styles.dot}></span>
      <span className={styles.dot}></span>
    </div>
  );
};

export default LoadingIndicator;
