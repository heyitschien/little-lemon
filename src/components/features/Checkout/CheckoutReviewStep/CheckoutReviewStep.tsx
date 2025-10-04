import React, { useEffect, useMemo, useState } from 'react';
import styles from './CheckoutReviewStep.module.css';
import { useCheckout } from '../../../../hooks/useCheckout';
import { useCart } from '../../../../context/useCart';
import { reviewSchema } from '../../../../utils/validation/checkoutSchemas';
import mapYupErrors from '../../../../utils/validation/mapYupErrors';
import { ValidationError } from 'yup';

const CheckoutReviewStep: React.FC = () => {
  const {
    state,
    updatePayment,
    setFieldErrors,
    clearFieldErrors,
    registerStepProcessor,
    setTermsAccepted,
    fieldErrors
  } = useCheckout();
  const { cartItems, cartSubtotal } = useCart();

  const [termsAccepted, setTermsAcceptedLocal] = useState(state.termsAccepted);

  useEffect(() => {
    setTermsAcceptedLocal(state.termsAccepted);
  }, [state.termsAccepted]);

  const tipAmount = useMemo(() => state.payment.tipAmount ?? 0, [state.payment.tipAmount]);
  const total = useMemo(() => cartSubtotal + tipAmount, [cartSubtotal, tipAmount]);

  useEffect(() => {
    const unregister = registerStepProcessor('review', async () => {
      try {
        await reviewSchema.validate({ termsAccepted }, { abortEarly: false });
        clearFieldErrors();
        setTermsAccepted(termsAccepted);
        updatePayment({
          ...state.payment,
          tipAmount
        });
      } catch (error) {
        if (error instanceof ValidationError) {
          setFieldErrors(mapYupErrors(error));
        }
        throw error;
      }
    });

    return unregister;
  }, [clearFieldErrors, registerStepProcessor, setFieldErrors, setTermsAccepted, state.payment, termsAccepted, tipAmount, updatePayment]);

  const handleTermsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setTermsAcceptedLocal(checked);
    if (checked) {
      clearFieldErrors();
    }
  };

  return (
    <div className={styles.reviewContainer}>
      <section className={styles.summarySection}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Order summary</h2>
          <p className={styles.sectionDescription}>Review your items and confirm the details before placing the order.</p>
        </header>

        <div className={styles.list}>
          {cartItems.map((item) => {
            const modifiersTotal = item.modifiers?.reduce((sum, modifier) => sum + modifier.priceDelta, 0) ?? 0;
            const lineTotal = (item.price + modifiersTotal) * item.quantity;
            return (
              <div key={item.lineId} className={styles.listItem}>
                <div>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemMeta}>
                    {item.quantity} × ${item.price.toFixed(2)}
                    {modifiersTotal > 0 && ` + $${modifiersTotal.toFixed(2)} modifiers`}
                  </div>
                  {item.notes && <div className={styles.itemMeta}>Notes: “{item.notes}”</div>}
                </div>
                <div className={styles.itemName}>${lineTotal.toFixed(2)}</div>
              </div>
            );
          })}
        </div>

        <div className={styles.divider} />

        <div className={styles.list}>
          <div className={styles.listItem}>
            <span className={styles.itemMeta}>Subtotal</span>
            <span className={styles.itemName}>${cartSubtotal.toFixed(2)}</span>
          </div>
          <div className={styles.listItem}>
            <span className={styles.itemMeta}>Tip</span>
            <span className={styles.itemName}>${tipAmount.toFixed(2)}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Total due today</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </section>

      <section className={styles.summarySection}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Confirm and place order</h2>
          <p className={styles.sectionDescription}>By placing your order you agree to Little Lemon’s terms and confirm the above details.</p>
        </header>

        <label className={styles.termsRow} htmlFor="termsAccepted">
          <input
            id="termsAccepted"
            type="checkbox"
            checked={termsAccepted}
            onChange={handleTermsChange}
            aria-invalid={fieldErrors.termsAccepted ? 'true' : undefined}
          />
          <span>I have reviewed my order details and accept the terms of service.</span>
        </label>
        {fieldErrors.termsAccepted && <div className={styles.errorText}>{fieldErrors.termsAccepted}</div>}
        <p className={styles.helperText}>You will receive confirmation via email and SMS shortly after placing the order.</p>
      </section>
    </div>
  );
};

export default CheckoutReviewStep;
