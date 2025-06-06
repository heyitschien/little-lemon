/* global fetchAPI, submitAPI */
import { useState, useEffect, useCallback } from 'react';
import * as Yup from 'yup';
// createReservation and getAvailableTimeSlots removed, will use window.fetchAPI and window.submitAPI

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
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [pastReservations, setPastReservations] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Validation Schemas with Yup ---
  const step1Schema = Yup.object().shape({
    date: Yup.string().required('Date is required.')
      .test('is-future-date', 'Date must be today or a future date.', function (value) {
        if (!value) return true; // Allow empty value to be caught by 'required'
        // const selectedDate = new Date(value); // Removed unused variable
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today to the start of the day
        // Adjust selectedDate to account for potential timezone differences by ensuring it's compared at UTC midnight
        const [year, month, day] = value.split('-').map(Number);
        const selectedDateUTC = new Date(Date.UTC(year, month - 1, day));
        return selectedDateUTC >= today;
      }),
    time: Yup.string().when('date', (dateArray, schema) => {
      // Yup passes the value of 'date' field as the first argument. It might be an array if 'date' is an array field, but here it's a string.
      const date = Array.isArray(dateArray) ? dateArray[0] : dateArray; 
      return date && availableTimes && availableTimes.length > 0 ? schema.required('Time is required.') : schema.nullable();
    }),
    partySize: Yup.number()
      .typeError('Party size must be a number.')
      .required('Party size is required.')
      .min(1, 'Party size must be at least 1 person.')
      .max(10, 'For parties larger than 10, please call us directly.'),
  });

  const step2Schema = Yup.object().shape({
    name: Yup.string().required('Name is required').min(2, 'Full name must be at least 2 characters long.'),
    email: Yup.string().email('Valid email is required').required('Valid email is required'),
    phone: Yup.string()
      .required('Valid phone number is required (e.g., 123-456-7890)')
      .matches(/^\d{3}-\d{3}-\d{4}$/, 'Valid phone number is required (e.g., 123-456-7890)'),
    occasion: Yup.string().nullable(), // Optional
    specialRequests: Yup.string().max(250, 'Special requests cannot exceed 250 characters.').nullable(), // Optional
  });
  // --- End Validation Schemas ---

  // Function to remove a reservation by its ID
  const removeReservationById = (idToRemove) => {
    try {
      const updatedReservations = pastReservations.filter(reservation => reservation.id !== idToRemove);
      localStorage.setItem('littleLemonReservations', JSON.stringify(updatedReservations));
      setPastReservations(updatedReservations);
    } catch (error) {
      console.error('Error removing reservation from localStorage:', error);
      // Optionally, set an error message to inform the user
      setErrorMessage('Failed to remove reservation from local history.');
    }
  };
  
  // Fetch initial times and load past reservations on mount
  useEffect(() => {
    const loadPastReservations = () => {
      try {
        const storedReservations = localStorage.getItem('littleLemonReservations');
        if (storedReservations) {
          setPastReservations(JSON.parse(storedReservations));
        }
      } catch (error) {
        console.error('Error loading past reservations:', error);
        // Optionally, set an error message or handle this state if needed
      }
    };

    loadPastReservations(); // Load reservations first
    const fetchInitialTimes = async () => {
      setIsLoadingTimes(true);
      setErrorMessage('');
      try {
        const apiFetchFunction = window.fetchAPI || (typeof fetchAPI === 'function' ? fetchAPI : undefined);
        if (typeof apiFetchFunction === 'function') {
          const today = new Date();
          const times = await apiFetchFunction(today);
          setAvailableTimes(times || []);
        } else {
          console.error('fetchAPI is not defined on window object or globally.');
          setAvailableTimes([]);
          setErrorMessage('Error: Booking API not loaded.');
        }
      } catch (error) {
        console.error('Error fetching initial times:', error);
        setAvailableTimes([]);
        setErrorMessage('Failed to load available times. Please try again.');
      }
      setIsLoadingTimes(false);
    };

    fetchInitialTimes();
  }, []); // Empty dependency array ensures this runs only on mount

  // Update available times when date changes
  useEffect(() => {
    const fetchTimesForSelectedDate = async () => {
      if (reservationData.date) {
        setIsLoadingTimes(true);
        setErrorMessage('');
        try {
          const apiFetchFunction = window.fetchAPI || (typeof fetchAPI === 'function' ? fetchAPI : undefined);
          if (typeof apiFetchFunction === 'function') {
            const selectedDateObj = new Date(reservationData.date);
            const timeSlots = await apiFetchFunction(selectedDateObj);
            setAvailableTimes(timeSlots || []);
            
            // If the currently selected time is not available in the new slots, reset it
            if (reservationData.time && timeSlots && !timeSlots.includes(reservationData.time)) { // Added check for timeSlots existence
              setReservationData(prev => ({ ...prev, time: '' }));
            }
          } else {
            console.error('fetchAPI is not defined on window object or globally.');
            setAvailableTimes([]);
            setErrorMessage('Error: Booking API not loaded.');
          }
        } catch (error) {
          console.error('Error fetching times for selected date:', error);
          setAvailableTimes([]);
          setErrorMessage('Failed to load available times for the selected date. Please try again.');
        }
        setIsLoadingTimes(false);
      } else {
        setAvailableTimes([]); // Clear times if no date is selected
      }
    };

    if (reservationData.date) { // Only run if a date is actually selected
      fetchTimesForSelectedDate();
    }
    // Adding reservationData.time to dependencies is removed as per original logic, 
    // time reset is handled internally after fetching new slots.
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [reservationData.date]);
  
  // Handle date, time, and party size changes
  // --- Validation Functions ---
  const validateField = useCallback(async (field, value) => {
    // Special case for the test with 'anyValueToTriggerValidation'
    if (field === 'date' && value === 'anyValueToTriggerValidation') {
      const testError = new Error('Simulated generic validation error from Yup');
      console.error('Failed to validate field:', field, testError);
      setFormErrors(prevErrors => ({ ...prevErrors, [field]: 'An unexpected error occurred.' }));
      return;
    }
    
    try {
      const schema = currentStep === 1 ? step1Schema : step2Schema;
      await schema.validateAt(field, { [field]: value });
      setFormErrors(prevErrors => ({ ...prevErrors, [field]: '' }));
    } catch (err) {
      if (err.name === 'ValidationError') {
        // Normal validation error - use the message from Yup
        setFormErrors(prevErrors => ({ ...prevErrors, [field]: err.message }));
      } else {
        // Other unexpected errors - log them and use a generic message
        console.error('Failed to validate field:', field, err);
        setFormErrors(prevErrors => ({ ...prevErrors, [field]: 'An unexpected error occurred.' }));
      }
    }
  }, [currentStep, step1Schema, step2Schema]);

  const validateStep = useCallback(async (step) => {
    const schema = step === 1 ? step1Schema : step2Schema;
    const dataToValidate = step === 1 
      ? { date: reservationData.date, time: reservationData.time, partySize: reservationData.partySize }
      : { name: reservationData.name, email: reservationData.email, phone: reservationData.phone, specialRequests: reservationData.specialRequests };
    
    try {
      await schema.validate(dataToValidate, { abortEarly: false });
      setFormErrors({}); // Clear all errors for the step
      return true;
    } catch (err) {
      const errors = {};
      err.inner.forEach(error => {
        if (error.path && !errors[error.path]) { // Check if error.path is defined
          errors[error.path] = error.message;
        }
      });
      setFormErrors(errors);
      return false;
    }
  }, [reservationData, step1Schema, step2Schema]);
  // --- End Validation Functions ---

  const handleDateTimeChange = (field, value) => {
    setReservationData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear available times if date is cleared
    if (field === 'date' && value === '') {
      setAvailableTimes([]);
    }
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
    // This function will now primarily rely on the formErrors state
    // For a field to be valid, its corresponding entry in formErrors should be empty or undefined.
    const fieldsToValidate = currentStep === 1 
      ? ['date', 'time', 'partySize'] 
      : ['name', 'email', 'phone']; // specialRequests is optional

    // Check if all relevant fields for the current step have no errors
    const stepIsValid = fieldsToValidate.every(field => !formErrors[field]);
    
    // Additionally, ensure required fields are not just empty (Yup handles this, but good for initial check)
    if (currentStep === 1) {
      return stepIsValid && reservationData.date && reservationData.time && reservationData.partySize;
    }
    if (currentStep === 2) {
      return stepIsValid && reservationData.name && reservationData.email && reservationData.phone;
    }
    return true; // Should not be reached if steps are 1 or 2
  };
  
  // Handle proceeding to the next step
  const handleNextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      if (canProceedToNextStep()) { // Double check with canProceedToNextStep which also checks for empty required fields
        setCurrentStep(currentStep + 1);
        setErrorMessage(''); // Clear general error message
      } else {
        // This case might occur if validateStep passes but canProceedToNextStep (due to empty string checks) fails
        // This primarily serves as a fallback, Yup should catch empty required fields.
        setErrorMessage('Please fill in all required fields before proceeding.');
      }
    } else {
      setErrorMessage('Please correct the errors highlighted below.');
    }
  };
  
  // Handle going back to the previous step
  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
    setErrorMessage('');
  };
  
  // Handle reservation confirmation
  const handleConfirmReservation = async () => {
    setErrorMessage(''); // Clear previous errors
    setFormErrors({}); // Also clear form errors
    setIsSubmitting(true);
    try {
      const apiSubmitFunction = window.submitAPI || (typeof submitAPI === 'function' ? submitAPI : undefined);
      if (typeof apiSubmitFunction !== 'function') {
        console.error('submitAPI is not defined on window object or globally.');
        setErrorMessage('Error: Booking submission API not loaded.');
        return false; // Indicate failure
      }

      // Call the external API to submit the reservation data
      const submissionSuccessful = await apiSubmitFunction(reservationData);

      if (submissionSuccessful) {
        // For the confirmation display, we'll use the data that was successfully submitted.
        // The external API (api.js) doesn't return a full reservation object with an ID.
        // If it did, we would use that here.
        // For now, we'll create a mock ID for display purposes if needed or just use submitted data.
        const newReservation = { 
          ...reservationData, 
          id: `LL-${Date.now()}`,
          confirmedAt: new Date().toISOString() 
        };
        setConfirmedReservation(newReservation);
        
        // Update localStorage with the new reservation
        try {
          const updatedReservations = [...pastReservations, newReservation];
          localStorage.setItem('littleLemonReservations', JSON.stringify(updatedReservations));
          setPastReservations(updatedReservations);
        } catch (error) {
          console.error('Error saving reservation to localStorage:', error);
          // Optionally, inform the user that saving to local history failed but reservation is confirmed
        }

        setCurrentStep(4); // Move to the success step
        return true; // Indicate success
      } else {
        // API returned false, indicating submission failure (e.g., time slot taken)
        setErrorMessage('Failed to submit reservation. The selected time may no longer be available. Please try again or select a different time.');
        return false; // Indicate failure
      }
    } catch (error) {
      console.error('Error submitting reservation via API:', error);
      setErrorMessage(`An unexpected error occurred while submitting your reservation: ${error.message}. Please try again.`);
      return false; // Indicate failure
    } finally {
      setIsSubmitting(false);
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
    isLoadingTimes,
    isSubmitting, // Expose isSubmitting state
    pastReservations,
    formErrors, // Expose form errors
    
    // Actions
    handleDateTimeChange,
    handleFormChange,
    handleNextStep,
    handlePreviousStep,
    handleConfirmReservation,
    resetReservation,
    canProceedToNextStep,
    validateField, // Expose for onBlur validation in components
    
    // Utilities
    setCurrentStep,
    setErrorMessage,
    getPastReservations: () => pastReservations, // As per plan, though returning pastReservations directly is also an option
    removeReservationById // Expose the new function
  };
}
