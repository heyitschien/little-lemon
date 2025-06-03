import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

  const defaultProps = {
    selectedDate: '',
    selectedTime: '',
    partySize: 2,
    onDateChange: mockOnDateChange,
    onTimeChange: mockOnTimeChange,
    onPartySizeChange: mockOnPartySizeChange,
  };

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Reset mock implementation for getAvailableTimeSlots if needed
    getAvailableTimeSlots.mockReturnValue(['17:00', '18:00']); 
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
      />
    );

    // Wait for time slots to load and select to be enabled
    await waitFor(() => {
      expect(screen.getByLabelText(/Time/i)).not.toBeDisabled();
      expect(screen.getByRole('option', { name: '5:00 PM' })).toBeInTheDocument();
    });

    // Check if the formatted date is displayed via the hidden input's value
    expect(screen.getByLabelText('Select a date for your reservation').value).toBe(today);
    
    // Check selected options
    expect(screen.getByRole('option', { name: '5:00 PM' }).selected).toBe(true);
    expect(screen.getByRole('option', { name: '4 people' }).selected).toBe(true);
    // Verify time select is indeed enabled after waitFor
    expect(screen.getByLabelText(/Time/i)).not.toBeDisabled();
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
      render(<DateTimeSelector {...defaultProps} selectedDate={futureDateString} />);
      
      expect(getAvailableTimeSlots).toHaveBeenCalledWith(futureDateString);
      await waitFor(() => expect(screen.getByLabelText(/Time/i)).not.toBeDisabled());
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
      
      // Re-render with the new (invalid) date prop
      render(<DateTimeSelector {...defaultProps} selectedDate={pastDateString} />);
      
      expect(await screen.findByText('Please select a future date')).toBeInTheDocument();
      expect(getAvailableTimeSlots).not.toHaveBeenCalled();
      expect(screen.getByLabelText(/Time/i)).toBeDisabled();
    });

    test('resets selected time if it becomes unavailable after date change', async () => {
      const today = getTodayString();
      // Initially, 17:00 is available
      getAvailableTimeSlots.mockResolvedValueOnce(['17:00', '18:00']);
      render(
        <DateTimeSelector 
          {...defaultProps} 
          selectedDate={today} 
          selectedTime="17:00" 
        />
      );
      await waitFor(() => expect(screen.getByLabelText(/Time/i)).not.toBeDisabled());
      expect(screen.getByRole('option', { name: '5:00 PM' }).selected).toBe(true);

      // Change date, and now 17:00 is NOT available
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split('T')[0];
      
      // Mock for the second call to getAvailableTimeSlots
      getAvailableTimeSlots.mockResolvedValueOnce(['19:00', '20:00']); // 17:00 is no longer an option
      
      // Re-render as if parent changed the selectedDate prop, selectedTime prop remains '17:00'
      render(
        <DateTimeSelector 
          {...defaultProps} 
          selectedDate={tomorrowString} 
          selectedTime="17:00" // Still passing the old selectedTime
        />
      );
      
      // Wait for the second call to getAvailableTimeSlots to resolve and effects to run
      await waitFor(() => expect(getAvailableTimeSlots).toHaveBeenCalledWith(tomorrowString));
      // Expect onTimeChange to have been called with '' to reset the time
      expect(mockOnTimeChange).toHaveBeenCalledWith('');
    });
  });

  describe('Time Interaction', () => {
    test('calls onTimeChange when a time is selected', async () => {
      const today = getTodayString();
      getAvailableTimeSlots.mockResolvedValue(['17:00', '18:00', '19:00']);
      render(<DateTimeSelector {...defaultProps} selectedDate={today} />);
      
      const timeSelect = screen.getByLabelText(/Time/i);
      // Wait for time slots to load and select to be enabled
      await waitFor(() => expect(timeSelect).not.toBeDisabled());
      
      fireEvent.change(timeSelect, { target: { value: '18:00' } });
      
      expect(mockOnTimeChange).toHaveBeenCalledWith('18:00');
    });

    test('shows "No available times" message when no slots are available for a selected date', async () => {
      const today = getTodayString();
      getAvailableTimeSlots.mockResolvedValue([]); // No slots available
      render(<DateTimeSelector {...defaultProps} selectedDate={today} />);
      
      await waitFor(() => {
        expect(screen.getByText('No available times for this date')).toBeInTheDocument();
        // Also check if the time select is disabled
        expect(screen.getByLabelText(/Time/i)).toBeDisabled();
      });
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
      // Ensure the mock is set up to return the selectedTime as an available slot
      getAvailableTimeSlots.mockResolvedValue([time, '20:00']);

      render(<DateTimeSelector {...defaultProps} selectedDate={date} selectedTime={time} />);

      // Format date for assertion (e.g., June 02, 2025)
      const [year, month, day] = date.split('-').map(Number);
      const expectedDateString = new Date(year, month - 1, day).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      expect(screen.getByText(expectedDateString)).toBeInTheDocument();

      // Wait for the time select to be enabled (meaning slots are loaded)
      const timeSelect = screen.getByLabelText('Time');
      await waitFor(() => expect(timeSelect).not.toBeDisabled());

      // Now that it's enabled and populated, check for the selected option
      const timeOption = await screen.findByRole('option', { name: '7:30 PM' });
      expect(timeOption.selected).toBe(true);
    });
  });
});


