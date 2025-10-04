import React from 'react';
import styles from './CheckoutProgress.module.css';
import type { CheckoutStep } from '../../../../types/checkout';

const STEP_LABELS: Record<CheckoutStep, string> = {
  contact: 'Contact',
  fulfillment: 'Fulfillment',
  payment: 'Payment',
  review: 'Review'
};

export interface CheckoutProgressProps {
  currentStep: CheckoutStep;
  steps: CheckoutStep[];
}

const CheckoutProgress: React.FC<CheckoutProgressProps> = ({ currentStep, steps }) => {
  return (
    <ol className={styles.progressList} aria-label="Checkout progress">
      {steps.map((step, index) => {
        const isCompleted = steps.indexOf(currentStep) > index;
        const isActive = currentStep === step;
        return (
          <li
            key={step}
            className={`${styles.progressItem} ${isCompleted ? styles.completed : ''} ${isActive ? styles.active : ''}`.trim()}
            aria-current={isActive ? 'step' : undefined}
          >
            <span className={styles.stepMarker}>
              {isCompleted ? (
                <span aria-hidden="true">✓</span>
              ) : (
                index + 1
              )}
            </span>
            <span className={styles.stepLabel}>{STEP_LABELS[step]}</span>
          </li>
        );
      })}
    </ol>
  );
};

export default CheckoutProgress;
