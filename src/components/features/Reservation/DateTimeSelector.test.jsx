import React from 'react';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import { configureAxe } from 'vitest-axe';
import 'vitest-axe/extend-expect'; // This automatically extends expect
import DateTimeSelector from './DateTimeSelector';
import { getAvailableTimeSlots } from '../../../services/reservationService';
import { vi } from 'vitest';

// Configure axe for testing
const axe = configureAxe({
  rules: {
    // Add any specific rule configurations here if needed
  }
});

// Mock the reservationService
vi.mock('../../../services/reservationService', () => ({
  getAvailableTimeSlots: vi.fn(),
}));

// Mock console.error to suppress axe warnings during tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (args[0]?.includes('axe')) return;
    originalConsoleError(...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
});

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

    // Check for heading and fieldset structure
    expect(screen.getByRole('heading', { name: /Select Date & Time/i })).toBeInTheDocument();
    
    // Check for form controls
    expect(screen.getByLabelText(/Select a date for your reservation/i)).toBeInTheDocument();
    expect(screen.getByText('Select a date')).toBeInTheDocument();
    
    // Get the time select by its id instead of label
    expect(screen.getByRole('combobox', { name: /Time/i })).toBeInTheDocument();
    
    // Check for the default option in time select
    const timeSelect = screen.getByRole('combobox', { name: /Time/i });
    expect(within(timeSelect).getByText('Select a time')).toBeInTheDocument();
    
    // Check party size select
    const partySizeSelect = screen.getByRole('combobox', { name: /Party Size/i });
    expect(partySizeSelect).toBeInTheDocument();
    
    // Check for default party size (if it exists)
    if (defaultProps.partySize) {
      const expectedOption = `${defaultProps.partySize} ${defaultProps.partySize === 1 ? 'person' : 'people'}`;
      const options = within(partySizeSelect).getAllByRole('option');
      const selectedOption = options.find(option => option.selected);
      expect(selectedOption?.textContent.trim()).toBe(expectedOption);
    }
    
    // Check for required indicators
    const requiredIndicators = screen.getAllByText('*', { exact: true });
    expect(requiredIndicators.length).toBe(3);
  });

  test('time select is disabled when no date is selected', () => {
    render(<DateTimeSelector {...defaultProps} />);
    expect(screen.getByRole('combobox', { name: /Time/i })).toBeDisabled();
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
    
    // Check selected options in time select
    const timeSelect = screen.getByRole('combobox', { name: /Time/i });
    const timeOptions = within(timeSelect).getAllByRole('option');
    const selectedTimeOption = timeOptions.find(option => option.selected);
    expect(selectedTimeOption?.textContent.trim()).toBe('5:00 PM');
    
    // Check selected options in party size select
    const partySizeSelect = screen.getByRole('combobox', { name: /Party Size/i });
    const partySizeOptions = within(partySizeSelect).getAllByRole('option');
    const selectedPartySizeOption = partySizeOptions.find(option => option.selected);
    expect(selectedPartySizeOption?.textContent.trim()).toBe('4 people');
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
      const { rerender } = render(<DateTimeSelector {...defaultProps} />);
      const dateInput = screen.getByLabelText(/Select a date for your reservation/i, { selector: 'input' });
      
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const pastDateString = pastDate.toISOString().split('T')[0];

      fireEvent.change(dateInput, { target: { value: pastDateString } });
      expect(mockOnDateChange).toHaveBeenCalledWith(pastDateString);
      
      // Re-render with the new (invalid) date prop and error message
      rerender(<DateTimeSelector 
        {...defaultProps} 
        selectedDate={pastDateString} 
        formErrors={{ date: 'Please select a future date' }}
      />);
      
      // Check for error message with role="alert"
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent('Please select a future date');
      
      // Check that the input has aria-invalid="true"
      const dateInputWithError = screen.getByLabelText(/Select a date for your reservation/i, { selector: 'input' });
      expect(dateInputWithError).toHaveAttribute('aria-invalid', 'true');
      
      expect(screen.getByLabelText(/Time \*/i, { selector: 'select' })).toBeDisabled();
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
      
      const timeSelect = screen.getByLabelText(/Time \*/i, { selector: 'select' });
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
      
      // Check for the message with aria-live attribute
      const noTimesMessage = screen.getByText('No available times for this date.');
      expect(noTimesMessage).toBeInTheDocument();
      expect(noTimesMessage).toHaveAttribute('aria-live', 'polite');
      expect(screen.getByLabelText(/Time \*/i, { selector: 'select' })).toBeDisabled();
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
      
      // Check for error messages with role="alert"
      const errorMessages = screen.getAllByRole('alert');
      expect(errorMessages).toHaveLength(3);
      
      expect(errorMessages[0]).toHaveTextContent('Invalid date selected');
      expect(errorMessages[1]).toHaveTextContent('Please select a time');
      expect(errorMessages[2]).toHaveTextContent('Please select a valid party size');
      
      // Check that inputs have aria-invalid="true"
      const dateInput = screen.getByLabelText('Select a date for your reservation');
      const timeSelect = screen.getByRole('combobox', { name: /Time/i });
      const partySizeSelect = screen.getByRole('combobox', { name: /Party Size/i });
      
      expect(dateInput).toHaveAttribute('aria-invalid', 'true');
      expect(timeSelect).toHaveAttribute('aria-invalid', 'true');
      expect(partySizeSelect).toHaveAttribute('aria-invalid', 'true');
    });
    
    test('validates time selection', () => {
      const mockValidateField = vi.fn();
      
      render(
        <DateTimeSelector 
          {...defaultProps} 
          selectedDate={getTodayString()}
          availableTimes={['17:00', '18:00']}
          validateField={mockValidateField}
          formErrors={{ time: 'Please select a time' }}
        />
      );
      
      // Check that the error message is displayed
      expect(screen.getByText('Please select a time')).toBeInTheDocument();
      
      // Check that inputs have aria-invalid="true"
      const dateInput = screen.getByLabelText('Select a date for your reservation');
      const timeSelect = screen.getByRole('combobox', { name: /Time/i });
      
      expect(timeSelect).toHaveAttribute('aria-invalid', 'true');
      expect(dateInput).not.toHaveAttribute('aria-invalid', 'true');
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
    test('shows no available times message', () => {
      render(
        <DateTimeSelector 
          {...defaultProps} 
          selectedDate={getTodayString()}
          availableTimes={[]}
          isLoadingTimes={false}
        />
      );
      
      expect(screen.getByText('No available times for this date.')).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /Time/i })).toBeDisabled();
    });
    
    // Test loading state UI
    test('shows loading state when fetching time slots', () => {
      render(
        <DateTimeSelector 
          {...defaultProps} 
          selectedDate={getTodayString()}
          isLoadingTimes={true}
        />
      );
      
      // Check that the loading message is displayed
      expect(screen.getByText('Loading available times...')).toBeInTheDocument();
      
      // Check that the time select is disabled during loading
      const timeSelect = screen.getByRole('combobox', { name: /Time/i });
      expect(timeSelect).toBeDisabled();
      
      // Check that the loading option is shown in the select
      expect(screen.getByText('Loading times...')).toBeInTheDocument();
    });
    
    // Test disabled states based on conditions
    test('disables time select when appropriate', () => {
      // Case 1: No date selected
      render(<DateTimeSelector {...defaultProps} />);
      expect(screen.getByRole('combobox', { name: /Time/i })).toBeDisabled();
      cleanup();
      
      // Case 2: Loading times
      render(<DateTimeSelector {...defaultProps} selectedDate={getTodayString()} isLoadingTimes={true} />);
      expect(screen.getByRole('combobox', { name: /Time/i })).toBeDisabled();
      cleanup();
      
      // Case 3: No available times
      render(<DateTimeSelector {...defaultProps} selectedDate={getTodayString()} availableTimes={[]} />);
      expect(screen.getByRole('combobox', { name: /Time/i })).toBeDisabled();
      cleanup();
      
      // Case 4: Date error exists
      render(<DateTimeSelector {...defaultProps} selectedDate={getTodayString()} formErrors={{date: 'Invalid date'}} />);
      expect(screen.getByRole('combobox', { name: /Time/i })).toBeDisabled();
    });
  });

  describe('Time and Date Formatting', () => {
    test('displays correctly formatted date or placeholder in the custom button', () => {
      const testCases = [
        { input: '2024-07-15', expected: 'July 15, 2024' },
        { input: '2025-01-05', expected: 'January 5, 2025' },
        { input: '2023-12-31', expected: 'December 31, 2023' },
        { input: '', expected: 'Select a date' }, // Test for empty date
      ];

      testCases.forEach(({ input, expected }) => {
        const { unmount } = render(
          <DateTimeSelector {...defaultProps} selectedDate={input} availableTimes={input ? ['10:00'] : []} />
        );
        expect(screen.getByText(expected)).toBeInTheDocument();
        unmount(); 
      });
    });

    test('displays correctly formatted time options in the select dropdown', () => {
      const times = ['09:00', '12:30', '15:45', '00:15', '23:00'];
      const expectedDisplayTimes = ['9:00 AM', '12:30 PM', '3:45 PM', '12:15 AM', '11:00 PM'];
      
      render(
        <DateTimeSelector 
          {...defaultProps} 
          selectedDate={getTodayString()} 
          availableTimes={times} 
        />
      );

      const timeSelect = screen.getByLabelText(/Time \*/i, { selector: 'select' });
      expectedDisplayTimes.forEach(displayTime => {
        expect(within(timeSelect).getByRole('option', { name: displayTime })).toBeInTheDocument();
      });
    });
  });

  describe('Field Validation on Blur', () => {
    beforeEach(() => {
      mockValidateField.mockClear();
    });

    test('calls validateField on blur for date input', () => {
      render(<DateTimeSelector {...defaultProps} />);
      const dateInput = screen.getByLabelText(/Select a date for your reservation/i, { selector: 'input' });
      fireEvent.blur(dateInput);
      expect(mockValidateField).toHaveBeenCalledWith('date', defaultProps.selectedDate);
    });

    test('calls validateField on blur for time select', () => {
      render(<DateTimeSelector {...defaultProps} selectedDate={getTodayString()} availableTimes={['10:00', '11:00']} selectedTime={'10:00'} />);
      const timeSelect = screen.getByLabelText(/Time \*/i, { selector: 'select' });
      fireEvent.blur(timeSelect);
      expect(mockValidateField).toHaveBeenCalledWith('time', '10:00');
    });

    test('calls validateField on blur for party size select', () => {
      render(<DateTimeSelector {...defaultProps} partySize={3} />);
      const partySizeSelect = screen.getByLabelText(/Party Size/i, { selector: 'select' });
      fireEvent.blur(partySizeSelect);
      expect(mockValidateField).toHaveBeenCalledWith('partySize', 3);
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('should have no accessibility violations', async () => {
      const { container } = render(<DateTimeSelector {...defaultProps} />);
      const results = await axe(container);
      expect(results.violations.length).toBe(0);
    });

    test('should have proper ARIA attributes when form has errors', async () => {
      const propsWithErrors = {
        ...defaultProps,
        formErrors: {
          date: 'Please select a valid date',
          time: 'Please select a time',
          partySize: 'Please select party size'
        }
      };

      render(<DateTimeSelector {...propsWithErrors} />);
      
      // Check date input
      const dateInput = screen.getByLabelText(/select a date for your reservation/i);
      expect(dateInput).toHaveAttribute('aria-invalid', 'true');
      expect(dateInput).toHaveAttribute('aria-required', 'true');
      expect(dateInput).toHaveAttribute('aria-describedby');
      
      // Check time select
      const timeSelect = screen.getByRole('combobox', { name: /time/i });
      expect(timeSelect).toHaveAttribute('aria-invalid', 'true');
      expect(timeSelect).toHaveAttribute('aria-required', 'true');
      expect(timeSelect).toHaveAttribute('aria-describedby');
      
      // Check party size select
      const partySizeSelect = screen.getByRole('combobox', { name: /party size/i });
      expect(partySizeSelect).toHaveAttribute('aria-invalid', 'true');
      expect(partySizeSelect).toHaveAttribute('aria-required', 'true');
      expect(partySizeSelect).toHaveAttribute('aria-describedby');
      
      // Check error messages
      const errorMessages = screen.getAllByRole('alert');
      expect(errorMessages).toHaveLength(3);
    });

    test('should have proper ARIA attributes when form is valid', () => {
      render(<DateTimeSelector {...defaultProps} />);
      
      // Check date input
      const dateInput = screen.getByLabelText(/select a date for your reservation/i);
      expect(dateInput).not.toHaveAttribute('aria-invalid', 'true');
      expect(dateInput).toHaveAttribute('aria-required', 'true');
      
      // Check time select
      const timeSelect = screen.getByRole('combobox', { name: /time/i });
      expect(timeSelect).not.toHaveAttribute('aria-invalid', 'true');
      expect(timeSelect).toHaveAttribute('aria-required', 'true');
      
      // Check party size select
      const partySizeSelect = screen.getByRole('combobox', { name: /party size/i });
      expect(partySizeSelect).not.toHaveAttribute('aria-invalid', 'true');
      expect(partySizeSelect).toHaveAttribute('aria-required', 'true');
    });

    test('should have proper semantic structure', () => {
      render(<DateTimeSelector {...defaultProps} />);
      
      // Check for proper heading
      expect(screen.getByRole('heading', { name: /select date & time/i })).toBeInTheDocument();
      
      // Check for group role (the main container has role="group")
      expect(screen.getByRole('group', { name: /select date & time/i })).toBeInTheDocument();
      
      // Check for fieldset element
      expect(document.querySelector('fieldset')).toBeInTheDocument();
      
      // Check for legend with visually hidden class - updated to match the actual class name in the component
      expect(document.querySelector('legend._visuallyHidden_139470')).not.toBeNull();
      
      // Check for helper text
      const helperText = screen.getByText(/please select a date between today and/i);
      expect(helperText).toBeInTheDocument();
    });
  });
});


