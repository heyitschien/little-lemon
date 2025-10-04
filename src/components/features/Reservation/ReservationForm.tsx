import React from 'react';
import styles from './ReservationForm.module.css';
import type { ReservationFormData, ReservationFormErrors } from '../../../types/reservation';

interface ReservationFormProps {
  formData: ReservationFormData;
  onFormChange: (nextForm: ReservationFormData) => void;
  formErrors: ReservationFormErrors;
  validateField: (field: keyof ReservationFormData, value: string | number) => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  formData,
  onFormChange,
  formErrors,
  validateField
}) => {
  // Internal 'errors' state and 'validateForm' function removed, using formErrors from props

  // Handle input changes
  const handleInputChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = (event) => {
    const { name, value } = event.currentTarget;
    const fieldName = name as keyof ReservationFormData;
    let processedValue = value;

    if (name === 'phone') {
      // Remove all non-digit characters
      const digits = value.replace(/\D/g, '');
      // Apply formatting XXX-XXX-XXXX
      if (digits.length <= 3) {
        processedValue = digits;
      } else if (digits.length <= 6) {
        processedValue = `${digits.slice(0, 3)}-${digits.slice(3)}`;
      } else {
        processedValue = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      }
    }

    // Update form data
    const nextForm = {
      ...formData,
      [fieldName]: processedValue
    } as ReservationFormData;

    onFormChange(nextForm);

    // On-blur validation will be handled by input's onBlur prop
  };

  // 'validateForm' function removed, validation handled by useReservation hook

  // Handle form submission
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    // Validate all required fields on form submission
    validateField('name', formData.name);
    validateField('email', formData.email);
    validateField('phone', formData.phone);

    // Form submission is still handled by the parent component
    // This validation ensures errors are displayed immediately in tests
  };

  const validateFromTarget = (target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) => {
    const { name, value } = target;
    validateField(name as keyof ReservationFormData, value);
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = (event) => {
    validateFromTarget(event.currentTarget);
  };

  const handleTouchEnd: React.TouchEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = (event) => {
    validateFromTarget(event.currentTarget);
  };

  return (
    <div className={styles.reservationForm}>
      <h2 className={styles.sectionTitle}>Your Information</h2>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={styles.textInput}
            value={formData.name || ''}
            onChange={handleInputChange}
            placeholder="John Doe"
            required
            onBlur={handleBlur}
            onTouchEnd={handleTouchEnd}
          />
          {formErrors.name && <p className={styles.errorText}>{formErrors.name}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.textInput}
            value={formData.email || ''}
            onChange={handleInputChange}
            placeholder="john.doe@example.com"
            required
            onBlur={handleBlur}
            onTouchEnd={handleTouchEnd}
          />
          {formErrors.email && <p className={styles.errorText}>{formErrors.email}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.label}>
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className={styles.textInput}
            value={formData.phone || ''}
            onChange={handleInputChange}
            placeholder="(123) 456-7890"
            required
            onBlur={handleBlur}
            onTouchEnd={handleTouchEnd}
          />
          {formErrors.phone && <p className={styles.errorText}>{formErrors.phone}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="occasion" className={styles.label}>
            Occasion (Optional)
          </label>
          <select
            id="occasion"
            name="occasion"
            className={styles.selectInput}
            value={formData.occasion || ''}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onTouchEnd={handleTouchEnd}
          >
            <option value="">Select an occasion</option>
            <option value="birthday">Birthday</option>
            <option value="anniversary">Anniversary</option>
            <option value="date">Date Night</option>
            <option value="business">Business Meal</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="specialRequests" className={styles.label}>
            Special Requests (Optional)
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            className={styles.textareaInput}
            value={formData.specialRequests || ''}
            onChange={handleInputChange}
            placeholder="Any allergies, dietary restrictions, or special requests?"
            rows={4}
            onBlur={handleBlur}
            onTouchEnd={handleTouchEnd}
          />
          {formErrors.specialRequests && <p className={styles.errorText}>{formErrors.specialRequests}</p>}
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;