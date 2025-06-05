import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import DateTimeSelector from './DateTimeSelector';
import { getAvailableTimeSlots } from '../../../services/reservationService';

// Mock the reservationService
vi.mock('../../../services/reservationService', () => ({
  getAvailableTimeSlots: vi.fn(),
}));

// Helper to get today's date in YYYY-MM-DD format
const getTodayString = () => new Date().toISOString().split('T')[0];

describe('DateTimeSelector Component', () => {
  const mockOnDateChange = vi.fn();
  const mockOnTimeChange = vi.fn();
  const mockOnPartySizeChange = vi.fn();
  const mockValidateField = vi.fn();

  const defaultProps = {
    selectedDate: '',
    selectedTime: '',
    partySize: 2,
    onDateChange: mockOnDateChange,
    onTimeChange: mockOnTimeChange,
    onPartySizeChange: mockOnPartySizeChange,
    formErrors: {},
    availableTimes: [],
    isLoadingTimes: false,
    validateField: mockValidateField
  };

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Reset mock implementation for getAvailableTimeSlots if needed
    getAvailableTimeSlots.mockResolvedValue(['17:00', '18:00']); 
  });

  test('renders correctly with default props', () => {
    render(<DateTimeSelector {...defaultProps} />);

    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    // The custom date button will show 'Select a date'
    expect(screen.getByText('Select a date')).toBeInTheDocument();
    expect(screen.getByLabelText(/Time/i)).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Select a time' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Party Size/i)).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '2 people' }).selected).toBe(true);
  });

  test('time select is disabled when no date is selected', () => {
    render(<DateTimeSelector {...defaultProps} />);
    expect(screen.getByLabelText(/Time/i)).toBeDisabled();
  });

  test('renders with pre-selected values', async () => {
    const today = getTodayString();
    // Ensure the selected time is available in the mock
    getAvailableTimeSlots.mockResolvedValue(['17:00', '18:00', '19:00']);

    render(
      <DateTimeSelector
        {...defaultProps}
        selectedDate={today}
        selectedTime="17:00" // 5:00 PM
        partySize={4}
        availableTimes={['17:00', '18:00', '19:00']}
      />
    );

    // Check if the formatted date is displayed via the hidden input's value
    expect(screen.getByLabelText('Select a date for your reservation').value).toBe(today);
    
    // Check selected options
    expect(screen.getByRole('option', { name: '5:00 PM' }).selected).toBe(true);
    expect(screen.getByRole('option', { name: '4 people' }).selected).toBe(true);
  });


  describe('Date Interaction and Validation', () => {
    beforeEach(() => {
      // Reset mocks before each test in this describe block
      vi.clearAllMocks();
      // Default mock for successful fetch
      getAvailableTimeSlots.mockResolvedValue(['17:00', '18:00']);
    });

    test('calls onDateChange and fetches time slots when a valid future date is selected', async () => {
      // Create a future date string
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5); // Ensure it's well in the future
      const futureDateString = futureDate.toISOString().split('T')[0];

      // The beforeEach for this describe block mocks getAvailableTimeSlots to return ['17:00', '18:00']
      render(
        <DateTimeSelector 
          {...defaultProps} 
          selectedDate={futureDateString} 
          availableTimes={['17:00', '18:00']} 
        />
      );
      
      // Check that the time options are rendered
      expect(screen.getByRole('option', { name: '5:00 PM' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '6:00 PM' })).toBeInTheDocument();
    });

    test('displays error and clears slots for past date selection', async () => {
      render(<DateTimeSelector {...defaultProps} />);
      const dateInput = screen.getByLabelText('Select a date for your reservation');
      
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const pastDateString = pastDate.toISOString().split('T')[0];

      fireEvent.change(dateInput, { target: { value: pastDateString } });
      expect(mockOnDateChange).toHaveBeenCalledWith(pastDateString);
      
      // Re-render with the new (invalid) date prop and error message
      render(<DateTimeSelector 
        {...defaultProps} 
        selectedDate={pastDateString} 
        formErrors={{ date: 'Please select a future date' }}
      />);
      
      expect(screen.getByText('Please select a future date')).toBeInTheDocument();
      expect(screen.getByLabelText(/Time/i)).toBeDisabled();
    });

    test('resets selected time if it becomes unavailable after date change', async () => {
      const today = getTodayString();
      
      // Render with initial available times including 17:00
      render(
        <DateTimeSelector 
          {...defaultProps} 
          selectedDate={today} 
          selectedTime="17:00" 
          availableTimes={['17:00', '18:00']}
        />
      );
      expect(screen.getByRole('option', { name: '5:00 PM' }).selected).toBe(true);

      // Change date, and now 17:00 is NOT available
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split('T')[0];
      
      // Re-render with new available times that don't include 17:00
      render(
        <DateTimeSelector 
          {...defaultProps} 
          selectedDate={tomorrowString} 
          selectedTime="17:00" // Still passing the old selectedTime
          availableTimes={['19:00', '20:00']} // 17:00 is no longer an option
        />
      );
      
      // Verify the useEffect ran to reset the time
      expect(mockOnTimeChange).toHaveBeenCalledWith('');
    });
  });

  describe('Time Interaction', () => {
    test('calls onTimeChange when a time is selected', async () => {
      const today = getTodayString();
      
      // Render with available times already set
      render(
        <DateTimeSelector 
          {...defaultProps} 
          selectedDate={today} 
          availableTimes={['17:00', '18:00', '19:00']}
        />
      );
      
      const timeSelect = screen.getByLabelText(/Time/i);
      fireEvent.change(timeSelect, { target: { value: '18:00' } });
      
      expect(mockOnTimeChange).toHaveBeenCalledWith('18:00');
    });

    test('shows "No available times" message when no slots are available for a selected date', async () => {
      const today = getTodayString();
      
      // Render with empty available times
      render(
        <DateTimeSelector 
          {...defaultProps} 
          selectedDate={today} 
          availableTimes={[]} 
        />
      );
      
      // Check for the exact text that appears in the component
      expect(screen.getByText('No available times for this date.')).toBeInTheDocument();
      expect(screen.getByLabelText(/Time/i)).toBeDisabled();
    });
  });

  describe('Party Size Interaction', () => {
    test('calls onPartySizeChange when party size is changed', () => {
      render(<DateTimeSelector {...defaultProps} />);
      const partySizeSelect = screen.getByLabelText(/Party Size/i);
      
      fireEvent.change(partySizeSelect, { target: { value: '4' } });
      expect(mockOnPartySizeChange).toHaveBeenCalledWith(4);

      fireEvent.change(partySizeSelect, { target: { value: '11' } }); // For 11+ people
      expect(mockOnPartySizeChange).toHaveBeenCalledWith(11);
    });
  });

  describe('Display Formatting', () => {
    test('displays formatted date and time when selected', async () => {
      const date = getTodayString(); // Use today's date
      const time = '19:30';
      
      // Render with available times already set
      render(
        <DateTimeSelector 
          {...defaultProps} 
          selectedDate={date} 
          selectedTime={time} 
          availableTimes={[time, '20:00']}
        />
      );

      // Format date for assertion (e.g., June 04, 2025)
      const [year, month, day] = date.split('-').map(Number);
      const expectedDateString = new Date(year, month - 1, day).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      expect(screen.getByText(expectedDateString)).toBeInTheDocument();

      // Check for the selected time option
      const timeOption = screen.getByRole('option', { name: '7:30 PM' });
      expect(timeOption.selected).toBe(true);
    });
    
    // Test formatTimeForDisplay function with various time formats
    test('formatTimeForDisplay correctly formats time values', () => {
      // Render with times that will exercise different branches of formatTimeForDisplay
      render(<DateTimeSelector 
        {...defaultProps} 
        selectedDate={getTodayString()} 
        availableTimes={['17:00', '08:30', '12:00', '00:00']} 
      />);
      
      // Check that times are formatted correctly
      expect(screen.getByRole('option', { name: '5:00 PM' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '8:30 AM' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '12:00 PM' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '12:00 AM' })).toBeInTheDocument();
    });
    
    // Test edge cases for formatTimeForDisplay
    test('formatTimeForDisplay handles edge cases', () => {
      render(
        <DateTimeSelector 
          {...defaultProps}
          selectedDate={getTodayString()}
          availableTimes={['00:00', '12:00', '23:59']} 
        />
      );
      
      // Check midnight, noon, and just before midnight
      expect(screen.getByRole('option', { name: '12:00 AM' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '12:00 PM' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '11:59 PM' })).toBeInTheDocument();
    });
    
    // Test formatDateForDisplay function with different date formats
    test('formatDateForDisplay handles different date formats correctly', () => {
      // Test with different dates to ensure formatting works correctly
      const dates = [
        '2025-01-01', // New Year's Day
        '2025-12-25', // Christmas
        getTodayString() // Today
      ];
      
      // Test each date
      dates.forEach(date => {
        render(<DateTimeSelector {...defaultProps} selectedDate={date} />);
        
        // Format date for assertion
        const [year, month, day] = date.split('-').map(Number);
        const expectedDateString = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC'
        });
        
        expect(screen.getByText(expectedDateString)).toBeInTheDocument();
        
        // Cleanup after each render
        cleanup();
      });
    });
    
    // Test formatDateForDisplay with empty input
    test('formatDateForDisplay handles empty date string', () => {
      render(<DateTimeSelector {...defaultProps} selectedDate="" />);
      expect(screen.getByText('Select a date')).toBeInTheDocument();
    });
  });
  
  describe('Form Validation', () => {
    // Test validateField is called correctly
    test('calls validateField when inputs lose focus', () => {
      const today = getTodayString();
      render(
        <DateTimeSelector 
          {...defaultProps} 
          selectedDate={today}
          selectedTime="17:00"
          partySize={4}
          availableTimes={['17:00', '18:00']}
        />
      );
      
      // Test date validation
      fireEvent.blur(screen.getByLabelText('Select a date for your reservation'));
      expect(mockValidateField).toHaveBeenCalledWith('date', today);
      
      // Test time validation
      fireEvent.blur(screen.getByLabelText(/Time/i));
      expect(mockValidateField).toHaveBeenCalledWith('time', '17:00');
      
      // Test party size validation
      fireEvent.blur(screen.getByLabelText(/Party Size/i));
      expect(mockValidateField).toHaveBeenCalledWith('partySize', 4);
    });
    
    // Test error states for all form fields
    test('displays all error states correctly', () => {
      render(
        <DateTimeSelector 
          {...defaultProps} 
          selectedDate={getTodayString()}
          formErrors={{
            date: 'Invalid date selected',
            time: 'Please select a time',
            partySize: 'Please select a valid party size'
          }}
        />
      );
      
      expect(screen.getByText('Invalid date selected')).toBeInTheDocument();
      expect(screen.getByText('Please select a time')).toBeInTheDocument();
      expect(screen.getByText('Please select a valid party size')).toBeInTheDocument();
    });
  });
  
  describe('Component States', () => {
    // Test useEffect with different conditions
    test('useEffect handles all conditions correctly', () => {
      // Case 1: selectedDate and selectedTime are set, but time is not in availableTimes
      render(
        <DateTimeSelector 
          {...defaultProps} 
          selectedDate={getTodayString()}
          selectedTime="17:00"
          availableTimes={['18:00', '19:00']} // 17:00 not included
        />
      );
      expect(mockOnTimeChange).toHaveBeenCalledWith('');
      cleanup();
      
      // Case 2: selectedDate set, but no selectedTime
      mockOnTimeChange.mockClear();
      render(
        <DateTimeSelector 
          {...defaultProps} 
          selectedDate={getTodayString()}
          selectedTime=""
          availableTimes={['18:00', '19:00']}
        />
      );
      expect(mockOnTimeChange).not.toHaveBeenCalled();
      cleanup();
      
      // Case 3: No selectedDate
      mockOnTimeChange.mockClear();
      render(
        <DateTimeSelector 
          {...defaultProps} 
          selectedDate=""
          selectedTime="17:00"
          availableTimes={['18:00', '19:00']}
        />
      );
      expect(mockOnTimeChange).not.toHaveBeenCalled();
    });

    // Test loading state UI
    test('displays loading state correctly', () => {
      render(
        <DateTimeSelector 
          {...defaultProps} 
          selectedDate={getTodayString()}
          isLoadingTimes={true}
        />
      );
      
      expect(screen.getByText('Loading available times...')).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Loading times...' })).toBeInTheDocument();
    });
    
    // Test disabled states based on conditions
    test('time select is disabled under various conditions', () => {
      // Case 1: No date selected
      render(<DateTimeSelector {...defaultProps} selectedDate="" />);
      expect(screen.getByLabelText(/Time/i)).toBeDisabled();
      cleanup();
      
      // Case 2: Loading times
      render(<DateTimeSelector {...defaultProps} selectedDate={getTodayString()} isLoadingTimes={true} />);
      expect(screen.getByLabelText(/Time/i)).toBeDisabled();
      cleanup();
      
      // Case 3: No available times
      render(<DateTimeSelector {...defaultProps} selectedDate={getTodayString()} availableTimes={[]} />);
      expect(screen.getByLabelText(/Time/i)).toBeDisabled();
      cleanup();
      
      // Case 4: Date error exists
      render(<DateTimeSelector {...defaultProps} selectedDate={getTodayString()} formErrors={{date: 'Invalid date'}} />);
      expect(screen.getByLabelText(/Time/i)).toBeDisabled();
    });
  });
});


