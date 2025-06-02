// src/services/reservationService.test.js
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
// Import actual service functions. We will control dependencies via localStorage mock.
import { getAvailableTimeSlots, getReservationsFromStorage as actualGetReservationsFromStorage_fromService } from './reservationService';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Reservation Service', () => {
  const baseSlots = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];

  beforeEach(() => {
    localStorageMock.clear(); // Clear localStorage before each test
    // Reset any other general mocks if necessary, but localStorage is primary here
  });

  afterEach(() => {
    // vi.restoreAllMocks() is good for spies, but vi.mock is more persistent.
    // mockGetReservationsFn.mockReset() could be used if we also wanted to reset mock implementations, not just return values.
  });

  // Test the *actual* implementation of getReservationsFromStorage
  describe('getReservationsFromStorage (actual implementation)', () => {
    test('should return an empty array if localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValueOnce(null);
      expect(actualGetReservationsFromStorage_fromService()).toEqual([]);
    });

    test('should return parsed reservations if localStorage has data', () => {
      const mockStoredReservations = [{ id: '1', date: '2024-12-25', time: '18:00' }];
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockStoredReservations));
      expect(actualGetReservationsFromStorage_fromService()).toEqual(mockStoredReservations);
    });

    test('should return an empty array and log error if JSON parsing fails', () => {
      localStorageMock.getItem.mockReturnValueOnce('invalid json');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(actualGetReservationsFromStorage_fromService()).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getAvailableTimeSlots', () => {
    const testDate = '2024-01-01';

    test('2.1. should return all base slots if no reservations exist for the date', () => {
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([])); // No reservations in storage
      const availableSlots = getAvailableTimeSlots(testDate);
      expect(availableSlots).toEqual(baseSlots);
    });

    test('2.2. should return available slots excluding booked ones', () => {
      const mockReservationsData = [
        { id: '1', date: testDate, time: '17:00', status: 'confirmed' },
        { id: '2', date: testDate, time: '18:30', status: 'confirmed' },
        { id: '3', date: '2024-01-02', time: '17:00', status: 'confirmed' }, // Different date
      ];
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockReservationsData));
      const availableSlots = getAvailableTimeSlots(testDate);
      const expectedSlots = baseSlots.filter(slot => slot !== '17:00' && slot !== '18:30');
      expect(availableSlots).toEqual(expectedSlots);
    });

    test('2.3. should return an empty array if all slots are booked', () => {
      const mockReservationsData = baseSlots.map((slot, index) => (
        { id: `id-${index}`, date: testDate, time: slot, status: 'confirmed' }
      ));
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockReservationsData));
      const availableSlots = getAvailableTimeSlots(testDate);
      expect(availableSlots).toEqual([]);
    });

    test('2.4. should return all base slots if reservations are for a different date', () => {
      const mockReservationsData = [
        { id: '1', date: '2024-01-02', time: '17:00', status: 'confirmed' }, // Different date
        { id: '2', date: '2024-01-02', time: '18:30', status: 'confirmed' }, // Different date
      ];
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockReservationsData));
      const availableSlots = getAvailableTimeSlots(testDate); // testDate is '2024-01-01'
      expect(availableSlots).toEqual(baseSlots);
    });
  });

  // More tests for createReservation will go here
});
