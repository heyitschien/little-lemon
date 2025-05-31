import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './ReservationPage.module.css';
import DateTimeSelector from '../../components/features/Reservation/DateTimeSelector';
import ReservationForm from '../../components/features/Reservation/ReservationForm';
import ReservationConfirmation from '../../components/features/Reservation/ReservationConfirmation';
import Button from '../../components/common/Button/Button';
import { useReservation } from '../../hooks/useReservation';

/**
 * ReservationPage Component
 * 
 * Main page for the reservation system that manages the reservation flow.
 */
const ReservationPage = () => {
  const navigate = useNavigate();
  
  // Use our custom reservation hook
  const {
    reservationData,
    currentStep,
    confirmedReservation,
    errorMessage,
    handleDateTimeChange,
    handleFormChange,
    handleNextStep: baseHandleNextStep,
    handlePreviousStep: baseHandlePreviousStep,
    handleConfirmReservation: baseHandleConfirmReservation,
    canProceedToNextStep
  } = useReservation();

  // Wrap the step navigation functions to include scroll behavior
  const handleNextStep = () => {
    window.scrollTo(0, 0);
    baseHandleNextStep();
  };

  const handlePreviousStep = () => {
    window.scrollTo(0, 0);
    baseHandlePreviousStep();
  };

  const handleConfirmReservation = async () => {
    const result = await baseHandleConfirmReservation();
    window.scrollTo(0, 0);
    return result;
  };
  
  // Handle returning to home page
  const handleReturnHome = () => {
    window.scrollTo(0, 0);
    navigate('/');
  };
  
  // Render the current step
  const renderStep = () => {
    // Common progress indicator JSX
    const progressIndicator = currentStep < 4 && (
      <div className={styles.stepIndicator}>
        <div className={styles.stepProgress}>
          <div 
            className={`${styles.stepCircle} ${currentStep >= 1 ? styles.activeStep : ''}`}
            aria-label="Step 1: Date & Time"
          >
            1
          </div>
          <div 
            className={`${styles.stepLine} ${currentStep >= 2 ? styles.activeLine : ''}`}
            aria-hidden="true"
          />
          <div 
            className={`${styles.stepCircle} ${currentStep >= 2 ? styles.activeStep : ''}`}
            aria-label="Step 2: Your Information"
          >
            2
          </div>
          <div 
            className={`${styles.stepLine} ${currentStep >= 3 ? styles.activeLine : ''}`}
            aria-hidden="true"
          />
          <div 
            className={`${styles.stepCircle} ${currentStep >= 3 ? styles.activeStep : ''}`}
            aria-label="Step 3: Review & Confirm"
          >
            3
          </div>
        </div>
        
        <div className={styles.stepLabels}>
          <span className={currentStep === 1 ? styles.activeLabel : ''}>Date & Time</span>
          <span className={currentStep === 2 ? styles.activeLabel : ''}>Your Information</span>
          <span className={currentStep === 3 ? styles.activeLabel : ''}>Review & Confirm</span>
        </div>
      </div>
    );

    switch (currentStep) {
      case 1: // Date and Time Selection
        return (
          <div className={styles.stepContainer}>
            {progressIndicator}
            <DateTimeSelector
              selectedDate={reservationData.date}
              selectedTime={reservationData.time}
              partySize={reservationData.partySize}
              onDateChange={(date) => handleDateTimeChange('date', date)}
              onTimeChange={(time) => handleDateTimeChange('time', time)}
              onPartySizeChange={(size) => handleDateTimeChange('partySize', size)}
            />
            
            <div className={styles.navigationButtons}>
              <button 
                className={`${styles.button} ${styles.secondaryButton}`}
                onClick={handleReturnHome}
              >
                Cancel
              </button>
              
              <button 
                className={`${styles.button} ${styles.primaryButton}`}
                onClick={handleNextStep}
                disabled={!canProceedToNextStep()}
              >
                Next: Your Information
              </button>
            </div>
          </div>
        );
        
      case 2: // Personal Information
        return (
          <div className={styles.stepContainer}>
            {progressIndicator}
            <ReservationForm
              formData={reservationData}
              onFormChange={handleFormChange}
            />
            
            <div className={styles.navigationButtons}>
              <button 
                className={`${styles.button} ${styles.secondaryButton}`}
                onClick={handlePreviousStep}
              >
                Back
              </button>
              
              <button 
                className={`${styles.button} ${styles.primaryButton}`}
                onClick={handleNextStep}
                disabled={!canProceedToNextStep()}
              >
                Next: Review & Confirm
              </button>
            </div>
          </div>
        );
        
      case 3: // Review and Confirm
        return (
          <div className={styles.stepContainer}>
            {progressIndicator}
            <ReservationConfirmation
              reservationData={reservationData}
              onConfirm={handleConfirmReservation}
              onModify={handlePreviousStep}
            />
          </div>
        );
        
      case 4: // Success
        return (
          <div className={styles.stepContainer}>
            <h1 className={styles.panelTitle}>Reservation Confirmed!</h1>
            
            <p className={styles.successMessage}>
              Your reservation at Little Lemon has been confirmed. A confirmation email has been sent to {confirmedReservation.email}.
            </p>
            
            <div className={styles.successSummaryCard}>
              <div className={styles.successSummaryHeader}>
                <h3 className={styles.successSummaryTitle}>Your Reservation Details</h3>
              </div>
              <div className={styles.successSummaryContent}>
                <div className={styles.successSummaryItem}>
                  <span className={styles.successSummaryLabel}>Reservation ID:</span>
                  <span className={styles.successSummaryValue}>{confirmedReservation.id}</span>
                </div>
                <div className={styles.successSummaryItem}>
                  <span className={styles.successSummaryLabel}>Date:</span>
                  <span className={styles.successSummaryValue}>{new Date(confirmedReservation.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className={styles.successSummaryItem}>
                  <span className={styles.successSummaryLabel}>Time:</span>
                  <span className={styles.successSummaryValue}>{(confirmedReservation.time.split(':')[0] % 12 || 12) + ':' + confirmedReservation.time.split(':')[1] + (confirmedReservation.time.split(':')[0] >= 12 ? ' PM' : ' AM')}</span>
                </div>
                <div className={styles.successSummaryItem}>
                  <span className={styles.successSummaryLabel}>Party Size:</span>
                  <span className={styles.successSummaryValue}>{confirmedReservation.partySize} {confirmedReservation.partySize === 1 ? 'person' : 'people'}</span>
                </div>
              </div>
            </div>
            
            <div className={styles.successActionButtons}>
              <button 
                className={`${styles.button} ${styles.primaryButton}`}
                onClick={handleReturnHome}
              >
                Return to Home
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className={styles.reservationPage}>
      {errorMessage && (
        <div className={styles.errorMessage}>
          {errorMessage}
        </div>
      )}
      
      {renderStep()}
    </div>
  );
};

export default ReservationPage;