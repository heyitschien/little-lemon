// src/services/reservationService.test.js
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
// Import actual service functions. We will control dependencies via localStorage mock.
import {
  getAvailableTimeSlots,
  getReservationsFromStorage as actualGetReservationsFromStorage_fromService,
  createReservation,
  getReservationById,
  updateReservation,
  cancelReservation
} from './reservationService';

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
    localStorageMock.clear(); // Clear localStorage data store
    localStorageMock.getItem.mockClear(); // Clear calls and mockReturnValueOnce queue for getItem
    localStorageMock.setItem.mockClear(); // Clear calls for setItem
    // Reset any other general mocks if necessary
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

  describe('createReservation', () => {
    const validReservationData = {
      date: '2024-01-15',
      time: '19:00',
      partySize: 4,
      name: 'Chien Duong',
      email: 'chien@example.com',
      phone: '123-456-7890',
      occasion: 'Birthday',
      specialRequests: 'Window seat please'
    };

    test('should create a reservation successfully when slot is available', () => {
      // Arrange: Ensure the slot is available (no conflicting reservations)
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([])); // For getReservationsFromStorage inside isTimeSlotAvailable
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([])); // For getReservationsFromStorage before saving

      // Act
      const createdReservation = createReservation(validReservationData);

      // Assert
      expect(createdReservation).toBeDefined();
      expect(createdReservation.id).toMatch(/^LL-[A-Z0-9]+[A-Z0-9]+$/); // Check ID format
      expect(createdReservation.status).toBe('confirmed');
      expect(createdReservation.createdAt).toBeDefined();
      expect(createdReservation.name).toBe(validReservationData.name);
      expect(createdReservation.email).toBe(validReservationData.email);
      expect(createdReservation.date).toBe(validReservationData.date);
      expect(createdReservation.time).toBe(validReservationData.time);

      // Check if localStorage.setItem was called correctly
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
      const storedReservationsString = localStorageMock.setItem.mock.calls[0][1];
      const storedReservations = JSON.parse(storedReservationsString);
      expect(storedReservations).toHaveLength(1);
      expect(storedReservations[0]).toEqual(expect.objectContaining(validReservationData));
      expect(storedReservations[0].id).toBe(createdReservation.id);
    });

    test('should throw an error if required information is missing', () => {
      const incompleteData = { ...validReservationData, email: '' }; // Missing email
      expect(() => createReservation(incompleteData)).toThrow('Missing required reservation information');
    });

    test('should throw an error if the time slot is not available', () => {
      // Arrange: Make the slot unavailable
      const existingReservations = [
        { ...validReservationData, id: 'EXISTING-123', status: 'confirmed' }
      ];
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(existingReservations)); // For getReservationsFromStorage inside isTimeSlotAvailable

      // Act & Assert
      expect(() => createReservation(validReservationData)).toThrow('Selected time slot is not available');
    });

     test('should correctly add a new reservation when others exist for different dates/times', () => {
      const existingReservations = [
        { id: 'OLD-1', date: '2024-01-14', time: '19:00', partySize: 2, name: 'Old User', email: 'old@example.com', phone: '111', status: 'confirmed' },
        { id: 'OLD-2', date: '2024-01-15', time: '17:00', partySize: 2, name: 'Another User', email: 'another@example.com', phone: '222', status: 'confirmed' },
      ];
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(existingReservations)); // For isTimeSlotAvailable (which calls getAvailableTimeSlots -> getReservationsFromStorage)
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(existingReservations)); // For getReservationsFromStorage before saving

      const newReservation = createReservation(validReservationData); // validReservationData is for 2024-01-15 19:00

      expect(newReservation).toBeDefined();
      expect(newReservation.id).toMatch(/^LL-/);

      const storedReservationsString = localStorageMock.setItem.mock.calls[0][1];
      const storedReservations = JSON.parse(storedReservationsString);
      expect(storedReservations).toHaveLength(3);
      expect(storedReservations).toEqual(expect.arrayContaining([
        expect.objectContaining(existingReservations[0]),
        expect.objectContaining(existingReservations[1]),
        expect.objectContaining(newReservation)
      ]));
    });
  });

  describe('getReservationById', () => {
    test('should return the reservation if found', () => {
      const mockReservations = [
        { id: '1', data: 'reservation1' },
        { id: '2', data: 'reservation2' },
      ];
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockReservations));
      const reservation = getReservationById('1');
      expect(reservation).toEqual({ id: '1', data: 'reservation1' });
    });

    test('should return null if reservation is not found', () => {
      const mockReservations = [{ id: '1', data: 'reservation1' }];
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockReservations));
      const reservation = getReservationById('3');
      expect(reservation).toBeNull();
    });

    test('should return null if localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([]));
      const reservation = getReservationById('1');
      expect(reservation).toBeNull();
    });
  });

  describe('updateReservation', () => {
    const reservationId = 'RES-UPDATE-123';
    const initialReservation = {
      id: reservationId,
      date: '2024-02-01',
      time: '18:00',
      partySize: 2,
      name: 'Original Name',
      email: 'original@example.com',
      phone: '111-222-3333',
      status: 'confirmed',
      createdAt: new Date('2024-01-01T10:00:00.000Z').toISOString()
    };

    test('should update the reservation and return the updated object', () => {
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([initialReservation]));
      const updates = {
        time: '19:30',
        partySize: 3,
        name: 'Updated Name'
      };
      const updatedReservation = updateReservation(reservationId, updates);

      expect(updatedReservation).not.toBeNull();
      expect(updatedReservation.id).toBe(reservationId);
      expect(updatedReservation.time).toBe('19:30');
      expect(updatedReservation.partySize).toBe(3);
      expect(updatedReservation.name).toBe('Updated Name');
      expect(updatedReservation.email).toBe(initialReservation.email); // Unchanged
      expect(updatedReservation.updatedAt).toBeDefined();
      expect(new Date(updatedReservation.updatedAt).getTime()).toBeGreaterThan(new Date(initialReservation.createdAt).getTime());

      expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
      const storedReservations = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(storedReservations).toHaveLength(1);
      expect(storedReservations[0]).toEqual(updatedReservation);
    });

    test('should return null if reservation to update is not found', () => {
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([initialReservation]));
      const result = updateReservation('NON-EXISTENT-ID', { time: '20:00' });
      expect(result).toBeNull();
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

     test('should only update provided fields and add updatedAt timestamp', () => {
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([initialReservation]));
      const updates = { partySize: 5 }; // Only updating partySize
      const updatedReservation = updateReservation(reservationId, updates);

      expect(updatedReservation.partySize).toBe(5);
      expect(updatedReservation.name).toBe(initialReservation.name); // Should remain original
      expect(updatedReservation.time).toBe(initialReservation.time); // Should remain original
      expect(updatedReservation.updatedAt).toBeDefined();
      expect(updatedReservation.createdAt).toBe(initialReservation.createdAt); // createdAt should not change
    });
  });

  describe('cancelReservation', () => {
    const reservationId = 'RES-CANCEL-123';
    const initialReservation = {
      id: reservationId,
      date: '2024-03-01',
      time: '20:00',
      partySize: 4,
      name: 'To Be Cancelled',
      status: 'confirmed',
      createdAt: new Date('2024-02-15T12:00:00.000Z').toISOString()
    };

    test('should cancel the reservation, update status and add cancelledAt, then return true', () => {
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([initialReservation]));
      const result = cancelReservation(reservationId);

      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
      const storedReservations = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(storedReservations).toHaveLength(1);
      const cancelledRes = storedReservations[0];
      expect(cancelledRes.id).toBe(reservationId);
      expect(cancelledRes.status).toBe('cancelled');
      expect(cancelledRes.cancelledAt).toBeDefined();
      expect(new Date(cancelledRes.cancelledAt).getTime()).toBeGreaterThan(new Date(initialReservation.createdAt).getTime());
    });

    test('should return false if reservation to cancel is not found', () => {
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([initialReservation]));
      const result = cancelReservation('NON-EXISTENT-ID');
      expect(result).toBe(false);
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    test('should handle cancelling a reservation when multiple reservations exist', () => {
      const otherReservation = { id: 'OTHER-RES', date: '2024-03-02', time: '19:00', status: 'confirmed' };
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([initialReservation, otherReservation]));
      
      const result = cancelReservation(reservationId);
      expect(result).toBe(true);

      const storedReservations = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(storedReservations).toHaveLength(2);
      const cancelledRes = storedReservations.find(r => r.id === reservationId);
      const untouchedRes = storedReservations.find(r => r.id === 'OTHER-RES');

      expect(cancelledRes.status).toBe('cancelled');
      expect(untouchedRes.status).toBe('confirmed');
      expect(untouchedRes.cancelledAt).toBeUndefined();
    });
  });
});
