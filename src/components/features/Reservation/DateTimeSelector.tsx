import React, { useEffect, useMemo, useRef } from 'react';
import styles from './DateTimeSelector.module.css';
import type {
  PartySizeValue,
  ReservationField,
  ReservationFieldValue,
  ReservationFormErrors
} from '../../../types/reservation';

interface DateTimeSelectorProps {
  selectedDate: string;
  selectedTime: string;
  partySize: PartySizeValue;
  availableTimes: string[];
  isLoadingTimes: boolean;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onPartySizeChange: (size: PartySizeValue) => void;
  formErrors: ReservationFormErrors;
  validateField: (field: ReservationField, value: ReservationFieldValue) => void;
}

const DateTimeSelectorComponent: React.FC<DateTimeSelectorProps> = React.memo(({
  selectedDate,
  selectedTime,
  partySize,
  availableTimes,
  isLoadingTimes,
  onDateChange,
  onTimeChange,
  onPartySizeChange,
  formErrors,
  validateField
}) => {
  // const [dateError, setDateError] = useState(''); // Removed, using formErrors from props
  
  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  // Calculate the max date (6 months from today)
  const maxDateString = useMemo(() => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 6);
    return maxDate.toISOString().split('T')[0];
  }, []);
  
  // Internal date validation useEffect removed, will rely on formErrors from useReservation hook

  // Effect to reset selected time if it's no longer in the availableTimes prop
  useEffect(() => {
    if (selectedDate && selectedTime && availableTimes.length > 0 && !availableTimes.includes(selectedTime)) {
      onTimeChange(''); // Reset time if the current selection is not in the new list
    }
    // This effect should run when availableTimes changes, or when selectedDate/Time changes, to re-validate.
  }, [selectedDate, selectedTime, availableTimes, onTimeChange]);
  
  // Handle date change
  const handleDateChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const newDate = event.currentTarget.value;
    onDateChange(newDate);
  };
  
  // Handle time change
  const handleTimeChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const newTime = event.currentTarget.value;
    onTimeChange(newTime);
  };
  
  // Handle party size change
  const handlePartySizeChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const rawValue = event.currentTarget.value;
    if (rawValue === '') {
      onPartySizeChange('');
      return;
    }

    const parsed = parseInt(rawValue, 10);
    onPartySizeChange(Number.isNaN(parsed) ? '' : parsed);
  };
  
  // Format time for display (e.g., "17:00" to "5:00 PM")
  const formatTimeForDisplay = (time: string): string => {
    if (!time) return '';
    
    const [hours, minutes] = time.split(':');
    const hoursNum = parseInt(hours, 10);
    const period = hoursNum >= 12 ? 'PM' : 'AM';
    const hours12 = hoursNum % 12 || 12; // Convert 0 to 12 for 12 AM
    
    return `${hours12}:${minutes} ${period}`;
  };
  
  // Format date for display (e.g., "2023-03-15" to "March 15, 2023")
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    
    // Parse the date string directly without creating a Date object
    // This avoids timezone issues where the date might shift
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    
    // Create a date object with explicit UTC time to avoid timezone shifts
    // Note: months are 0-indexed in JavaScript Date
    const dateObj = new Date(Date.UTC(year, month - 1, day));
    
    // Format the date parts
    const monthName = dateObj.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
    
    return `${monthName} ${day}, ${year}`;
  };
  


  // Create refs for error message IDs
  const dateErrorId = useRef<string>('date-error-' + Math.random().toString(36).substr(2, 9));
  const timeErrorId = useRef<string>('time-error-' + Math.random().toString(36).substr(2, 9));
  const partySizeErrorId = useRef<string>('party-size-error-' + Math.random().toString(36).substr(2, 9));
  
  // Determine if fields are invalid
  const isDateInvalid = !!formErrors.date;
  const isTimeInvalid = !!formErrors.time;
  const isPartySizeInvalid = !!formErrors.partySize;

  return (
    <div className={styles.dateTimeSelector} role="group" aria-labelledby="reservation-datetime-heading">
      <h2 id="reservation-datetime-heading" className={styles.sectionTitle}>Select Date & Time</h2>
      
      <fieldset className={styles.formFieldset}>
        <legend className={styles.visuallyHidden}>Reservation Details</legend>
        
        <div className={styles.formGroup}>
          <label htmlFor="reservation-date" className={styles.label}>
            Date <span className={styles.requiredIndicator} aria-hidden="true">*</span>
            <span className={styles.visuallyHidden}>(required)</span>
          </label>
          <div className={styles.dateInputWrapper}>
            {/* Label that will trigger the date input when clicked */}
            <label 
              htmlFor="reservation-date" 
              className={`${styles.customDateButton} ${isDateInvalid ? styles.inputError : ''}`}
              aria-hidden="true"
            >
              {selectedDate ? formatDateForDisplay(selectedDate) : 'Select a date'}
            </label>
            
            {/* The actual date input that will be triggered by the label */}
            <input
              type="date"
              id="reservation-date"
              className={styles.hiddenDateInput}
              value={selectedDate}
              onChange={handleDateChange}
              onBlur={() => validateField('date', selectedDate)}
              min={today}
              max={maxDateString}
              required
              aria-required="true"
              aria-invalid={isDateInvalid ? 'true' : 'false'}
              aria-describedby={isDateInvalid ? dateErrorId.current : undefined}
              aria-label="Select a date for your reservation"
            />
          </div>
          <div className={styles.helperText} id="date-instructions">
            Please select a date between today and {formatDateForDisplay(maxDateString)}
          </div>
          {formErrors.date && (
            <div 
              id={dateErrorId.current} 
              className={styles.errorMessage} 
              role="alert"
            >
              {formErrors.date}
            </div>
          )}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="reservation-time" className={styles.label}>
            Time <span className={styles.requiredIndicator} aria-hidden="true">*</span>
            <span className={styles.visuallyHidden}>(required)</span>
          </label>
          <select
            id="reservation-time"
            className={`${styles.timeSelect} ${isTimeInvalid ? styles.inputError : ''}`}
            value={selectedTime}
            onChange={handleTimeChange}
            onBlur={() => validateField('time', selectedTime)}
            disabled={!selectedDate || isLoadingTimes || availableTimes.length === 0 || !!formErrors.date}
            required
            aria-required="true"
            aria-invalid={isTimeInvalid ? 'true' : 'false'}
            aria-describedby={isTimeInvalid ? timeErrorId.current : undefined}
          >
            <option value="">Select a time</option>
            {isLoadingTimes && <option value="" disabled>Loading times...</option>}
            {!isLoadingTimes && availableTimes.map((timeSlot) => (
              <option key={timeSlot} value={timeSlot}>
                {formatTimeForDisplay(timeSlot)}
              </option>
            ))}
          </select>
          {selectedDate && !isLoadingTimes && availableTimes.length === 0 && !formErrors.date && (
            <div className={styles.noTimesText} aria-live="polite">
              No available times for this date.
            </div>
          )}
          {isLoadingTimes && !formErrors.date && (
            <div className={styles.loadingText} aria-live="polite">
              Loading available times...
            </div>
          )}
          {formErrors.time && (
            <div 
              id={timeErrorId.current} 
              className={styles.errorMessage} 
              role="alert"
            >
              {formErrors.time}
            </div>
          )}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="party-size" className={styles.label}>
            Party Size <span className={styles.requiredIndicator} aria-hidden="true">*</span>
            <span className={styles.visuallyHidden}>(required)</span>
          </label>
          <select
            id="party-size"
            className={`${styles.partySizeSelect} ${isPartySizeInvalid ? styles.inputError : ''}`}
            value={partySize}
            onChange={handlePartySizeChange}
            onBlur={() => validateField('partySize', partySize)}
            required
            aria-required="true"
            aria-invalid={isPartySizeInvalid ? 'true' : 'false'}
            aria-describedby={isPartySizeInvalid ? partySizeErrorId.current : undefined}
          >
            <option value="">Select party size</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
              <option key={size} value={size}>
                {size} {size === 1 ? 'person' : 'people'}
              </option>
            ))}
            <option value="11">11+ people (large party)</option>
          </select>
          {formErrors.partySize && (
            <div 
              id={partySizeErrorId.current} 
              className={styles.errorMessage} 
              role="alert"
            >
              {formErrors.partySize}
            </div>
          )}
        </div>
      </fieldset>
    </div>
  );
});

DateTimeSelectorComponent.displayName = 'DateTimeSelector';

export default DateTimeSelectorComponent;