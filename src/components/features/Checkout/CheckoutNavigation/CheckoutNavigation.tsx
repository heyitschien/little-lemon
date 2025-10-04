import React from 'react';
import styles from './CheckoutNavigation.module.css';

interface CheckoutNavigationProps {
  stepIndex: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  isBackDisabled?: boolean;
  isNextDisabled?: boolean;
  isSubmitting?: boolean;
  nextLabel?: string;
}

const CheckoutNavigation: React.FC<CheckoutNavigationProps> = ({
  stepIndex,
  totalSteps,
  onBack,
  onNext,
  isBackDisabled = false,
  isNextDisabled = false,
  isSubmitting = false,
  nextLabel = 'Continue'
}) => {
  const showBack = stepIndex > 0;

  return (
    <footer className={styles.navigationBar}>
      <div className={styles.stepMeta}>
        Step {stepIndex + 1} of {totalSteps}
      </div>
      <div className={styles.actions}>
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            className={styles.backButton}
            disabled={isSubmitting || isBackDisabled}
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          className={styles.nextButton}
          disabled={isSubmitting || isNextDisabled}
        >
          {isSubmitting ? 'Processing…' : nextLabel}
        </button>
      </div>
    </footer>
  );
};

export default CheckoutNavigation;
