/* global fetchAPI, submitAPI */
import { useState, useEffect } from 'react';
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
    setErrorMessage(''); // Clear previous errors
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
    pastReservations,
    
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
    setErrorMessage,
    getPastReservations: () => pastReservations, // As per plan, though returning pastReservations directly is also an option
    removeReservationById // Expose the new function
  };
}
