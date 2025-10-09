import React, { Suspense, lazy, useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './CheckoutPage.module.css';
import { useCart } from '../../context/useCart';
import { useCheckout } from '../../hooks/useCheckout';
import CheckoutProgress from '../../components/features/Checkout/CheckoutProgress/CheckoutProgress';
import CheckoutNavigation from '../../components/features/Checkout/CheckoutNavigation/CheckoutNavigation';
import { CHECKOUT_STEPS } from '../../types/checkout';
import CheckoutConfirmation from '../../components/features/Checkout/CheckoutConfirmation/CheckoutConfirmation';

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
  const { cartItems, clearCart } = useCart();
  const {
    state,
    getStepIndex,
    getNextStep,
    getPreviousStep,
    setStep,
    runStepProcessor,
    fieldErrors,
    clearFieldErrors,
    setSubmitting,
    setConfirmation,
    resetCheckout
  } = useCheckout();
  const [toast, setToast] = useState(null);

  const isConfirmed = Boolean(state.orderConfirmation);
  const currentIndex = useMemo(() => getStepIndex(state.currentStep), [getStepIndex, state.currentStep]);
  const totalSteps = CHECKOUT_STEPS.length;

  const showNavigation = !isConfirmed;

  const handleReset = useCallback(() => {
    resetCheckout();
    setToast(null);
  }, [resetCheckout]);

  const buildConfirmation = useCallback(() => {
    const now = new Date();
    const confirmationNumber = `LL-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now
      .getDate()
      .toString()
      .padStart(2, '0')}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const etaMinutes = state.fulfillment.method === 'delivery' ? 45 : 20;

    const items = cartItems.map((item) => {
      const modifiers = item.modifiers?.map((modifier) => modifier.name) ?? undefined;
      const modifiersTotal = item.modifiers?.reduce((sum, modifier) => sum + modifier.priceDelta, 0) ?? 0;
      const lineTotal = (item.price + modifiersTotal) * item.quantity;
      return {
        lineId: item.lineId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        modifiers,
        notes: item.notes,
        lineTotal
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const tipAmount = state.payment.tipAmount ?? 0;
    const total = subtotal + tipAmount;

    const fulfillmentDetails = {
      method: state.fulfillment.method,
      pickupTime: state.fulfillment.pickupTime,
      scheduledFor: state.fulfillment.scheduledFor,
      instructions: state.fulfillment.instructions,
      cutlery: state.fulfillment.cutlery,
      address: state.fulfillment.method === 'delivery' ? state.fulfillment.deliveryAddress : undefined
    };

    return {
      orderId: confirmationNumber,
      etaMinutes,
      submittedAt: now.toISOString(),
      fulfillment: fulfillmentDetails,
      contact: state.contact,
      summary: {
        items,
        subtotal,
        tipAmount,
        total
      }
    };
  }, [cartItems, state.contact, state.fulfillment, state.payment.tipAmount]);

  const handlePlaceOrder = useCallback(async () => {
    setSubmitting(true);
    setToast(null);
    try {
      await runStepProcessor(state.currentStep);
      await new Promise((resolve) => setTimeout(resolve, 900));
      setConfirmation(buildConfirmation());
      clearCart();
      setToast({ type: 'success', message: 'Order placed! We’ll have everything ready shortly.' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to place order. Please review your details.';
      setToast({ type: 'error', message });
    } finally {
      setSubmitting(false);
    }
  }, [buildConfirmation, clearCart, runStepProcessor, setConfirmation, setSubmitting, state.currentStep]);

  const handleNext = async () => {
    const nextStep = getNextStep(state.currentStep);
    if (!nextStep) {
      if (state.currentStep === 'review') {
        await handlePlaceOrder();
      }
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

  if (!isConfirmed && cartItems.length === 0) {
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
    <section className={styles.checkoutContainer} aria-labelledby="checkout-title">
      <header className={styles.checkoutHeader}>
        <div>
          <h1 id="checkout-title">Checkout</h1>
          <p>{isConfirmed ? 'Order confirmed' : 'Secure checkout experience'}</p>
        </div>
        {!isConfirmed && <CheckoutProgress currentStep={state.currentStep} steps={CHECKOUT_STEPS} />}
      </header>

      <main className={styles.checkoutContent}>
        {isConfirmed ? (
          <CheckoutConfirmation onStartNewOrder={handleReset} confirmation={state.orderConfirmation} />
        ) : (
          <Suspense fallback={<div className={styles.loadingState}>Loading step…</div>}>
            {getStepComponent(state.currentStep)}
          </Suspense>
        )}
      </main>

      {toast && (
        <div
          className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}
          role="status"
        >
          {toast.message}
        </div>
      )}

      {showNavigation && (
        <CheckoutNavigation
          stepIndex={currentIndex}
          totalSteps={totalSteps}
          onBack={handleBack}
          onNext={handleNext}
          isNextDisabled={Object.keys(fieldErrors).length > 0}
          isSubmitting={state.isSubmitting}
          nextLabel={state.currentStep === 'review' ? 'Place order' : 'Continue'}
        />
      )}
    </section>
  );
};

export default CheckoutPage;
