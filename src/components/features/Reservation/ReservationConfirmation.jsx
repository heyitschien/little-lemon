import React from 'react';
import styles from './ReservationConfirmation.module.css';

/**
 * ReservationConfirmation Component
 * 
 * Displays a summary of the reservation details and provides options for confirming or modifying the reservation.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.reservationData - Reservation data to display
 * @param {Function} props.onConfirm - Function to call when the reservation is confirmed
 * @param {Function} props.onModify - Function to call when the user wants to modify the reservation
 */
const ReservationConfirmation = ({ reservationData, onConfirm, onModify, isSubmitting }) => {
  // Format date for display (e.g., "2023-05-20" to "Saturday, May 20, 2023")
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const [year, month, day] = dateString.split('-').map(Number);
    // Constructing date this way treats components as local time
    return new Date(year, month - 1, day).toLocaleDateString(undefined, options);
  };
  
  // Format time for display (e.g., "17:00" to "5:00 PM")
  const formatTimeForDisplay = (time) => {
    if (!time) return '';
    
    const [hours, minutes] = time.split(':');
    const hoursNum = parseInt(hours, 10);
    const period = hoursNum >= 12 ? 'PM' : 'AM';
    const hours12 = hoursNum % 12 || 12; // Convert 0 to 12 for 12 AM
    
    return `${hours12}:${minutes} ${period}`;
  };
  
  // Handle confirmation
  const handleConfirm = () => {
    onConfirm();
  };
  
  // Handle modification
  const handleModify = () => {
    onModify();
  };
  
  return (
    <div className={styles.confirmationContainer}>
      {/* <h2 className={styles.sectionTitle}>Reservation Summary</h2> */}
      
      <div className={styles.summaryCard}>
        <div className={styles.summaryHeader}>
          <h3 className={styles.summaryTitle}>Reservation Summary</h3>
          {reservationData.id && (
            <p className={styles.reservationId}>Confirmation #{reservationData.id}</p>
          )}
        </div>
        
        <div className={styles.summaryContent}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Date:</span>
            <span className={styles.summaryValue}>{formatDateForDisplay(reservationData.date)}</span>
          </div>
          
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Time:</span>
            <span className={styles.summaryValue}>{formatTimeForDisplay(reservationData.time)}</span>
          </div>
          
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Party Size:</span>
            <span className={styles.summaryValue}>
              {reservationData.partySize} {reservationData.partySize === 1 ? 'person' : 'people'}
            </span>
          </div>
          
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Name:</span>
            <span className={styles.summaryValue}>{reservationData.name}</span>
          </div>
          
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Email:</span>
            <span className={styles.summaryValue}>{reservationData.email}</span>
          </div>
          
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Phone:</span>
            <span className={styles.summaryValue}>{reservationData.phone}</span>
          </div>
          
          {reservationData.occasion && (
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Occasion:</span>
              <span className={styles.summaryValue}>
                {reservationData.occasion.charAt(0).toUpperCase() + reservationData.occasion.slice(1)}
              </span>
            </div>
          )}
          
          {reservationData.specialRequests && (
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Special Requests:</span>
              <span className={styles.summaryValue}>{reservationData.specialRequests}</span>
            </div>
          )}
        </div>
        
        <div className={styles.policyInfo}>
          <p>Please arrive 10 minutes before your reservation time. We hold tables for 15 minutes past the reservation time.</p>
          <p>To cancel or modify your reservation, please call us at (123) 456-7890 at least 2 hours before your reservation time.</p>
        </div>
      </div>
      
      <div className={styles.actionButtons}>
        <button 
          className={`${styles.button} ${styles.modifyButton}`}
          onClick={handleModify}
          aria-label="Modify reservation"
        >
          Modify
        </button>
        
        <button 
          className={`${styles.button} ${styles.confirmButton}`}
          onClick={handleConfirm}
          aria-label="Confirm reservation"
          disabled={isSubmitting} // Disable button when submitting
        >
          {isSubmitting ? 'Submitting...' : 'Confirm Reservation'} {/* Change text based on isSubmitting */}
        </button>
      </div>
    </div>
  );
};

export default ReservationConfirmation;