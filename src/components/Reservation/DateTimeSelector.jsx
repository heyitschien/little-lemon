import React, { useState, useEffect } from 'react';
import styles from './DateTimeSelector.module.css';
import { getAvailableTimeSlots } from '../../services/reservationService';

/**
 * DateTimeSelector Component
 * 
 * Allows users to select a date, time, and party size for their reservation.
 * 
 * @param {Object} props - Component props
 * @param {string} props.selectedDate - Currently selected date
 * @param {string} props.selectedTime - Currently selected time
 * @param {number} props.partySize - Number of people in the party
 * @param {Function} props.onDateChange - Function to call when date changes
 * @param {Function} props.onTimeChange - Function to call when time changes
 * @param {Function} props.onPartySizeChange - Function to call when party size changes
 */
const DateTimeSelector = ({
  selectedDate,
  selectedTime,
  partySize,
  onDateChange,
  onTimeChange,
  onPartySizeChange
}) => {
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [dateError, setDateError] = useState('');
  
  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate the max date (6 months from today)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 6);
  const maxDateString = maxDate.toISOString().split('T')[0];
  
  // Update available time slots when the date changes
  useEffect(() => {
    if (selectedDate) {
      // Validate that the selected date is not in the past
      const selectedDateObj = new Date(selectedDate);
      const todayObj = new Date(today);
      
      // Reset time part for accurate date comparison
      selectedDateObj.setHours(0, 0, 0, 0);
      todayObj.setHours(0, 0, 0, 0);
      
      if (selectedDateObj < todayObj) {
        setDateError('Please select a future date');
        setAvailableTimeSlots([]);
        return;
      }
      
      setDateError('');
      
      // Get available time slots for the selected date
      const timeSlots = getAvailableTimeSlots(selectedDate);
      setAvailableTimeSlots(timeSlots);
      
      // If the currently selected time is not available, reset it
      if (selectedTime && !timeSlots.includes(selectedTime)) {
        onTimeChange('');
      }
    } else {
      setAvailableTimeSlots([]);
    }
  }, [selectedDate, selectedTime, onTimeChange, today]);
  
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
  
  return (
    <div className={styles.dateTimeSelector}>
      <h2 className={styles.sectionTitle}>Select Date & Time</h2>
      
      <div className={styles.formGroup}>
        <label htmlFor="reservation-date" className={styles.label}>
          Date
        </label>
        <input
          type="date"
          id="reservation-date"
          className={styles.dateInput}
          value={selectedDate}
          onChange={handleDateChange}
          min={today}
          max={maxDateString}
          required
        />
        {dateError && <p className={styles.errorText}>{dateError}</p>}
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
          disabled={!selectedDate || availableTimeSlots.length === 0}
          required
        >
          <option value="">Select a time</option>
          {availableTimeSlots.map((timeSlot) => (
            <option key={timeSlot} value={timeSlot}>
              {formatTimeForDisplay(timeSlot)}
            </option>
          ))}
        </select>
        {selectedDate && availableTimeSlots.length === 0 && !dateError && (
          <p className={styles.noTimesText}>No available times for this date</p>
        )}
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
      </div>
    </div>
  );
};

export default DateTimeSelector;