import React from 'react'; // Removed useState as internal errors state is no longer needed
import styles from './ReservationForm.module.css';

/**
 * ReservationForm Component
 * 
 * Collects customer information for a reservation.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.formData - Current form data
 * @param {Function} props.onFormChange - Function to call when form data changes
 */
const ReservationForm = ({ formData, onFormChange, formErrors, validateField }) => {
  // Internal 'errors' state and 'validateForm' function removed, using formErrors from props

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
    onFormChange({
      ...formData,
      [name]: processedValue
    });
    
    // On-blur validation will be handled by input's onBlur prop
  };

  // 'validateForm' function removed, validation handled by useReservation hook

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all required fields on form submission
    validateField('name', formData.name);
    validateField('email', formData.email);
    validateField('phone', formData.phone);
    
    // Form submission is still handled by the parent component
    // This validation ensures errors are displayed immediately in tests
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
            onBlur={(e) => validateField(e.target.name, e.target.value)}
            onTouchEnd={(e) => validateField(e.target.name, e.target.value)}
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
            onBlur={(e) => validateField(e.target.name, e.target.value)}
            onTouchEnd={(e) => validateField(e.target.name, e.target.value)}
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
            onBlur={(e) => validateField(e.target.name, e.target.value)}
            onTouchEnd={(e) => validateField(e.target.name, e.target.value)}
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
            onBlur={(e) => validateField(e.target.name, e.target.value)}
            onTouchEnd={(e) => validateField(e.target.name, e.target.value)}
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
            onBlur={(e) => validateField(e.target.name, e.target.value)}
            onTouchEnd={(e) => validateField(e.target.name, e.target.value)}
          />
          {formErrors.specialRequests && <p className={styles.errorText}>{formErrors.specialRequests}</p>}
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;