// src/components/features/Reservation/ReservationForm.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'; // Import fireEvent
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import ReservationForm from './ReservationForm';

const mockOnFormChange = vi.fn();
const mockFormData = {
  name: '',
  email: '',
  phone: '',
  occasion: 'Birthday', // Default or typical value
  specialRequests: ''
};

describe('ReservationForm', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockOnFormChange.mockClear();
  });

  test('renders all its direct input fields', () => {
    render(<ReservationForm formData={mockFormData} onFormChange={mockOnFormChange} />);
    
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
    render(<ReservationForm formData={initialFormData} onFormChange={mockOnFormChange} />);
    
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
    render(<ReservationForm formData={initialFormData} onFormChange={mockOnFormChange} />);
    
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
    render(<ReservationForm formData={initialFormData} onFormChange={mockOnFormChange} />);
    
    const phoneInput = screen.getByLabelText(/phone number/i);
    fireEvent.change(phoneInput, { target: { value: '0123456789' } });
    
    expect(mockOnFormChange).toHaveBeenLastCalledWith({
      ...initialFormData,
      phone: '0123456789'
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
    render(<ReservationForm formData={initialFormData} onFormChange={mockOnFormChange} />);
    
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
    render(<ReservationForm formData={initialFormData} onFormChange={mockOnFormChange} />);
    
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
    const { container } = render(<ReservationForm formData={initialFormData} onFormChange={mockOnFormChange} />); // Destructure container to find form

    // Find the form element. A common way is to get an element within it and access its form property.
    // Or, if the form has a role or test-id. Here, we'll get it from the container for simplicity as it's the only form.
    const formElement = container.querySelector('form');
    expect(formElement).toBeInTheDocument(); // Ensure form is found

    // Simulate form submission
    if (formElement) { // Guard against formElement being null, though it shouldn't be
      fireEvent.submit(formElement);
    }

    // Check for error message
    expect(await screen.findByText('Name is required')).toBeInTheDocument();

    // Simulate typing into the name field to clear the error
    const nameInput = screen.getByLabelText(/full name/i);
    fireEvent.change(nameInput, { target: { value: 'Chien' } });

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
    const { container, rerender } = render(<ReservationForm formData={initialFormData} onFormChange={mockOnFormChange} />);
    const formElement = container.querySelector('form');
    expect(formElement).toBeInTheDocument();

    // 1. Test empty email submission
    if (formElement) fireEvent.submit(formElement);
    expect(await screen.findByText('Valid email is required')).toBeInTheDocument();

    // 2. Test invalid email submission
    // Update formData for the rerender and simulate change
    let updatedFormData = { ...initialFormData, email: 'invalidemail' };
    mockOnFormChange.mockImplementationOnce((newData) => { updatedFormData = newData; }); // Update formData when onFormChange is called
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'invalidemail' } });
    rerender(<ReservationForm formData={updatedFormData} onFormChange={mockOnFormChange} />);
    if (formElement) fireEvent.submit(formElement); // Submit again with invalid email
    expect(await screen.findByText('Valid email is required')).toBeInTheDocument(); // Error should still be there or reappear

    // 3. Test valid email input clears error
    // Update formData for the rerender and simulate change
    updatedFormData = { ...updatedFormData, email: 'valid@example.com' };
    mockOnFormChange.mockImplementationOnce((newData) => { updatedFormData = newData; });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'valid@example.com' } });
    rerender(<ReservationForm formData={updatedFormData} onFormChange={mockOnFormChange} />);
    // The error should clear on input change, not necessarily requiring another submit
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
    const { container, rerender } = render(<ReservationForm formData={initialFormData} onFormChange={mockOnFormChange} />);
    const formElement = container.querySelector('form');
    expect(formElement).toBeInTheDocument();

    // 1. Test empty phone submission
    if (formElement) fireEvent.submit(formElement);
    expect(await screen.findByText('Valid phone number is required')).toBeInTheDocument();

    // 2. Test invalid phone submission (e.g., letters)
    let updatedFormData = { ...initialFormData, phone: 'abcdef' };
    mockOnFormChange.mockImplementationOnce((newData) => { updatedFormData = newData; });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: 'abcdef' } });
    rerender(<ReservationForm formData={updatedFormData} onFormChange={mockOnFormChange} />);
    if (formElement) fireEvent.submit(formElement); // Submit again
    expect(await screen.findByText('Valid phone number is required')).toBeInTheDocument();

    // 3. Test valid phone input clears error
    updatedFormData = { ...updatedFormData, phone: '0123456789' };
    mockOnFormChange.mockImplementationOnce((newData) => { updatedFormData = newData; });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '0123456789' } });
    rerender(<ReservationForm formData={updatedFormData} onFormChange={mockOnFormChange} />);
    expect(screen.queryByText('Valid phone number is required')).not.toBeInTheDocument();
  });

  test('does not display validation errors when form is submitted with all valid data', async () => {
    userEvent.setup();
    const validFormData = {
      name: 'Chien Duong',
      email: 'chien.d@example.com',
      phone: '1234567890',
      occasion: 'Birthday',
      specialRequests: 'A nice quiet table, please.'
    };
    const { container } = render(<ReservationForm formData={validFormData} onFormChange={mockOnFormChange} />);
    const formElement = container.querySelector('form');
    expect(formElement).toBeInTheDocument();

    // Simulate form submission
    if (formElement) fireEvent.submit(formElement);

    // Assert that no validation error messages are present
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Valid email is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Valid phone number is required')).not.toBeInTheDocument();
  });

  // Add more tests here for input changes, validation, form submission handling, etc.
});
