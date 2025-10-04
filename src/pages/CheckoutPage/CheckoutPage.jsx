import React, { Suspense, lazy } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { Link } from 'react-router-dom';
import styles from './CheckoutPage.module.css';
import { getStripe } from '../../config/stripe';
import { useCart } from '../../context/useCart';
import { useCheckout } from '../../hooks/useCheckout';
import CheckoutProgress from '../../components/features/Checkout/CheckoutProgress/CheckoutProgress';
import CheckoutNavigation from '../../components/features/Checkout/CheckoutNavigation/CheckoutNavigation';
import { CHECKOUT_STEPS } from '../../types/checkout';

const ContactStep = lazy(() => import('../../components/features/Checkout/CheckoutContactStep/CheckoutContactStep'));
const FulfillmentStep = lazy(() => import('../../components/features/Checkout/CheckoutFulfillmentStep/CheckoutFulfillmentStep'));
const PaymentStep = lazy(() => import('../../components/features/Checkout/CheckoutPaymentStep/CheckoutPaymentStep'));
const ReviewStep = lazy(() => import('../../components/features/Checkout/CheckoutReviewStep/CheckoutReviewStep'));

const getStepComponent = (step) => {
  switch (step) {
    case 'contact':
      return <ContactStep />;
    case 'fulfillment':
      return <FulfillmentStep />;
    case 'payment':
      return <PaymentStep />;
    case 'review':
      return <ReviewStep />;
    default:
      return null;
  }
};

const CheckoutPage = () => {
  const stripePromise = getStripe();
  const { cartItems } = useCart();
  const {
    state,
    getStepIndex,
    getNextStep,
    getPreviousStep,
    setStep,
    runStepProcessor,
    fieldErrors,
    clearFieldErrors
  } = useCheckout();

  const currentIndex = getStepIndex(state.currentStep);
  const totalSteps = CHECKOUT_STEPS.length;

  const handleNext = async () => {
    const nextStep = getNextStep(state.currentStep);
    if (!nextStep) {
      return;
    }

    try {
      await runStepProcessor(state.currentStep);
      clearFieldErrors();
      setStep(nextStep);
    } catch (error) {
      console.warn('Validation failed, staying on current step', error);
    }
  };

  const handleBack = () => {
    const prevStep = getPreviousStep(state.currentStep);
    if (!prevStep) {
      return;
    }
    clearFieldErrors();
    setStep(prevStep);
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h1>Your cart is empty</h1>
        <p>Add items to your cart before checking out.</p>
        <Link to="/menu" className={styles.emptyStateLink}>
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ appearance: { theme: 'stripe' } }}>
      <section className={styles.checkoutContainer} aria-labelledby="checkout-title">
        <header className={styles.checkoutHeader}>
          <div>
            <h1 id="checkout-title">Checkout</h1>
            <p>Secure checkout powered by Stripe</p>
          </div>
          <CheckoutProgress currentStep={state.currentStep} steps={CHECKOUT_STEPS} />
        </header>

        <main className={styles.checkoutContent}>
          <Suspense fallback={<div className={styles.loadingState}>Loading step…</div>}>
            {getStepComponent(state.currentStep)}
          </Suspense>
        </main>

        <CheckoutNavigation
          stepIndex={currentIndex}
          totalSteps={totalSteps}
          onBack={handleBack}
          onNext={handleNext}
          isNextDisabled={Object.keys(fieldErrors).length > 0}
          nextLabel={state.currentStep === 'review' ? 'Place order' : 'Continue'}
        />
      </section>
    </Elements>
  );
};

export default CheckoutPage;
