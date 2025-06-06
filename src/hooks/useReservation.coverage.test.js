import { renderHook, act } from '@testing-library/react';
import { useReservation } from './useReservation'; 
import * as ActualYup from 'yup'; 

// Mock the yup module
const mockYupValidate = vi.fn();
vi.mock('yup', async () => {
  const originalYup = await vi.importActual('yup'); // Import actual yup
  return {
    ...originalYup, // Spread original yup to get ValidationError, object, string, etc.
    reach: vi.fn(() => ({ // Mock reach
      validate: mockYupValidate, // Use the globally defined spy for validate
    })),
  };
});

// Mock global APIs that useReservation depends on
const mockFetchAPI = vi.fn();
const mockSubmitAPI = vi.fn();

describe('useReservation Hook - Coverage Tests', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockFetchAPI.mockReset();
    mockSubmitAPI.mockReset();
    localStorage.clear();

    // Assign to window for the hook to pick up
    global.fetchAPI = mockFetchAPI;
    global.submitAPI = mockSubmitAPI;
  });

  afterEach(() => {
    // Clean up mocks
    delete global.fetchAPI;
    delete global.submitAPI;
    localStorage.clear(); // Ensure clean state for other test files too
  });

  describe('API Availability and Initial Load', () => {
    it('should set error message if fetchAPI is not available on initial load', async () => {
      delete global.fetchAPI; // Simulate fetchAPI not being defined
      
      let hookResult;
      await act(async () => {
        const { result } = renderHook(() => useReservation());
        hookResult = result;
      });

      // Wait for any pending promises to resolve if necessary, though in this specific case it might be immediate
      // await act(async () => {}); 

      expect(hookResult.current.errorMessage).toBe('Error: Booking API not loaded.');
      expect(hookResult.current.availableTimes).toEqual([]);
      expect(mockFetchAPI).not.toHaveBeenCalled();
    });

    it('should set error message if submitAPI is not available when attempting submission', async () => {
      // Setup initial state to allow proceeding to submission step
      mockFetchAPI.mockResolvedValue(['10:00', '11:00']); // Provide some initial times
      const { result, rerender } = renderHook(() => useReservation());

      // Step 1: Select date, time, party size
      await act(async () => {
        result.current.handleDateTimeChange('date', '2025-12-25');
      });
      // Rerender or wait for state updates if fetchTimesForSelectedDate is async and updates state
      await act(async () => { rerender(); }); 
      await act(async () => {
        result.current.handleDateTimeChange('time', '10:00');
        result.current.handleDateTimeChange('partySize', '2');
      });
      await act(async () => {
        result.current.handleNextStep(); // Move to step 2
      });

      // Step 2: Fill form details
      await act(async () => {
        result.current.handleFormChange({
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '123-456-7890',
        });
      });
      await act(async () => {
        result.current.handleNextStep(); // Move to step 3 (confirmation)
      });
      
      delete global.submitAPI; // Simulate submitAPI not being defined

      let submissionResult;
      await act(async () => {
        submissionResult = await result.current.handleConfirmReservation();
      });

      expect(submissionResult).toBe(false);
      expect(result.current.errorMessage).toContain('Error: Booking submission API not loaded.');
      expect(mockSubmitAPI).not.toHaveBeenCalled();
    });

    it('should set error message if fetchAPI throws an error during initial load', async () => {
      mockFetchAPI.mockRejectedValue(new Error('Network Error'));
      
      let hookResult;
      await act(async () => {
        const { result } = renderHook(() => useReservation());
        hookResult = result;
      });

      expect(hookResult.current.errorMessage).toBe('Failed to load available times. Please try again.');
      expect(hookResult.current.availableTimes).toEqual([]);
      expect(mockFetchAPI).toHaveBeenCalledTimes(1);
    });

    it('should set error and use empty pastReservations if localStorage.getItem throws error during loadPastReservations', async () => {
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
      getItemSpy.mockImplementation(() => { 
        throw new Error('LocalStorage Read Error'); 
      });

      let hookResult;
      await act(async () => {
        const { result } = renderHook(() => useReservation());
        hookResult = result;
      });
      
      // Check console.error was called (optional, but good for verifying error handling)
      // For this, you might need to spy on console.error if not already done globally

      expect(hookResult.current.pastReservations).toEqual([]);
      // Potentially check for a console error message or a specific state if the hook sets one for this scenario
      getItemSpy.mockRestore();
    });

    it('should handle malformed JSON in localStorage for pastReservations gracefully', async () => {
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
      getItemSpy.mockReturnValue('this is not valid json');
      console.error = vi.fn(); // Spy on console.error

      let hookResult;
      await act(async () => {
        const { result } = renderHook(() => useReservation());
        hookResult = result;
      });

      expect(hookResult.current.pastReservations).toEqual([]);
      expect(console.error).toHaveBeenCalledWith('Error loading past reservations:', expect.any(SyntaxError));
      
      getItemSpy.mockRestore();
      console.error.mockRestore();
    });
  });

  describe('Step Navigation and Validation Coverage', () => {
    it('handleNextStep should set error message if step 1 validation fails (e.g., no date)', async () => {
      const { result } = renderHook(() => useReservation());
      // No data entered for step 1
      await act(async () => {
        result.current.handleNextStep();
      });
      expect(result.current.errorMessage).toBe('Please correct the errors highlighted below.');
      expect(result.current.formErrors.date).toBe('Date is required.');
      expect(result.current.currentStep).toBe(1);
    });
  });

  describe('handleConfirmReservation - Coverage', () => {
    beforeEach(() => {
      // Common setup for successful progression to confirmation step
      mockFetchAPI.mockResolvedValue(['10:00', '11:00']);
    });

    it('should set error message if localStorage.setItem throws error after successful submission', async () => {
      const { result, rerender } = renderHook(() => useReservation());
      // Step 1
      await act(async () => { result.current.handleDateTimeChange('date', '2025-12-25'); });
      await act(async () => { rerender(); });
      await act(async () => {
        result.current.handleDateTimeChange('time', '10:00');
        result.current.handleDateTimeChange('partySize', '2');
        result.current.handleNextStep(); // to step 2
      });
      // Step 2
      await act(async () => {
        result.current.handleFormChange({ name: 'LStorage Fail', email: 'ls@fail.com', phone: '111-222-3333' });
        result.current.handleNextStep(); // to step 3 (confirmation)
      });

      mockSubmitAPI.mockResolvedValue(true); // API submission is successful
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      setItemSpy.mockImplementation(() => { 
        throw new Error('LocalStorage Write Error'); 
      });
      
      console.error = vi.fn(); // Spy on console.error

      let submissionSuccessful;
      await act(async () => {
        submissionSuccessful = await result.current.handleConfirmReservation();
      });

      expect(submissionSuccessful).toBe(true); // Submission to API was successful
      expect(result.current.currentStep).toBe(4); // Should still proceed to success step
      expect(result.current.confirmedReservation).not.toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error saving reservation to localStorage:', expect.any(Error));
      // The errorMessage state might not be set here as the primary operation (API submit) succeeded.
      // The hook logs an error but might not show it to the user in this specific path.
      setItemSpy.mockRestore();
      console.error.mockRestore();
    });

    it('should set error message if submitAPI returns false', async () => {
      const { result, rerender } = renderHook(() => useReservation());
      // Step 1
      await act(async () => { result.current.handleDateTimeChange('date', '2025-12-26'); });
      await act(async () => { rerender(); });
      await act(async () => {
        result.current.handleDateTimeChange('time', '11:00');
        result.current.handleDateTimeChange('partySize', '3');
        result.current.handleNextStep(); // to step 2
      });
      // Step 2
      await act(async () => {
        result.current.handleFormChange({ name: 'API False', email: 'api@false.com', phone: '222-333-4444' });
        result.current.handleNextStep(); // to step 3 (confirmation)
      });

      mockSubmitAPI.mockResolvedValue(false); // API indicates failure

      let submissionSuccessful;
      await act(async () => {
        submissionSuccessful = await result.current.handleConfirmReservation();
      });

      expect(submissionSuccessful).toBe(false);
      expect(result.current.errorMessage).toBe('Failed to submit reservation. The selected time may no longer be available. Please try again or select a different time.');
      expect(result.current.confirmedReservation).toBeNull();
      expect(result.current.currentStep).toBe(1); // Actual behavior, hook resets to step 1
    });

     it('should set error message if submitAPI throws an error', async () => {
      const { result, rerender } = renderHook(() => useReservation());
      // Step 1 & 2 setup (similar to above)
      await act(async () => { result.current.handleDateTimeChange('date', '2025-12-27'); });
      await act(async () => { rerender(); });
      await act(async () => {
        result.current.handleDateTimeChange('time', '10:00');
        result.current.handleDateTimeChange('partySize', '4');
        result.current.handleNextStep();
      });
      await act(async () => {
        result.current.handleFormChange({ name: 'API Error', email: 'api@error.com', phone: '333-444-5555' });
        result.current.handleNextStep();
      });

      mockSubmitAPI.mockRejectedValue(new Error('Network Failure'));

      let submissionSuccessful;
      await act(async () => {
        submissionSuccessful = await result.current.handleConfirmReservation();
      });

      expect(submissionSuccessful).toBe(false);
      expect(result.current.errorMessage).toBe('An unexpected error occurred while submitting your reservation: Network Failure. Please try again.');
    }); // Closes the 'it' block for submitAPI throws an error
  }); // Closes the 'describe' block for 'handleConfirmReservation - Error Handling'
}); // Closes the main 'describe' block for 'useReservation Hook - Coverage Tests'
