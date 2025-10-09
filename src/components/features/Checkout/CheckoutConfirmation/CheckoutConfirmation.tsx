import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styles from './CheckoutConfirmation.module.css';
import type { CheckoutConfirmation as CheckoutConfirmationData } from '../../../../types/checkout';

interface CheckoutConfirmationProps {
  confirmation: CheckoutConfirmationData;
  onStartNewOrder: () => void;
}

const formatTime = (iso: string) => {
  const date = new Date(iso);
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};

const CheckoutConfirmation: React.FC<CheckoutConfirmationProps> = ({ confirmation, onStartNewOrder }) => {
  const fulfillmentDetails = useMemo(() => {
    if (confirmation.fulfillment.method === 'delivery') {
      const { address } = confirmation.fulfillment;
      return (
        <div className={styles.detailBlock}>
          <h3>Delivery details</h3>
          {address ? (
            <>
              <p>{address.line1}</p>
              {address.line2 && <p>{address.line2}</p>}
              <p>
                {address.city}, {address.state} {address.postalCode}
              </p>
            </>
          ) : (
            <p>We&apos;ll deliver to the address you provided.</p>
          )}
          {confirmation.fulfillment.instructions && <p className={styles.helper}>{confirmation.fulfillment.instructions}</p>}
        </div>
      );
    }

    return (
      <div className={styles.detailBlock}>
        <h3>Pickup details</h3>
        <p>Your order will be ready in approximately {confirmation.etaMinutes} minutes.</p>
        {confirmation.fulfillment.pickupTime && <p>Scheduled for: {confirmation.fulfillment.pickupTime}</p>}
        {confirmation.fulfillment.instructions && <p className={styles.helper}>{confirmation.fulfillment.instructions}</p>}
      </div>
    );
  }, [confirmation]);

  return (
    <div className={styles.confirmationContainer}>
      <section className={styles.heroCard}>
        <div>
          <span className={styles.label}>Order number</span>
          <h2 className={styles.orderId}>{confirmation.orderId}</h2>
        </div>
        <div>
          <span className={styles.label}>Placed on</span>
          <p>{formatTime(confirmation.submittedAt)}</p>
        </div>
        <div>
          <span className={styles.label}>Estimated {confirmation.fulfillment.method === 'delivery' ? 'delivery' : 'pickup'} time</span>
          <p>{confirmation.etaMinutes} minutes</p>
        </div>
      </section>

      <section className={styles.summarySection}>
        <header className={styles.sectionHeader}>
          <h3>Order summary</h3>
          <p>We&apos;ve sent a confirmation to {confirmation.contact.email} and {confirmation.contact.phone}.</p>
        </header>
        <div className={styles.itemList}>
          {confirmation.summary.items.map((item) => (
            <div key={item.lineId} className={styles.itemRow}>
              <div>
                <div className={styles.itemName}>
                  {item.quantity} × {item.name}
                </div>
                {item.modifiers && item.modifiers.length > 0 && (
                  <div className={styles.itemMeta}>Includes {item.modifiers.join(', ')}</div>
                )}
                {item.notes && <div className={styles.itemMeta}>Notes: {item.notes}</div>}
              </div>
              <div className={styles.itemTotal}>${item.lineTotal.toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className={styles.totalBlock}>
          <div>
            <span>Subtotal</span>
            <span>${confirmation.summary.subtotal.toFixed(2)}</span>
          </div>
          <div>
            <span>Tip</span>
            <span>${confirmation.summary.tipAmount.toFixed(2)}</span>
          </div>
          <div className={styles.grandTotal}>
            <span>Total paid</span>
            <span>${confirmation.summary.total.toFixed(2)}</span>
          </div>
        </div>
      </section>

      <section className={styles.detailsGrid}>
        {fulfillmentDetails}
        <div className={styles.detailBlock}>
          <h3>Contact</h3>
          <p>
            {confirmation.contact.firstName} {confirmation.contact.lastName}
          </p>
          <p>{confirmation.contact.email}</p>
          <p>{confirmation.contact.phone}</p>
          {confirmation.fulfillment.cutlery && <p className={styles.helper}>We&apos;ll include eco-friendly cutlery.</p>}
        </div>
      </section>

      <div className={styles.actions}>
        <button type="button" className={styles.primaryButton} onClick={onStartNewOrder}>
          Start a new order
        </button>
        <Link to="/menu" className={styles.secondaryButton}>
          Browse the menu
        </Link>
      </div>
    </div>
  );
};

export default CheckoutConfirmation;
