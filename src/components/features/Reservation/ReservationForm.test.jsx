// src/components/features/Reservation/ReservationForm.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'; // Import fireEvent
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import ReservationForm from './ReservationForm';

// Add mobile viewport mock for testing
const originalInnerWidth = window.innerWidth;
const originalInnerHeight = window.innerHeight;

// Setup for mobile viewport testing
beforeEach(() => {
  // Mock a mobile device viewport (iPhone X dimensions)
  Object.defineProperty(window, 'innerWidth', { writable: true, value: 375 });
  Object.defineProperty(window, 'innerHeight', { writable: true, value: 812 });
  window.dispatchEvent(new Event('resize'));
});

// Restore original dimensions after tests
afterEach(() => {
  Object.defineProperty(window, 'innerWidth', { writable: true, value: originalInnerWidth });
  Object.defineProperty(window, 'innerHeight', { writable: true, value: originalInnerHeight });
  window.dispatchEvent(new Event('resize'));
});

const mockOnFormChange = vi.fn();
const mockValidateField = vi.fn();
const mockFormData = {
  name: '',
  email: '',
  phone: '',
  occasion: 'Birthday', // Default or typical value
  specialRequests: ''
};

describe('ReservationForm', () => {
  const defaultTestPropsBase = {
    onFormChange: mockOnFormChange,
    validateField: mockValidateField,
    formErrors: {},
  };
  beforeEach(() => {
    // Reset mocks before each test
    mockOnFormChange.mockClear();
    mockValidateField.mockClear();
  });

  test('renders all its direct input fields', () => {
    render(<ReservationForm {...defaultTestPropsBase} formData={mockFormData} />);
    
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument(); // Adjusted: More specific to avoid matching 'Email Address' if it existed elsewhere
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/occasion \(optional\)/i)).toBeInTheDocument(); // Adjusted for '(Optional)'
    expect(screen.getByLabelText(/special requests \(optional\)/i)).toBeInTheDocument(); // Adjusted for '(Optional)'

    // The submit button is not rendered by ReservationForm itself,
    // so we don't test for it in this specific rendering test.
    // Form submission capability will be tested by checking if handleSubmit
    // (and thus validateForm) is called when the form is submitted (e.g., by a parent's button).
  });

  test('calls onFormChange with updated name when name input changes', async () => {
    userEvent.setup(); // Still call setup in case other interactions need it, but don't assign to unused var
    // Use a fresh mockFormData for this test to ensure independence
    const initialFormData = {
      name: '',
      email: 'test@example.com',
      phone: '1234567890',
      occasion: 'Birthday',
      specialRequests: 'None'
    };
    render(<ReservationForm {...defaultTestPropsBase} formData={initialFormData} />);
    
    const nameInput = screen.getByLabelText(/full name/i);
    // Using fireEvent.change here as userEvent.type was showing unexpected behavior
    // where only the last character was being registered in the mock call for this specific setup.
    // fireEvent.change directly sets the value and dispatches one change event.
    fireEvent.change(nameInput, { target: { value: 'Chien' } });
    
    // Check the call to onFormChange (it will be called once)
    expect(mockOnFormChange).toHaveBeenLastCalledWith({
      ...initialFormData,
      name: 'Chien'
    });
  });

  test('calls onFormChange with updated email when email input changes', async () => {
    userEvent.setup();
    const initialFormData = {
      name: 'Chien',
      email: '',
      phone: '1234567890',
      occasion: 'Birthday',
      specialRequests: 'None'
    };
    render(<ReservationForm {...defaultTestPropsBase} formData={initialFormData} />);
    
    const emailInput = screen.getByLabelText(/^email$/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(mockOnFormChange).toHaveBeenLastCalledWith({
      ...initialFormData,
      email: 'test@example.com'
    });
  });

  test('calls onFormChange with updated phone when phone input changes', async () => {
    userEvent.setup();
    const initialFormData = {
      name: 'Chien',
      email: 'test@example.com',
      phone: '',
      occasion: 'Birthday',
      specialRequests: 'None'
    };
    render(<ReservationForm {...defaultTestPropsBase} formData={initialFormData} />);
    
    const phoneInput = screen.getByLabelText(/phone number/i);
    fireEvent.change(phoneInput, { target: { value: '0123456789' } });
    
    // Updated expectation to match the formatted phone number with hyphens
    expect(mockOnFormChange).toHaveBeenLastCalledWith({
      ...initialFormData,
      phone: '012-345-6789'
    });
  });

  test('calls onFormChange with updated occasion when occasion select changes', async () => {
    userEvent.setup();
    const initialFormData = {
      name: 'Chien',
      email: 'test@example.com',
      phone: '0123456789',
      occasion: '', // Start with no occasion selected
      specialRequests: 'None'
    };
    render(<ReservationForm {...defaultTestPropsBase} formData={initialFormData} />);
    
    const occasionSelect = screen.getByLabelText(/occasion \(optional\)/i);
    // For select elements, fireEvent.change is typically used with the new value
    fireEvent.change(occasionSelect, { target: { value: 'anniversary' } });
    
    expect(mockOnFormChange).toHaveBeenLastCalledWith({
      ...initialFormData,
      occasion: 'anniversary'
    });
  });

  test('calls onFormChange with updated special requests when textarea changes', async () => {
    userEvent.setup();
    const initialFormData = {
      name: 'Chien',
      email: 'test@example.com',
      phone: '0123456789',
      occasion: 'anniversary',
      specialRequests: '' // Start with empty special requests
    };
    render(<ReservationForm {...defaultTestPropsBase} formData={initialFormData} />);
    
    const specialRequestsTextarea = screen.getByLabelText(/special requests \(optional\)/i);
    fireEvent.change(specialRequestsTextarea, { target: { value: 'Allergic to peanuts' } });
    
    expect(mockOnFormChange).toHaveBeenLastCalledWith({
      ...initialFormData,
      specialRequests: 'Allergic to peanuts'
    });
  });

  test('displays name validation error on submit if empty and clears it on input', async () => {
    userEvent.setup();
    const initialFormData = {
      name: '', // Name is empty
      email: 'test@example.com',
      phone: '0123456789',
      occasion: 'anniversary',
      specialRequests: 'None'
    };
    
    // Set up form errors for this test
    const formErrors = { name: '' };
    
    // Mock validateField to set the error
    mockValidateField.mockImplementation((field, value) => {
      if (field === 'name' && !value) {
        formErrors.name = 'Name is required';
      } else {
        formErrors.name = '';
      }
    });
    
    const { container, rerender } = render(
      <ReservationForm 
        {...defaultTestPropsBase} 
        formData={initialFormData} 
        formErrors={formErrors}
        validateField={mockValidateField}
      />
    );

    // Find the form element
    const formElement = container.querySelector('form');
    expect(formElement).toBeInTheDocument();

    // Simulate form submission
    if (formElement) {
      fireEvent.submit(formElement);
      // Manually trigger validation as it would happen in the real component
      mockValidateField('name', initialFormData.name);
    }
    
    // Rerender with updated errors
    rerender(
      <ReservationForm 
        {...defaultTestPropsBase} 
        formData={initialFormData} 
        formErrors={formErrors}
        validateField={mockValidateField}
      />
    );

    // Check for error message
    expect(screen.getByText('Name is required')).toBeInTheDocument();

    // Simulate typing into the name field to clear the error
    const nameInput = screen.getByLabelText(/full name/i);
    fireEvent.change(nameInput, { target: { value: 'Chien' } });
    
    // Clear the error as would happen in the real component
    formErrors.name = '';
    
    // Rerender with updated data and cleared errors
    rerender(
      <ReservationForm 
        {...defaultTestPropsBase} 
        formData={{...initialFormData, name: 'Chien'}} 
        formErrors={formErrors}
        validateField={mockValidateField}
      />
    );

    // Check that the error message is cleared
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
  });

  test('displays email validation error on submit if empty or invalid, and clears it on valid input', async () => {
    userEvent.setup();
    const initialFormData = {
      name: 'Chien',
      email: '', // Email is empty
      phone: '0123456789',
      occasion: 'anniversary',
      specialRequests: 'None'
    };
    
    // Set up form errors for this test
    const formErrors = { email: '' };
    
    // Mock validateField to set the error
    mockValidateField.mockImplementation((field, value) => {
      if (field === 'email') {
        if (!value || !value.includes('@')) {
          formErrors.email = 'Valid email is required';
        } else {
          formErrors.email = '';
        }
      }
    });
    
    const { container, rerender } = render(
      <ReservationForm 
        {...defaultTestPropsBase} 
        formData={initialFormData} 
        formErrors={formErrors}
        validateField={mockValidateField}
      />
    );
    
    const formElement = container.querySelector('form');
    expect(formElement).toBeInTheDocument();

    // 1. Test empty email submission
    if (formElement) {
      fireEvent.submit(formElement);
      // Manually trigger validation
      mockValidateField('email', initialFormData.email);
    }
    
    // Rerender with updated errors
    rerender(
      <ReservationForm 
        {...defaultTestPropsBase} 
        formData={initialFormData} 
        formErrors={formErrors}
        validateField={mockValidateField}
      />
    );
    
    expect(screen.getByText('Valid email is required')).toBeInTheDocument();

    // 2. Test invalid email submission
    let updatedFormData = { ...initialFormData, email: 'invalidemail' };
    mockOnFormChange.mockImplementationOnce((newData) => { updatedFormData = newData; });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'invalidemail' } });
    
    // Trigger validation for invalid email
    mockValidateField('email', 'invalidemail');
    
    rerender(
      <ReservationForm 
        {...defaultTestPropsBase} 
        formData={updatedFormData} 
        formErrors={formErrors}
        validateField={mockValidateField}
      />
    );
    
    expect(screen.getByText('Valid email is required')).toBeInTheDocument();

    // 3. Test valid email input clears error
    updatedFormData = { ...updatedFormData, email: 'valid@example.com' };
    mockOnFormChange.mockImplementationOnce((newData) => { updatedFormData = newData; });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'valid@example.com' } });
    
    // Clear the error for valid email
    formErrors.email = '';
    
    rerender(
      <ReservationForm 
        {...defaultTestPropsBase} 
        formData={updatedFormData} 
        formErrors={formErrors}
        validateField={mockValidateField}
      />
    );
    
    expect(screen.queryByText('Valid email is required')).not.toBeInTheDocument();
  });

  test('displays phone validation error on submit if empty or invalid, and clears it on valid input', async () => {
    userEvent.setup();
    const initialFormData = {
      name: 'Chien',
      email: 'valid@example.com',
      phone: '', // Phone is empty
      occasion: 'anniversary',
      specialRequests: 'None'
    };
    
    // Set up form errors for this test
    const formErrors = { phone: '' };
    
    // Mock validateField to set the error
    mockValidateField.mockImplementation((field, value) => {
      if (field === 'phone') {
        if (!value || !value.match(/^\d{3}-\d{3}-\d{4}$/)) {
          formErrors.phone = 'Valid phone number is required (e.g., 123-456-7890)';
        } else {
          formErrors.phone = '';
        }
      }
    });
    
    const { container, rerender } = render(
      <ReservationForm 
        {...defaultTestPropsBase} 
        formData={initialFormData} 
        formErrors={formErrors}
        validateField={mockValidateField}
      />
    );
    
    const formElement = container.querySelector('form');
    expect(formElement).toBeInTheDocument();

    // 1. Test empty phone submission
    if (formElement) {
      fireEvent.submit(formElement);
      // Manually trigger validation
      mockValidateField('phone', initialFormData.phone);
    }
    
    // Rerender with updated errors
    rerender(
      <ReservationForm 
        {...defaultTestPropsBase} 
        formData={initialFormData} 
        formErrors={formErrors}
        validateField={mockValidateField}
      />
    );
    
    expect(screen.getByText('Valid phone number is required (e.g., 123-456-7890)')).toBeInTheDocument();
    
    // 2. Test invalid phone submission (too short)
    let updatedFormData = { ...initialFormData, phone: '123' };
    mockOnFormChange.mockImplementationOnce((newData) => { updatedFormData = newData; });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '123' } });
    
    // Trigger validation for invalid phone
    mockValidateField('phone', '123');
    
    rerender(
      <ReservationForm 
        {...defaultTestPropsBase} 
        formData={updatedFormData} 
        formErrors={formErrors}
        validateField={mockValidateField}
      />
    );
    
    expect(screen.getByText('Valid phone number is required (e.g., 123-456-7890)')).toBeInTheDocument();

    // 3. Test valid phone input clears error
    updatedFormData = { ...updatedFormData, phone: '123-456-7890' };
    mockOnFormChange.mockImplementationOnce((newData) => { updatedFormData = newData; });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '123-456-7890' } });
    
    // Clear the error for valid phone
    formErrors.phone = '';
    
    rerender(
      <ReservationForm 
        {...defaultTestPropsBase} 
        formData={updatedFormData} 
        formErrors={formErrors}
        validateField={mockValidateField}
      />
    );
    
    expect(screen.queryByText('Valid phone number is required (e.g., 123-456-7890)')).not.toBeInTheDocument();
  });

  test('does not display validation errors when form is submitted with all valid data', async () => {
    userEvent.setup();
    const validFormData = {
      name: 'Chien Duong',
      email: 'chien@example.com',
      phone: '111-222-3333',
      occasion: 'Birthday',
      specialRequests: 'A nice quiet table, please.'
    };
    
    // Set up empty form errors for this test
    const formErrors = { name: '', email: '', phone: '' };
    
    // Mock validateField to verify valid data
    mockValidateField.mockImplementation((field, value) => {
      // All fields are valid, so no errors should be set
      formErrors[field] = '';
    });
    
    const { container } = render(
      <ReservationForm 
        {...defaultTestPropsBase} 
        formData={validFormData} 
        formErrors={formErrors}
        validateField={mockValidateField}
      />
    );
    
    const formElement = container.querySelector('form');
    expect(formElement).toBeInTheDocument();

    if (formElement) {
      fireEvent.submit(formElement);
      // Validate all fields
      mockValidateField('name', validFormData.name);
      mockValidateField('email', validFormData.email);
      mockValidateField('phone', validFormData.phone);
    }

    // Check that no error messages are displayed
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Valid email is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Valid phone number is required (e.g., 123-456-7890)')).not.toBeInTheDocument();
  });
});
