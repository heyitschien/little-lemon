import React, { useState } from 'react';
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
const ReservationForm = ({ formData, onFormChange }) => {
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    onFormChange({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate name
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    // Validate email
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
      isValid = false;
    }
    
    // Validate phone
    if (!formData.phone || !/^[\d\s()\-+]+$/.test(formData.phone)) {
      newErrors.phone = 'Valid phone number is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // If validation passes, the parent component will handle the next step
      // This is triggered by the onFormChange calls
    }
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
          />
          {errors.name && <p className={styles.errorText}>{errors.name}</p>}
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
          />
          {errors.email && <p className={styles.errorText}>{errors.email}</p>}
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
          />
          {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}
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
          />
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;