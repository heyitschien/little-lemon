import React, { useEffect, useState } from 'react';
import { ValidationError } from 'yup';
import styles from './CheckoutFulfillmentStep.module.css';
import { useCheckout } from '../../../../hooks/useCheckout';
import { fulfillmentSchema } from '../../../../utils/validation/checkoutSchemas';
import mapYupErrors from '../../../../utils/validation/mapYupErrors';

const DEFAULT_PICKUP_TIMES = ['ASAP (20 mins)', 'In 30 mins', 'In 45 mins', 'In 1 hour'];
const DEFAULT_DELIVERY_TIMES = ['ASAP (45 mins)', 'Schedule for 6:00 PM', 'Schedule for 6:30 PM'];

const CheckoutFulfillmentStep: React.FC = () => {
  const {
    state,
    updateFulfillment,
    fieldErrors,
    setFieldErrors,
    clearFieldErrors,
    registerStepProcessor
  } = useCheckout();

  const [formState, setFormState] = useState(state.fulfillment);

  useEffect(() => {
    setFormState(state.fulfillment);
  }, [state.fulfillment]);

  useEffect(() => {
    const unregister = registerStepProcessor('fulfillment', async () => {
      try {
        await fulfillmentSchema.validate(formState, { abortEarly: false });
        clearFieldErrors();
        updateFulfillment(formState);
      } catch (error) {
        if (error instanceof ValidationError) {
          const mapped = mapYupErrors(error);
          setFieldErrors(mapped);
        }
        throw error;
      }
    });

    return unregister;
  }, [clearFieldErrors, formState, registerStepProcessor, setFieldErrors, updateFulfillment]);

  const handleFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = event.target;
    const { name, value } = target;
    const isCheckbox = target instanceof HTMLInputElement && target.type === 'checkbox';

    setFormState((prev) => ({
      ...prev,
      [name]: isCheckbox ? target.checked : value
    }));
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      deliveryAddress: {
        line1: prev.deliveryAddress?.line1 ?? '',
        line2: prev.deliveryAddress?.line2 ?? '',
        city: prev.deliveryAddress?.city ?? '',
        state: prev.deliveryAddress?.state ?? '',
        postalCode: prev.deliveryAddress?.postalCode ?? '',
        [name]: value
      }
    }));
  };

  const handleMethodChange = (method: 'pickup' | 'delivery') => {
    setFormState((prev) => ({
      ...prev,
      method,
      deliveryAddress:
        method === 'delivery'
          ? {
              line1: prev.deliveryAddress?.line1 ?? '',
              line2: prev.deliveryAddress?.line2 ?? '',
              city: prev.deliveryAddress?.city ?? '',
              state: prev.deliveryAddress?.state ?? '',
              postalCode: prev.deliveryAddress?.postalCode ?? ''
            }
          : undefined,
      pickupTime: method === 'pickup' ? prev.pickupTime ?? DEFAULT_PICKUP_TIMES[0] : undefined,
      scheduledFor: method === 'delivery' ? prev.scheduledFor ?? DEFAULT_DELIVERY_TIMES[0] : undefined
    }));
    clearFieldErrors();
  };

  const deliveryAddress = formState.deliveryAddress ?? { line1: '', line2: '', city: '', state: '', postalCode: '' };
  const isDelivery = formState.method === 'delivery';

  const invalidAria = (error?: string) => (error ? { 'aria-invalid': 'true' as const } : {});
  const errorFor = (key: string) => fieldErrors[key];
  const pressedProps = (pressed: boolean) => (pressed ? { 'aria-pressed': 'true' as const } : {});

  return (
    <form className={styles.fulfillmentForm}>
      <div className={styles.methodToggle} role="group" aria-label="Select fulfillment method">
        <button
          type="button"
          className={`${styles.methodButton} ${!isDelivery ? styles.methodButtonActive : ''}`}
          onClick={() => handleMethodChange('pickup')}
          {...pressedProps(!isDelivery)}
        >
          Pickup at Little Lemon
        </button>
        <button
          type="button"
          className={`${styles.methodButton} ${isDelivery ? styles.methodButtonActive : ''}`}
          onClick={() => handleMethodChange('delivery')}
          {...pressedProps(isDelivery)}
        >
          Delivery to you
        </button>
      </div>

      {!isDelivery ? (
        <div className={styles.section}>
          <div className={styles.field}>
            <label htmlFor="pickupTime" className={styles.label}>
              Pickup time
            </label>
            <select
              id="pickupTime"
              name="pickupTime"
              className={styles.select}
              value={formState.pickupTime ?? DEFAULT_PICKUP_TIMES[0]}
              onChange={handleFieldChange}
              {...invalidAria(errorFor('pickupTime'))}
            >
              {DEFAULT_PICKUP_TIMES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errorFor('pickupTime') ? (
              <span className={styles.errorText}>{errorFor('pickupTime')}</span>
            ) : (
              <span className={styles.helperText}>We&apos;ll text when your order is ready.</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="instructions" className={styles.label}>
              Special instructions (optional)
            </label>
            <textarea
              id="instructions"
              name="instructions"
              className={styles.textarea}
              value={formState.instructions ?? ''}
              onChange={handleFieldChange}
              {...invalidAria(errorFor('instructions'))}
            />
            {errorFor('instructions') && <span className={styles.errorText}>{errorFor('instructions')}</span>}
          </div>
        </div>
      ) : (
        <div className={styles.section}>
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <label htmlFor="line1" className={styles.label}>
                Street address
              </label>
              <input
                id="line1"
                name="line1"
                className={styles.input}
                value={deliveryAddress.line1}
                onChange={handleAddressChange}
                {...invalidAria(errorFor('deliveryAddress.line1'))}
              />
              {errorFor('deliveryAddress.line1') && (
                <span className={styles.errorText}>{errorFor('deliveryAddress.line1')}</span>
              )}
            </div>
            <div className={styles.field}>
              <label htmlFor="line2" className={styles.label}>
                Apartment / suite (optional)
              </label>
              <input
                id="line2"
                name="line2"
                className={styles.input}
                value={deliveryAddress.line2 ?? ''}
                onChange={handleAddressChange}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="city" className={styles.label}>
                City
              </label>
              <input
                id="city"
                name="city"
                className={styles.input}
                value={deliveryAddress.city}
                onChange={handleAddressChange}
                {...invalidAria(errorFor('deliveryAddress.city'))}
              />
              {errorFor('deliveryAddress.city') && (
                <span className={styles.errorText}>{errorFor('deliveryAddress.city')}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="state" className={styles.label}>
                State
              </label>
              <input
                id="state"
                name="state"
                className={styles.input}
                value={deliveryAddress.state}
                onChange={handleAddressChange}
                {...invalidAria(errorFor('deliveryAddress.state'))}
              />
              {errorFor('deliveryAddress.state') && (
                <span className={styles.errorText}>{errorFor('deliveryAddress.state')}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="postalCode" className={styles.label}>
                Postal code
              </label>
              <input
                id="postalCode"
                name="postalCode"
                className={styles.input}
                value={deliveryAddress.postalCode}
                onChange={handleAddressChange}
                {...invalidAria(errorFor('deliveryAddress.postalCode'))}
              />
              {errorFor('deliveryAddress.postalCode') && (
                <span className={styles.errorText}>{errorFor('deliveryAddress.postalCode')}</span>
              )}
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="scheduledFor" className={styles.label}>
              Delivery time
            </label>
            <select
              id="scheduledFor"
              name="scheduledFor"
              className={styles.select}
              value={formState.scheduledFor ?? DEFAULT_DELIVERY_TIMES[0]}
              onChange={handleFieldChange}
              {...invalidAria(errorFor('scheduledFor'))}
            >
              {DEFAULT_DELIVERY_TIMES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errorFor('scheduledFor') && <span className={styles.errorText}>{errorFor('scheduledFor')}</span>}
          </div>
        </div>
      )}

      <div className={styles.toggleRow}>
        <input
          id="cutlery"
          name="cutlery"
          type="checkbox"
          checked={Boolean(formState.cutlery)}
          onChange={handleFieldChange}
          {...invalidAria(errorFor('cutlery'))}
        />
        <label htmlFor="cutlery">Include cutlery</label>
      </div>
    </form>
  );
};

export default CheckoutFulfillmentStep;
