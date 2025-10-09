import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ValidationError } from 'yup';
import styles from './CheckoutPaymentStep.module.css';
import { useCheckout } from '../../../../hooks/useCheckout';
import { useCart } from '../../../../context/useCart';
import { paymentSchema } from '../../../../utils/validation/checkoutSchemas';
import mapYupErrors from '../../../../utils/validation/mapYupErrors';

const TIP_PERCENT_PRESETS: ReadonlyArray<number> = [0, 10, 15, 20];

const MOCK_PAYMENT_METHOD = {
  id: 'pm_mock_4242',
  brand: 'visa',
  last4: '4242',
  number: '4242 4242 4242 4242',
  expiry: '04 / 27'
} as const;

const delay = (ms: number) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const CheckoutPaymentStep: React.FC = () => {
  const {
    state,
    updatePayment,
    setFieldErrors,
    clearFieldErrors,
    registerStepProcessor
  } = useCheckout();

  const { cartSubtotal } = useCart();
  const { payment } = state;

  const inferTipPercent = useCallback(() => {
    if (cartSubtotal <= 0) {
      return TIP_PERCENT_PRESETS[0];
    }
    const percent = Math.round((payment.tipAmount / cartSubtotal) * 100);
    return TIP_PERCENT_PRESETS.includes(percent) ? percent : -1;
  }, [cartSubtotal, payment.tipAmount]);

  const [tipPercent, setTipPercent] = useState<number>(() => inferTipPercent());
  const [customTip, setCustomTip] = useState<string>(() => {
    const initialPercent = inferTipPercent();
    return initialPercent >= 0 ? '' : String(payment.tipAmount ?? '');
  });
  const [saveCard, setSaveCard] = useState<boolean>(payment.saveCard ?? false);
  const [billingSameAsContact, setBillingSameAsContact] = useState<boolean>(payment.billingSameAsContact ?? true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<
    | null
    | {
        type: 'success' | 'error';
        message: string;
      }
  >(null);

  useEffect(() => {
    const inferredPercent = inferTipPercent();
    setTipPercent(inferredPercent);
    setCustomTip(inferredPercent >= 0 ? '' : String(payment.tipAmount ?? ''));
    setSaveCard(payment.saveCard ?? false);
    setBillingSameAsContact(payment.billingSameAsContact ?? true);
  }, [inferTipPercent, payment.billingSameAsContact, payment.saveCard, payment.tipAmount]);

  const tipAmount = useMemo(() => {
    if (tipPercent >= 0) {
      return Number(((cartSubtotal * tipPercent) / 100).toFixed(2));
    }
    const parsed = Number(customTip);
    return Number.isFinite(parsed) ? Math.max(0, Number(parsed.toFixed(2))) : 0;
  }, [cartSubtotal, customTip, tipPercent]);

  const handleTipPreset = (value: number) => {
    clearFieldErrors();
    setPaymentStatus(null);
    setTipPercent(value);
    setCustomTip('');
  };

  const handleCustomTipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    clearFieldErrors();
    setPaymentStatus(null);
    setTipPercent(-1);
    setCustomTip(event.target.value);
  };

  const cardDisplay = useMemo(() => {
    const hasSaved = Boolean(payment.paymentMethodId);
    const brand = payment.paymentMethodBrand ?? MOCK_PAYMENT_METHOD.brand;
    const last4 = payment.paymentLast4 ?? MOCK_PAYMENT_METHOD.last4;
    return {
      brand,
      number: hasSaved ? `**** **** **** ${last4}` : MOCK_PAYMENT_METHOD.number,
      badge: hasSaved ? 'Mock card saved' : 'Demo mock card',
      expiry: MOCK_PAYMENT_METHOD.expiry,
      cvv: '123',
      saved: hasSaved
    } as const;
  }, [payment.paymentLast4, payment.paymentMethodBrand, payment.paymentMethodId]);

  const runValidation = useCallback(async () => {
    try {
      await paymentSchema.validate(
        {
          tipAmount,
          saveCard,
          billingSameAsContact,
          paymentMethodId: payment.paymentMethodId,
          paymentMethodBrand: payment.paymentMethodBrand,
          paymentLast4: payment.paymentLast4
        },
        { abortEarly: false }
      );
      clearFieldErrors();
    } catch (error) {
      if (error instanceof ValidationError) {
        setFieldErrors(mapYupErrors(error));
      }
      throw error;
    }
  }, [billingSameAsContact, clearFieldErrors, payment.paymentLast4, payment.paymentMethodBrand, payment.paymentMethodId, saveCard, setFieldErrors, tipAmount]);

  useEffect(() => {
    const unregister = registerStepProcessor('payment', async () => {
      await runValidation();
      updatePayment({
        ...payment,
        paymentMethodId: payment.paymentMethodId ?? (saveCard ? MOCK_PAYMENT_METHOD.id : undefined),
        paymentMethodBrand: payment.paymentMethodBrand ?? (saveCard ? MOCK_PAYMENT_METHOD.brand : undefined),
        paymentLast4: payment.paymentLast4 ?? (saveCard ? MOCK_PAYMENT_METHOD.last4 : undefined),
        tipAmount,
        saveCard,
        billingSameAsContact
      });
    });

    return unregister;
  }, [billingSameAsContact, payment, registerStepProcessor, runValidation, saveCard, tipAmount, updatePayment]);

  const handleSavePaymentMethod = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsProcessing(true);
    setPaymentStatus(null);

    try {
      await runValidation();
      await delay(600);

      updatePayment({
        ...payment,
        paymentMethodId: MOCK_PAYMENT_METHOD.id,
        paymentMethodBrand: MOCK_PAYMENT_METHOD.brand,
        paymentLast4: MOCK_PAYMENT_METHOD.last4,
        tipAmount,
        saveCard,
        billingSameAsContact
      });

      setPaymentStatus({ type: 'success', message: 'Mock card saved. You can continue to review.' });
    } catch (error) {
      if (error instanceof Error) {
        setPaymentStatus({ type: 'error', message: error.message });
      } else {
        setPaymentStatus({ type: 'error', message: 'Something went wrong saving your payment details.' });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const tipButtons = TIP_PERCENT_PRESETS.map((amount) => {
    const isActive = tipPercent === amount;
    const pressedProps = isActive ? { 'aria-pressed': 'true' as const } : {};
    return (
      <button
        key={amount}
        type="button"
        className={`${styles.tipButton} ${isActive ? styles.tipButtonActive : ''}`}
        onClick={() => handleTipPreset(amount)}
        {...pressedProps}
      >
        {amount === 0 ? 'No tip' : `${amount}%`}
      </button>
    );
  });

  return (
    <form className={styles.paymentForm} onSubmit={handleSavePaymentMethod} noValidate>
      <div className={styles.sectionHeading}>
        <h2 className={styles.sectionTitle}>Payment details</h2>
        <p className={styles.sectionDescription}>Demo checkout only — no cards are charged. Save the mock card to continue.</p>
      </div>

      <div className={styles.section}>
        <div>
          <h3 className={styles.sectionTitle}>Add a tip</h3>
          <p className={styles.sectionDescription}>100% of tips go directly to our Little Lemon staff.</p>
        </div>
        <div className={styles.tipSelector} role="group" aria-label="Select a tip amount">
          {tipButtons}
          <div className={styles.customTipWrapper}>
            <label htmlFor="customTip" className={styles.helperText}>
              Custom tip amount
            </label>
            <input
              id="customTip"
              type="number"
              min="0"
              step="0.5"
              className={styles.tipCustomInput}
              value={tipPercent >= 0 ? '' : customTip}
              onChange={handleCustomTipChange}
              aria-label="Custom tip amount"
            />
          </div>
        </div>
        <p className={styles.helperText}>You can always adjust your tip before placing the order.</p>
      </div>

      <div className={styles.section}>
        <div>
          <h3 className={styles.sectionTitle}>Card information</h3>
          <p className={styles.sectionDescription}>We autofill a mock Visa ending in 4242 so you can explore the flow.</p>
        </div>
        <div className={styles.cardWrapper}>
          <div className={styles.mockCard} aria-label="Mock payment card preview">
            <div className={styles.mockCardHeader}>
              <span className={styles.mockCardBrand}>{cardDisplay.brand.toUpperCase()}</span>
              <span className={styles.mockCardBadge}>{cardDisplay.badge}</span>
            </div>
            <div className={styles.mockCardNumber}>{cardDisplay.number}</div>
            <div className={styles.mockCardMeta}>
              <span>
                <strong>Exp</strong> {cardDisplay.expiry}
              </span>
              <span>
                <strong>CVV</strong> {cardDisplay.cvv}
              </span>
            </div>
          </div>
          <p className={styles.helperText}>Use the button below to &quot;save&quot; this mock payment method and unlock the review step.</p>
        </div>
        <div className={styles.checkRow}>
          <input
            id="saveCard"
            type="checkbox"
            checked={saveCard}
            onChange={(event) => {
              setPaymentStatus(null);
              setSaveCard(event.target.checked);
            }}
          />
          <label htmlFor="saveCard">Securely save this card for future orders</label>
        </div>
        <div className={styles.checkRow}>
          <input
            id="billingSameAsContact"
            type="checkbox"
            checked={billingSameAsContact}
            onChange={(event) => {
              setPaymentStatus(null);
              setBillingSameAsContact(event.target.checked);
            }}
          />
          <label htmlFor="billingSameAsContact">Billing details match my contact info</label>
        </div>
        <button type="submit" className={styles.tipButton} disabled={isProcessing} aria-live="polite">
          {isProcessing ? 'Saving...' : 'Save payment method'}
        </button>
        {paymentStatus && (
          <div
            className={`${styles.paymentStatus} ${
              paymentStatus.type === 'success' ? styles.paymentStatusSuccess : styles.paymentStatusError
            }`}
            role="status"
          >
            {paymentStatus.message}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeading}>
          <h3 className={styles.sectionTitle}>Order summary</h3>
          <p className={styles.sectionDescription}>We&apos;ll calculate taxes and delivery fees on the next step.</p>
        </div>
        <div className={styles.summaryList}>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${cartSubtotal.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Tip</span>
            <span>${tipAmount.toFixed(2)}</span>
          </div>
          <div className={styles.divider} />
          <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
            <span>Total due today</span>
            <span>${(cartSubtotal + tipAmount).toFixed(2)}</span>
          </div>
        </div>
        <p className={styles.processingNote}>We&apos;ll place a temporary hold on your card until your order is completed.</p>
      </div>
    </form>
  );
};

export default CheckoutPaymentStep;
