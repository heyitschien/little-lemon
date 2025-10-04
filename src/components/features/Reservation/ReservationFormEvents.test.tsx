// src/components/features/Reservation/ReservationFormEvents.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ComponentProps } from 'react';
import ReservationForm from './ReservationForm';
import type { ReservationFormData } from '../../../types/reservation';

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

const buildFormData = (overrides: Partial<ReservationFormData> = {}): ReservationFormData => ({
  name: 'Test User',
  email: 'test@example.com',
  phone: '123-456-7890',
  occasion: 'birthday',
  specialRequests: 'None',
  date: '2025-12-25',
  time: '18:00',
  partySize: 2,
  ...overrides,
});

const mockOnFormChange = vi.fn<(nextForm: ReservationFormData) => void>();
const mockValidateField = vi.fn<
  (field: keyof ReservationFormData, value: ReservationFormData[keyof ReservationFormData]) => void
>();

type ReservationFormProps = ComponentProps<typeof ReservationForm>;

const createProps = (overrides: Partial<ReservationFormProps> = {}): ReservationFormProps => ({
  onFormChange: mockOnFormChange,
  validateField: mockValidateField,
  formErrors: {},
  formData: buildFormData(),
  ...overrides,
});

describe('ReservationForm Event Handlers', () => {

  beforeEach(() => {
    // Reset mocks before each test
    mockOnFormChange.mockClear();
    mockValidateField.mockClear();
  });

  test('calls validateField on blur for all input fields', () => {
    render(<ReservationForm {...createProps()} />);
    
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
    render(<ReservationForm {...createProps()} />);

    mockValidateField.mockClear();

    const triggerTouch = (label: RegExp) => {
      const element = screen.getByLabelText(label);
      const touchEvent = new Event('touchend', { bubbles: true });
      element.dispatchEvent(touchEvent);
    };

    triggerTouch(/full name/i);
    triggerTouch(/^email$/i);
    triggerTouch(/phone number/i);
    triggerTouch(/occasion \(optional\)/i);
    triggerTouch(/special requests \(optional\)/i);

    expect(mockValidateField).toHaveBeenCalledWith('name', 'Test User');
    expect(mockValidateField).toHaveBeenCalledWith('email', 'test@example.com');
    expect(mockValidateField).toHaveBeenCalledWith('phone', '123-456-7890');
    expect(mockValidateField).toHaveBeenCalledWith('occasion', 'birthday');
    expect(mockValidateField).toHaveBeenCalledWith('specialRequests', 'None');
    expect(mockValidateField).toHaveBeenCalledTimes(5);
  });

  test('handles phone formatting correctly for different input lengths', () => {
    const formData = buildFormData({ phone: '' });
    render(<ReservationForm {...createProps({ formData })} />);

    const phoneInput = screen.getByLabelText(/phone number/i);

    fireEvent.change(phoneInput, { target: { value: '123' } });
    expect(mockOnFormChange).toHaveBeenLastCalledWith(expect.objectContaining({ phone: '123' }));

    fireEvent.change(phoneInput, { target: { value: '123456' } });
    expect(mockOnFormChange).toHaveBeenLastCalledWith(expect.objectContaining({ phone: '123-456' }));

    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    expect(mockOnFormChange).toHaveBeenLastCalledWith(expect.objectContaining({ phone: '123-456-7890' }));
  });

  test('validates all fields on form submission', () => {
    const { container } = render(<ReservationForm {...createProps()} />);
    
    // Find and submit the form
    const formElement = container.querySelector('form');
    expect(formElement).toBeInTheDocument();
    
    if (formElement) {
      fireEvent.submit(formElement);
    }
    
    // Verify all fields are validated
    expect(mockValidateField).toHaveBeenCalledWith('name', 'Test User');
    expect(mockValidateField).toHaveBeenCalledWith('email', 'test@example.com');
    expect(mockValidateField).toHaveBeenCalledWith('phone', '123-456-7890');
    
    // Verify validateField was called exactly 3 times (once for each required field)
    expect(mockValidateField).toHaveBeenCalledTimes(3);
  });
  
  test('handles multiple input changes in sequence', () => {
    const mutableFormData = buildFormData({ name: '', email: '', phone: '' });
    render(<ReservationForm {...createProps({ formData: mutableFormData })} />);

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Chien Duong' } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'chien@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '9876543210' } });

    expect(mockOnFormChange).toHaveBeenCalledTimes(3);
    expect(mockOnFormChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ phone: '987-654-3210' })
    );
  });
});
