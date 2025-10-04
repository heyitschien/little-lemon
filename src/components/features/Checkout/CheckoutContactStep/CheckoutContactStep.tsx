import React, { useEffect, useState } from 'react';
import { ValidationError } from 'yup';
import styles from './CheckoutContactStep.module.css';
import { useCheckout } from '../../../../hooks/useCheckout';
import { contactSchema } from '../../../../utils/validation/checkoutSchemas';
import mapYupErrors from '../../../../utils/validation/mapYupErrors';

const CheckoutContactStep: React.FC = () => {
  const { state, updateContact, fieldErrors, setFieldErrors, clearFieldErrors, registerStepProcessor } = useCheckout();
  const [formState, setFormState] = useState(state.contact);

  useEffect(() => {
    setFormState(state.contact);
  }, [state.contact]);

  useEffect(() => {
    const unregister = registerStepProcessor('contact', async () => {
      try {
        await contactSchema.validate(formState, { abortEarly: false });
        clearFieldErrors();
        updateContact(formState);
      } catch (error) {
        if (error instanceof ValidationError) {
          const mapped = mapYupErrors(error);
          setFieldErrors(mapped);
        }
        throw error;
      }
    });

    return unregister;
  }, [clearFieldErrors, formState, registerStepProcessor, setFieldErrors, updateContact]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const invalidAria = (error?: string) => (error ? { 'aria-invalid': 'true' as const } : {});

  return (
    <form className={styles.contactForm} noValidate>
      <div className={styles.field}>
        <label htmlFor="firstName" className={styles.label}>
          First name
        </label>
        <input
          id="firstName"
          name="firstName"
          value={formState.firstName}
          onChange={handleChange}
          className={styles.input}
          {...invalidAria(fieldErrors.firstName)}
        />
        {fieldErrors.firstName ? (
          <span className={styles.errorText}>{fieldErrors.firstName}</span>
        ) : (
          <span className={styles.helperText}>Who should we contact about this order?</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="lastName" className={styles.label}>
          Last name
        </label>
        <input
          id="lastName"
          name="lastName"
          value={formState.lastName}
          onChange={handleChange}
          className={styles.input}
          {...invalidAria(fieldErrors.lastName)}
        />
        {fieldErrors.lastName ? (
          <span className={styles.errorText}>{fieldErrors.lastName}</span>
        ) : (
          <span className={styles.helperText}>We&apos;ll address you properly when we call.</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formState.email}
          onChange={handleChange}
          className={styles.input}
          {...invalidAria(fieldErrors.email)}
        />
        {fieldErrors.email ? (
          <span className={styles.errorText}>{fieldErrors.email}</span>
        ) : (
          <span className={styles.helperText}>Order confirmations and receipts will go here.</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="phone" className={styles.label}>
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          value={formState.phone}
          onChange={handleChange}
          className={styles.input}
          {...invalidAria(fieldErrors.phone)}
        />
        {fieldErrors.phone ? (
          <span className={styles.errorText}>{fieldErrors.phone}</span>
        ) : (
          <span className={styles.helperText}>We&apos;ll text updates if you opt into notifications.</span>
        )}
      </div>
    </form>
  );
};

export default CheckoutContactStep;
