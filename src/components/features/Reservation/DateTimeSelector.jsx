import React, { useEffect } from 'react';
import styles from './DateTimeSelector.module.css';
// getAvailableTimeSlots removed, will be passed as prop

/**
 * DateTimeSelector Component
 * 
 * Allows users to select a date, time, and party size for their reservation.
 * 
 * @param {Object} props - Component props
 * @param {string} props.selectedDate - Currently selected date
 * @param {string} props.selectedTime - Currently selected time
 * @param {number} props.partySize - Number of people in the party
 * @param {Array<string>} props.availableTimes - Array of available time slots for the selected date
 * @param {boolean} props.isLoadingTimes - Boolean indicating if times are currently being loaded
 * @param {Function} props.onDateChange - Function to call when date changes
 * @param {Function} props.onTimeChange - Function to call when time changes
 * @param {Function} props.onPartySizeChange - Function to call when party size changes
 */
const DateTimeSelectorComponent = React.memo(({
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
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate the max date (6 months from today)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 6);
  const maxDateString = maxDate.toISOString().split('T')[0];
  
  // Internal date validation useEffect removed, will rely on formErrors from useReservation hook

  // Effect to reset selected time if it's no longer in the availableTimes prop
  useEffect(() => {
    if (selectedDate && selectedTime && availableTimes.length > 0 && !availableTimes.includes(selectedTime)) {
      onTimeChange(''); // Reset time if the current selection is not in the new list
    }
    // This effect should run when availableTimes changes, or when selectedDate/Time changes, to re-validate.
  }, [selectedDate, selectedTime, availableTimes, onTimeChange]);
  
  // Handle date change
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    onDateChange(newDate);
  };
  
  // Handle time change
  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    onTimeChange(newTime);
  };
  
  // Handle party size change
  const handlePartySizeChange = (e) => {
    const newPartySize = parseInt(e.target.value, 10);
    onPartySizeChange(newPartySize);
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
  
  // Format date for display (e.g., "2023-03-15" to "March 15, 2023")
  const formatDateForDisplay = (dateString) => {
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
  


  return (
    <div className={styles.dateTimeSelector}>
      <h2 className={styles.sectionTitle}>Select Date & Time</h2>
      
      <div className={styles.formGroup}>
        <label htmlFor="reservation-date" className={styles.label}>
          Date
        </label>
        <div className={styles.dateInputWrapper}>
          {/* Label that will trigger the date input when clicked */}
          <label htmlFor="reservation-date" className={styles.customDateButton}>
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
            aria-label="Select a date for your reservation"
          />
        </div>
        {formErrors.date && <p className={styles.errorMessage}>{formErrors.date}</p>}
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="reservation-time" className={styles.label}>
          Time
        </label>
        <select
          id="reservation-time"
          className={styles.timeSelect}
          value={selectedTime}
          onChange={handleTimeChange}
          onBlur={() => validateField('time', selectedTime)}
          disabled={!selectedDate || isLoadingTimes || availableTimes.length === 0 || !!formErrors.date}
          required
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
          <p className={styles.noTimesText}>No available times for this date.</p>
        )}
        {isLoadingTimes && !formErrors.date && (
          <p className={styles.loadingText}>Loading available times...</p>
        )}
        {formErrors.time && <p className={styles.errorMessage}>{formErrors.time}</p>}
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="party-size" className={styles.label}>
          Party Size
        </label>
        <select
          id="party-size"
          className={styles.partySizeSelect}
          value={partySize}
          onChange={handlePartySizeChange}
          onBlur={() => validateField('partySize', partySize)}
          required
        >
          <option value="">Select party size</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
            <option key={size} value={size}>
              {size} {size === 1 ? 'person' : 'people'}
            </option>
          ))}
          <option value="11">11+ people (large party)</option>
        </select>
        {formErrors.partySize && <p className={styles.errorMessage}>{formErrors.partySize}</p>}
      </div>
    </div>
  );
});

DateTimeSelectorComponent.displayName = 'DateTimeSelector';

export default DateTimeSelectorComponent;