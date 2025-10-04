import type { Reservation, ReservationStatus } from '../types/reservation';

interface CreateReservationInput {
  date: string;
  time: string;
  partySize: number;
  name: string;
  email: string;
  phone: string;
  occasion?: string;
  specialRequests?: string;
}

type StoredReservation = Reservation & { cancelledAt?: string };

const STORAGE_KEY = 'littleLemonReservations';

const baseOperatingTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 17; hour < 22; hour++) {
    slots.push(`${hour}:00`);
    slots.push(`${hour}:30`);
  }
  slots.push('22:00');
  return slots;
};

const parseStoredReservations = (value: string | null): StoredReservation[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed as StoredReservation[] : [];
  } catch (error) {
    console.error('Error parsing reservations from localStorage:', error);
    return [];
  }
};

export const getReservationsFromStorage = (): StoredReservation[] => {
  try {
    const reservations = localStorage.getItem(STORAGE_KEY);
    return parseStoredReservations(reservations);
  } catch (error) {
    console.error('Error retrieving reservations from localStorage:', error);
    return [];
  }
};

const saveReservationsToStorage = (reservations: StoredReservation[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
  } catch (error) {
    console.error('Error saving reservations to localStorage:', error);
  }
};

const generateReservationId = (): string => {
  return (
    'LL-' +
    Date.now().toString(36).toUpperCase() +
    Math.random().toString(36).substring(2, 5).toUpperCase()
  );
};

export const getAvailableTimeSlots = (date: string): string[] => {
  const allReservations = getReservationsFromStorage();
  const bookedSlotsForDate = allReservations
    .filter(reservation => reservation.date === date && reservation.status === 'confirmed')
    .map(reservation => reservation.time);

  const allPotentialSlots = baseOperatingTimeSlots();
  return allPotentialSlots.filter(slot => !bookedSlotsForDate.includes(slot));
};

export const isTimeSlotAvailable = (date: string, time: string, partySize: number): boolean => {
  void partySize; // Placeholder for future capacity logic
  const availableSlots = getAvailableTimeSlots(date);
  return availableSlots.includes(time);
};

export const checkAvailability = (date: string, time: string, partySize: number): boolean => {
  return isTimeSlotAvailable(date, time, partySize);
};

export const createReservation = (reservationData: CreateReservationInput): Reservation => {
  const { date, time, partySize, name, email, phone } = reservationData;
  if (!date || !time || !partySize || !name || !email || !phone) {
    throw new Error('Missing required reservation information');
  }

  if (!Number.isInteger(partySize) || partySize <= 0) {
    throw new Error('Party size must be a positive integer');
  }

  if (!isTimeSlotAvailable(date, time, partySize)) {
    throw new Error('Selected time slot is not available');
  }

  const reservation: StoredReservation = {
    ...reservationData,
    id: generateReservationId(),
    status: 'confirmed' satisfies ReservationStatus,
    createdAt: new Date().toISOString()
  };

  const reservations = getReservationsFromStorage();
  reservations.push(reservation);
  saveReservationsToStorage(reservations);

  return reservation;
};

export const getReservationById = (id: string): Reservation | null => {
  const reservations = getReservationsFromStorage();
  return reservations.find(reservation => reservation.id === id) ?? null;
};

export const cancelReservation = (id: string): boolean => {
  const reservations = getReservationsFromStorage();
  const index = reservations.findIndex(reservation => reservation.id === id);

  if (index === -1) {
    return false;
  }

  reservations[index] = {
    ...reservations[index],
    status: 'cancelled',
    cancelledAt: new Date().toISOString()
  } satisfies StoredReservation;

  saveReservationsToStorage(reservations);
  return true;
};

export const updateReservation = (id: string, updatedData: Partial<CreateReservationInput>): Reservation | null => {
  const reservations = getReservationsFromStorage();
  const index = reservations.findIndex(reservation => reservation.id === id);

  if (index === -1) {
    return null;
  }

  const merged: StoredReservation = {
    ...reservations[index],
    ...updatedData,
    updatedAt: new Date().toISOString()
  } satisfies StoredReservation;

  reservations[index] = merged;
  saveReservationsToStorage(reservations);

  return merged;
};

export default {
  getAvailableTimeSlots,
  checkAvailability,
  createReservation,
  getReservationById,
  cancelReservation,
  updateReservation
};