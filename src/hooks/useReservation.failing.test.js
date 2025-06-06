// Test file for focusing on failing useReservation hook tests
import { renderHook, act, waitFor } from '@testing-library/react';
import { useReservation } from './useReservation';

// Import the actual Yup module to access its non-mocked parts, like ValidationError
// import * as ActualYup from 'yup'; // Not strictly needed if mock below is correct
import * as MockedYup from 'yup'; // Import the mocked yup module

// Use vi.hoisted to define spies that vi.mock can access before their lexical declaration
const { mockSchemaValidate, mockYupReach } = vi.hoisted(() => {
  const schemaValidate = vi.fn();
  const yupReach = vi.fn(() => ({ validate: schemaValidate }));
  return { mockSchemaValidate: schemaValidate, mockYupReach: yupReach };
});

vi.mock('yup', async () => {
  const originalYup = await vi.importActual('yup');
  return {
    ...originalYup,
    reach: mockYupReach, // Assign the predefined spy to Yup.reach
  };
});

// Mock global APIs that useReservation depends on
const mockFetchAPI = vi.fn();
const mockSubmitAPI = vi.fn();

beforeEach(() => {
  vi.resetAllMocks(); // Reset mocks before each test

  // Provide default implementations for mocked APIs
  global.fetchAPI = mockFetchAPI.mockResolvedValue(['10:00', '11:00']); // Default success
  global.submitAPI = mockSubmitAPI.mockResolvedValue(true); // Default success

  // Mock localStorage
  Storage.prototype.getItem = vi.fn();
  Storage.prototype.setItem = vi.fn();
  Storage.prototype.removeItem = vi.fn();
  Storage.prototype.clear = vi.fn();
});

describe('useReservation Hook - Failing Tests Focus', () => {
  // Failing Test 1: Unexpected Yup Validation Error
  describe('handleDateTimeChange - Advanced Error Coverage', () => {
    it('should handle unexpected error during Yup validation in handleDateTimeChange', async () => {
      // Configure the globally defined mockYupValidate for this specific test
      mockSchemaValidate.mockRejectedValueOnce(new Error('Unexpected Yup Error'));

      const { result } = renderHook(() => useReservation());
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {}); // Spy and silence

      await act(async () => {
        // Attempt to change date, which should trigger validation
        // The field 'date' and a sample value '2025-12-01' are used here.
        // This assumes validateField is called internally by handleDateTimeChange.
        result.current.handleDateTimeChange('date', '2025-12-01');
      });

      expect(mockYupReach).toHaveBeenCalled(); // Check if Yup.reach itself was called
      expect(mockSchemaValidate).toHaveBeenCalled(); // Check if the validate method on the reached schema was called
      expect(result.current.formErrors.date).toBeUndefined(); // Should not set a typical validation error, so it remains undefined
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error validating field date: Unexpected Yup Error', expect.any(Error));
      
      consoleErrorSpy.mockRestore();
      mockYupReach.mockClear();
      mockSchemaValidate.mockClear();
    });
  });

  // Failing Test 2: localStorage.setItem error when removing a reservation
  describe('removeReservationById - Coverage', () => {
    const initialReservations = [
      { id: '1', name: 'Test User', date: '2025-10-10', time: '10:00', partySize: '2' },
      { id: '2', name: 'Another User', date: '2025-11-11', time: '11:00', partySize: '4' },
    ];

    it('should handle localStorage.setItem error when removing a reservation', async () => {
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(initialReservations));
      
      const { result } = renderHook(() => useReservation());
      
      // Wait for past reservations to be loaded from the mock
      await waitFor(() => {
        expect(result.current.pastReservations.find(r => r.id === '1')).toBeDefined();
        expect(result.current.pastReservations.length).toBe(initialReservations.length);
      });
      getItemSpy.mockRestore();

      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      setItemSpy.mockImplementationOnce(() => {
        throw new Error('Failed to save to localStorage');
      });

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {}); // Spy and silence

      await act(async () => {
        result.current.removeReservationById('1');
      });

      // The reservation state should NOT be updated if localStorage.setItem fails, as per current hook logic
      expect(result.current.pastReservations.find(r => r.id === '1')).toBeDefined();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error removing reservation from localStorage:', expect.any(Error));
      
      setItemSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });
});
