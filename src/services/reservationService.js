/**
 * Reservation Service
 * 
 * This service handles all reservation-related functionality including:
 * - Creating new reservations
 * - Checking availability
 * - Retrieving available time slots
 * - Validating reservation data
 * 
 * Currently implemented with localStorage for persistence, but can be
 * replaced with actual API calls in the future.
 */

// Mock data for available time slots
const availableTimeSlots = {
  // Format: "YYYY-MM-DD": ["HH:MM", "HH:MM", ...]
  // This would typically come from a backend API
  generateTimeSlots: () => {
    // Generate time slots from 17:00 to 22:00 (5 PM to 10 PM) in 30-minute intervals
    // This is just a mock implementation
    const slots = [];
    for (let hour = 17; hour < 22; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    slots.push('22:00');
    
    // Randomly remove some slots to simulate unavailability
    // In a real implementation, this would come from the backend
    return slots.filter(() => Math.random() > 0.3);
  }
};

/**
 * Get all reservations from localStorage
 * @returns {Array} - Array of reservation objects
 */
export const getReservationsFromStorage = () => {
  try {
    const reservations = localStorage.getItem('littleLemonReservations');
    return reservations ? JSON.parse(reservations) : [];
  } catch (error) {
    console.error('Error retrieving reservations from localStorage:', error);
    return [];
  }
};

// Save reservations to localStorage
const saveReservationsToStorage = (reservations) => {
  try {
    localStorage.setItem('littleLemonReservations', JSON.stringify(reservations));
  } catch (error) {
    console.error('Error saving reservations to localStorage:', error);
  }
};

// Generate a unique reservation ID
const generateReservationId = () => {
  return 'LL-' + Date.now().toString(36).toUpperCase() + 
         Math.random().toString(36).substring(2, 5).toUpperCase();
};

/**
 * Get available time slots for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Array} - Array of available time slots
 */
export const getAvailableTimeSlots = (date) => {
  // In a real implementation, this would make an API call to get available slots
  // For now, we're using the mock data
  return availableTimeSlots.generateTimeSlots(date);
};

/**
 * Check if a time slot is available for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} time - Time slot in HH:MM format
 * @param {number} partySize - Number of people
 * @returns {boolean} - Whether the slot is available
 */
export const isTimeSlotAvailable = (date, time) => {
  // In a real implementation, this would make an API call to check availability
  // For now, we're using the mock data
  const availableSlots = getAvailableTimeSlots(date);
  return availableSlots.includes(time);
};

/**
 * Check availability for a reservation
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} time - Time slot in HH:MM format
 * @param {number} partySize - Number of people
 * @returns {boolean} - Whether the slot is available
 */
export const checkAvailability = (date, time, partySize) => {
  // This is just an alias for isTimeSlotAvailable for backward compatibility
  return isTimeSlotAvailable(date, time, partySize);
};

/**
 * Create a new reservation
 * @param {Object} reservationData - Reservation data
 * @returns {Object} - Created reservation with ID
 */
export const createReservation = (reservationData) => {
  // Validate the reservation data
  if (!reservationData.date || !reservationData.time || !reservationData.partySize ||
      !reservationData.name || !reservationData.email || !reservationData.phone) {
    throw new Error('Missing required reservation information');
  }
  
  // Check availability
  if (!isTimeSlotAvailable(reservationData.date, reservationData.time, reservationData.partySize)) {
    throw new Error('Selected time slot is not available');
  }
  
  // Create the reservation object
  const reservation = {
    ...reservationData,
    id: generateReservationId(),
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  
  // Save to storage
  const reservations = getReservationsFromStorage();
  reservations.push(reservation);
  saveReservationsToStorage(reservations);
  
  return reservation;
};

/**
 * Get a reservation by ID
 * @param {string} id - Reservation ID
 * @returns {Object|null} - Reservation object or null if not found
 */
export const getReservationById = (id) => {
  const reservations = getReservationsFromStorage();
  return reservations.find(reservation => reservation.id === id) || null;
};

/**
 * Cancel a reservation
 * @param {string} id - Reservation ID
 * @returns {boolean} - Whether the cancellation was successful
 */
export const cancelReservation = (id) => {
  const reservations = getReservationsFromStorage();
  const index = reservations.findIndex(reservation => reservation.id === id);
  
  if (index === -1) {
    return false;
  }
  
  // Update status to cancelled
  reservations[index].status = 'cancelled';
  reservations[index].cancelledAt = new Date().toISOString();
  
  // Save to storage
  saveReservationsToStorage(reservations);
  
  return true;
};

/**
 * Update a reservation
 * @param {string} id - Reservation ID
 * @param {Object} updatedData - Updated reservation data
 * @returns {Object|null} - Updated reservation or null if not found
 */
export const updateReservation = (id, updatedData) => {
  const reservations = getReservationsFromStorage();
  const index = reservations.findIndex(reservation => reservation.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Update the reservation
  reservations[index] = {
    ...reservations[index],
    ...updatedData,
    updatedAt: new Date().toISOString()
  };
  
  // Save to storage
  saveReservationsToStorage(reservations);
  
  return reservations[index];
};

export default {
  getAvailableTimeSlots,
  checkAvailability,
  createReservation,
  getReservationById,
  cancelReservation,
  updateReservation
};