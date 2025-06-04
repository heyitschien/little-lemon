// src/components/features/Reservation/ReservationFormEvents.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
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
  name: 'Test User',
  email: 'test@example.com',
  phone: '123-456-7890',
  occasion: 'birthday', // Default or typical value
  specialRequests: 'None'
};

describe('ReservationForm Event Handlers', () => {
  const defaultTestProps = {
    onFormChange: mockOnFormChange,
    validateField: mockValidateField,
    formErrors: {},
    formData: mockFormData
  };

  beforeEach(() => {
    // Reset mocks before each test
    mockOnFormChange.mockClear();
    mockValidateField.mockClear();
  });

  test('calls validateField on blur for all input fields', () => {
    render(<ReservationForm {...defaultTestProps} />);
    
    // Reset mock before starting the test
    mockValidateField.mockClear();
    
    // Test name input blur
    const nameInput = screen.getByLabelText(/full name/i);
    fireEvent.blur(nameInput);
    
    // Test email input blur
    const emailInput = screen.getByLabelText(/^email$/i);
    fireEvent.blur(emailInput);
    
    // Test phone input blur
    const phoneInput = screen.getByLabelText(/phone number/i);
    fireEvent.blur(phoneInput);
    
    // Test occasion select blur
    const occasionSelect = screen.getByLabelText(/occasion \(optional\)/i);
    fireEvent.blur(occasionSelect);
    
    // Test special requests textarea blur
    const specialRequestsTextarea = screen.getByLabelText(/special requests \(optional\)/i);
    fireEvent.blur(specialRequestsTextarea);
    
    // Verify validateField was called with the correct parameters
    expect(mockValidateField).toHaveBeenCalledWith('name', 'Test User');
    expect(mockValidateField).toHaveBeenCalledWith('email', 'test@example.com');
    expect(mockValidateField).toHaveBeenCalledWith('phone', '123-456-7890');
    expect(mockValidateField).toHaveBeenCalledWith('occasion', 'birthday');
    expect(mockValidateField).toHaveBeenCalledWith('specialRequests', 'None');
    
    // Verify validateField was called exactly 5 times (once for each field)
    expect(mockValidateField).toHaveBeenCalledTimes(5);
  });

  test('calls validateField on touchEnd for all input fields', async () => {
    userEvent.setup(); // Setup but don't assign to variable
    render(<ReservationForm {...defaultTestProps} />);
    
    // Reset mock before starting the test
    mockValidateField.mockClear();
    
    // Create a touch event for testing
    const createTouchEvent = (element) => {
      const touchEvent = new Event('touchend', { bubbles: true });
      element.dispatchEvent(touchEvent);
    };
    
    // Test name input touchEnd
    const nameInput = screen.getByLabelText(/full name/i);
    createTouchEvent(nameInput);
    
    // Test email input touchEnd
    const emailInput = screen.getByLabelText(/^email$/i);
    createTouchEvent(emailInput);
    
    // Test phone input touchEnd
    const phoneInput = screen.getByLabelText(/phone number/i);
    createTouchEvent(phoneInput);
    
    // Test occasion select touchEnd
    const occasionSelect = screen.getByLabelText(/occasion \(optional\)/i);
    createTouchEvent(occasionSelect);
    
    // Test special requests textarea touchEnd
    const specialRequestsTextarea = screen.getByLabelText(/special requests \(optional\)/i);
    createTouchEvent(specialRequestsTextarea);
    
    // Verify validateField was called with the correct parameters
    expect(mockValidateField).toHaveBeenCalledWith('name', 'Test User');
    expect(mockValidateField).toHaveBeenCalledWith('email', 'test@example.com');
    expect(mockValidateField).toHaveBeenCalledWith('phone', '123-456-7890');
    expect(mockValidateField).toHaveBeenCalledWith('occasion', 'birthday');
    expect(mockValidateField).toHaveBeenCalledWith('specialRequests', 'None');
    
    // Verify validateField was called exactly 5 times
    expect(mockValidateField).toHaveBeenCalledTimes(5);
  });

  test('handles phone formatting correctly for different input lengths', () => {
    render(<ReservationForm {...defaultTestProps} formData={{...mockFormData, phone: ''}} />);
    
    // Get the phone input
    const phoneInput = screen.getByLabelText(/phone number/i);
    
    // Test with 3 or fewer digits
    fireEvent.change(phoneInput, { target: { value: '123' } });
    expect(mockOnFormChange).toHaveBeenLastCalledWith({
      ...mockFormData,
      phone: '123'
    });
    
    // Test with 4-6 digits
    fireEvent.change(phoneInput, { target: { value: '123456' } });
    expect(mockOnFormChange).toHaveBeenLastCalledWith({
      ...mockFormData,
      phone: '123-456'
    });
    
    // Test with 7+ digits
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    expect(mockOnFormChange).toHaveBeenLastCalledWith({
      ...mockFormData,
      phone: '123-456-7890'
    });
  });

  test('validates all fields on form submission', () => {
    const { container } = render(<ReservationForm {...defaultTestProps} />);
    
    // Find and submit the form
    const formElement = container.querySelector('form');
    expect(formElement).toBeInTheDocument();
    
    fireEvent.submit(formElement);
    
    // Verify all fields are validated
    expect(mockValidateField).toHaveBeenCalledWith('name', 'Test User');
    expect(mockValidateField).toHaveBeenCalledWith('email', 'test@example.com');
    expect(mockValidateField).toHaveBeenCalledWith('phone', '123-456-7890');
    
    // Verify validateField was called exactly 3 times (once for each required field)
    expect(mockValidateField).toHaveBeenCalledTimes(3);
  });
  
  test('handles multiple input changes in sequence', () => {
    render(<ReservationForm {...defaultTestProps} formData={{...mockFormData, name: '', email: '', phone: ''}} />);
    
    // Change name
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Chien Duong' } });
    
    // Change email
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'chien@example.com' } });
    
    // Change phone
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '9876543210' } });
    
    // Verify onFormChange was called 3 times
    expect(mockOnFormChange).toHaveBeenCalledTimes(3);
    
    // Verify the last call had all updated values
    expect(mockOnFormChange).toHaveBeenLastCalledWith({
      ...mockFormData,
      name: '',
      email: '',
      phone: '987-654-3210'
    });
  });
});
