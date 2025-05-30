import { useState, useEffect } from 'react';
import { 
  getAvailableTimeSlots, 
  createReservation 
} from '../services/reservationService';

/**
 * Custom hook for managing reservation state and logic
 * 
 * Encapsulates all reservation-related functionality including:
 * - Form state management
 * - Available time slots
 * - Validation
 * - Reservation submission
 */
export function useReservation() {
  // State for reservation data
  const [reservationData, setReservationData] = useState({
    date: '',
    time: '',
    partySize: '',
    name: '',
    email: '',
    phone: '',
    occasion: '',
    specialRequests: ''
  });
  
  // State for the current step in the reservation process
  const [currentStep, setCurrentStep] = useState(1);
  
  // State for available time slots
  const [availableTimes, setAvailableTimes] = useState([]);
  
  // State for the confirmed reservation (after submission)
  const [confirmedReservation, setConfirmedReservation] = useState(null);
  
  // State for error message
  const [errorMessage, setErrorMessage] = useState('');
  
  // Update available times when date changes
  useEffect(() => {
    if (reservationData.date) {
      const timeSlots = getAvailableTimeSlots(reservationData.date);
      setAvailableTimes(timeSlots);
      
      // If the currently selected time is not available, reset it
      if (reservationData.time && !timeSlots.includes(reservationData.time)) {
        setReservationData(prev => ({ ...prev, time: '' }));
      }
    } else {
      setAvailableTimes([]);
    }
  }, [reservationData.date, reservationData.time]);
  
  // Handle date, time, and party size changes
  const handleDateTimeChange = (field, value) => {
    setReservationData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle form data changes
  const handleFormChange = (newFormData) => {
    setReservationData(prev => ({
      ...prev,
      ...newFormData
    }));
  };
  
  // Check if the current step is complete and can proceed to the next step
  const canProceedToNextStep = () => {
    if (currentStep === 1) {
      // Check if date, time, and party size are selected
      return reservationData.date && reservationData.time && reservationData.partySize;
    }
    
    if (currentStep === 2) {
      // Check if required form fields are filled
      return reservationData.name && reservationData.email && reservationData.phone;
    }
    
    return true;
  };
  
  // Handle proceeding to the next step
  const handleNextStep = () => {
    if (canProceedToNextStep()) {
      setCurrentStep(currentStep + 1);
      setErrorMessage('');
    } else {
      setErrorMessage('Please fill in all required fields before proceeding.');
    }
  };
  
  // Handle going back to the previous step
  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
    setErrorMessage('');
  };
  
  // Handle reservation confirmation
  const handleConfirmReservation = async () => {
    try {
      // Create the reservation
      const newReservation = await createReservation(reservationData);
      
      // Set the confirmed reservation
      setConfirmedReservation(newReservation);
      
      // Move to the success step
      setCurrentStep(4);
      setErrorMessage('');
      
      return newReservation;
    } catch (error) {
      console.error('Error creating reservation:', error);
      setErrorMessage(`Failed to create reservation: ${error.message}`);
      return null;
    }
  };
  
  // Reset the reservation form
  const resetReservation = () => {
    setReservationData({
      date: '',
      time: '',
      partySize: '',
      name: '',
      email: '',
      phone: '',
      occasion: '',
      specialRequests: ''
    });
    setCurrentStep(1);
    setConfirmedReservation(null);
    setErrorMessage('');
  };
  
  return {
    // State
    reservationData,
    currentStep,
    availableTimes,
    confirmedReservation,
    errorMessage,
    
    // Actions
    handleDateTimeChange,
    handleFormChange,
    handleNextStep,
    handlePreviousStep,
    handleConfirmReservation,
    resetReservation,
    canProceedToNextStep,
    
    // Utilities
    setCurrentStep,
    setErrorMessage
  };
}
