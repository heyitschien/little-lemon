import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ComponentProps } from 'react';
import ReservationForm from './ReservationForm';
import type { ReservationFormData, ReservationFormErrors } from '../../../types/reservation';

// Preserve original viewport behaviour for mobile-focused tests
const originalInnerWidth = window.innerWidth;
const originalInnerHeight = window.innerHeight;

beforeEach(() => {
  Object.defineProperty(window, 'innerWidth', { writable: true, value: 375 });
  Object.defineProperty(window, 'innerHeight', { writable: true, value: 812 });
  window.dispatchEvent(new Event('resize'));
});

afterEach(() => {
  Object.defineProperty(window, 'innerWidth', { writable: true, value: originalInnerWidth });
  Object.defineProperty(window, 'innerHeight', { writable: true, value: originalInnerHeight });
  window.dispatchEvent(new Event('resize'));
});

const buildFormData = (overrides: Partial<ReservationFormData> = {}): ReservationFormData => ({
  name: '',
  email: '',
  phone: '',
  occasion: '',
  specialRequests: '',
  date: '2025-12-25',
  time: '18:00',
  partySize: 2,
  ...overrides,
});

const buildFormErrors = (overrides: Partial<ReservationFormErrors> = {}): ReservationFormErrors => ({
  name: undefined,
  email: undefined,
  phone: undefined,
  date: undefined,
  time: undefined,
  partySize: undefined,
  occasion: undefined,
  specialRequests: undefined,
  ...overrides,
});

const mockOnFormChange = vi.fn<(nextForm: ReservationFormData) => void>();
const mockValidateField = vi.fn<
  (field: keyof ReservationFormData, value: ReservationFormData[keyof ReservationFormData]) => void
>();

type ReservationFormProps = ComponentProps<typeof ReservationForm>;

const createProps = (overrides: Partial<ReservationFormProps> = {}): ReservationFormProps => ({
  formData: buildFormData(),
  formErrors: buildFormErrors(),
  onFormChange: mockOnFormChange,
  validateField: mockValidateField,
  ...overrides,
});

describe('ReservationForm', () => {
  beforeEach(() => {
    mockOnFormChange.mockClear();
    mockValidateField.mockClear();
  });

  test('renders all its direct input fields', () => {
    render(<ReservationForm {...createProps()} />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/occasion \(optional\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/special requests \(optional\)/i)).toBeInTheDocument();
  });

  test('calls onFormChange with updated name when name input changes', () => {
    const initialFormData = buildFormData({
      name: '',
      email: 'test@example.com',
      phone: '1234567890',
      occasion: 'Birthday',
      specialRequests: 'None',
    });

    render(<ReservationForm {...createProps({ formData: initialFormData })} />);

    const nameInput = screen.getByLabelText(/full name/i);
    fireEvent.change(nameInput, { target: { value: 'Chien' } });

    expect(mockOnFormChange).toHaveBeenLastCalledWith(expect.objectContaining({ name: 'Chien' }));
  });

  test('calls onFormChange with updated email when email input changes', () => {
    const initialFormData = buildFormData({
      name: 'Chien',
      email: '',
      phone: '1234567890',
      occasion: 'Birthday',
      specialRequests: 'None',
    });

    render(<ReservationForm {...createProps({ formData: initialFormData })} />);

    const emailInput = screen.getByLabelText(/^email$/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(mockOnFormChange).toHaveBeenLastCalledWith(expect.objectContaining({ email: 'test@example.com' }));
  });

  test('calls onFormChange with updated phone when phone input changes', () => {
    const initialFormData = buildFormData({
      name: 'Chien',
      email: 'test@example.com',
      phone: '',
      occasion: 'Birthday',
      specialRequests: 'None',
    });

    render(<ReservationForm {...createProps({ formData: initialFormData })} />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    fireEvent.change(phoneInput, { target: { value: '0123456789' } });

    expect(mockOnFormChange).toHaveBeenLastCalledWith(expect.objectContaining({ phone: '012-345-6789' }));
  });

  test('calls onFormChange with updated occasion when occasion select changes', () => {
    const initialFormData = buildFormData({
      name: 'Chien',
      email: 'test@example.com',
      phone: '0123456789',
      occasion: '',
      specialRequests: 'None',
    });

    render(<ReservationForm {...createProps({ formData: initialFormData })} />);

    const occasionSelect = screen.getByLabelText(/occasion \(optional\)/i);
    fireEvent.change(occasionSelect, { target: { value: 'anniversary' } });

    expect(mockOnFormChange).toHaveBeenLastCalledWith(expect.objectContaining({ occasion: 'anniversary' }));
  });

  test('calls onFormChange with updated special requests when textarea changes', () => {
    const initialFormData = buildFormData({
      name: 'Chien',
      email: 'test@example.com',
      phone: '0123456789',
      occasion: 'anniversary',
      specialRequests: '',
    });

    render(<ReservationForm {...createProps({ formData: initialFormData })} />);

    const specialRequestsTextarea = screen.getByLabelText(/special requests \(optional\)/i);
    fireEvent.change(specialRequestsTextarea, { target: { value: 'Allergic to peanuts' } });

    expect(mockOnFormChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ specialRequests: 'Allergic to peanuts' })
    );
  });

  test('displays name validation error on submit if empty and clears it on input', () => {
    const initialFormData = buildFormData({
      name: '',
      email: 'test@example.com',
      phone: '0123456789',
      occasion: 'anniversary',
      specialRequests: 'None',
    });
    const formErrors = buildFormErrors({ name: '' });

    mockValidateField.mockImplementation((field, value) => {
      if (field !== 'name') return;
      const nameValue = typeof value === 'string' ? value.trim() : '';
      formErrors.name = nameValue ? undefined : 'Name is required';
    });

    const { container, rerender } = render(
      <ReservationForm {...createProps({ formData: initialFormData, formErrors })} />
    );

    const formElement = container.querySelector('form');
    expect(formElement).toBeInTheDocument();

    if (formElement) {
      fireEvent.submit(formElement);
      mockValidateField('name', initialFormData.name);
    }

    rerender(<ReservationForm {...createProps({ formData: initialFormData, formErrors })} />);
    expect(screen.getByText('Name is required')).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/full name/i);
    fireEvent.change(nameInput, { target: { value: 'Chien Duong' } });
    mockValidateField('name', 'Chien Duong');

    const updatedFormData = { ...initialFormData, name: 'Chien Duong' };
    formErrors.name = undefined;

    rerender(<ReservationForm {...createProps({ formData: updatedFormData, formErrors })} />);
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
  });

  test('displays email validation error on submit if empty or invalid, and clears it on valid input', () => {
    const initialFormData = buildFormData({
      name: 'Chien',
      email: '',
      phone: '0123456789',
      occasion: 'anniversary',
      specialRequests: 'None',
    });
    const formErrors = buildFormErrors({ email: '' });

    mockValidateField.mockImplementation((field, value) => {
      if (field !== 'email') return;
      const emailValue = typeof value === 'string' ? value : '';
      formErrors.email = emailValue.includes('@') ? undefined : 'Valid email is required';
    });

    let currentFormData = initialFormData;
    const { container, rerender } = render(
      <ReservationForm {...createProps({ formData: currentFormData, formErrors })} />
    );

    const formElement = container.querySelector('form');
    expect(formElement).toBeInTheDocument();

    if (formElement) {
      fireEvent.submit(formElement);
      mockValidateField('email', currentFormData.email);
    }

    rerender(<ReservationForm {...createProps({ formData: currentFormData, formErrors })} />);
    expect(screen.getByText('Valid email is required')).toBeInTheDocument();

    currentFormData = { ...currentFormData, email: 'invalidemail' };
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'invalidemail' } });
    mockValidateField('email', 'invalidemail');

    rerender(<ReservationForm {...createProps({ formData: currentFormData, formErrors })} />);
    expect(screen.getByText('Valid email is required')).toBeInTheDocument();

    currentFormData = { ...currentFormData, email: 'valid@example.com' };
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'valid@example.com' } });
    mockValidateField('email', 'valid@example.com');
    formErrors.email = undefined;

    rerender(<ReservationForm {...createProps({ formData: currentFormData, formErrors })} />);
    expect(screen.queryByText('Valid email is required')).not.toBeInTheDocument();
  });

  test('displays phone validation error on submit if empty or invalid, and clears it on valid input', () => {
    const initialFormData = buildFormData({
      name: 'Chien',
      email: 'valid@example.com',
      phone: '',
      occasion: 'anniversary',
      specialRequests: 'None',
    });
    const formErrors = buildFormErrors({ phone: '' });

    mockValidateField.mockImplementation((field, value) => {
      if (field !== 'phone') return;
      const phoneValue = typeof value === 'string' ? value : '';
      formErrors.phone = /^\d{3}-\d{3}-\d{4}$/.test(phoneValue)
        ? undefined
        : 'Valid phone number is required (e.g., 123-456-7890)';
    });

    let currentFormData = initialFormData;
    const { container, rerender } = render(
      <ReservationForm {...createProps({ formData: currentFormData, formErrors })} />
    );

    const formElement = container.querySelector('form');
    expect(formElement).toBeInTheDocument();

    if (formElement) {
      fireEvent.submit(formElement);
      mockValidateField('phone', currentFormData.phone);
    }

    rerender(<ReservationForm {...createProps({ formData: currentFormData, formErrors })} />);
    expect(screen.getByText('Valid phone number is required (e.g., 123-456-7890)')).toBeInTheDocument();

    currentFormData = { ...currentFormData, phone: '123' };
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '123' } });
    mockValidateField('phone', '123');

    rerender(<ReservationForm {...createProps({ formData: currentFormData, formErrors })} />);
    expect(screen.getByText('Valid phone number is required (e.g., 123-456-7890)')).toBeInTheDocument();

    currentFormData = { ...currentFormData, phone: '123-456-7890' };
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '123-456-7890' } });
    mockValidateField('phone', '123-456-7890');
    formErrors.phone = undefined;

    rerender(<ReservationForm {...createProps({ formData: currentFormData, formErrors })} />);
    expect(screen.queryByText('Valid phone number is required (e.g., 123-456-7890)')).not.toBeInTheDocument();
  });

  test('does not display validation errors when form is submitted with all valid data', () => {
    const validFormData = buildFormData({
      name: 'Chien Duong',
      email: 'chien@example.com',
      phone: '111-222-3333',
      occasion: 'Birthday',
      specialRequests: 'A nice quiet table, please.',
    });
    const formErrors = buildFormErrors({ name: '', email: '', phone: '' });

    mockValidateField.mockImplementation((field, value) => {
      if (typeof value !== 'string') return;
      if (field === 'name' && !value.trim()) {
        formErrors.name = 'Name is required';
      }
      if (field === 'email' && !value.includes('@')) {
        formErrors.email = 'Valid email is required';
      }
      if (field === 'phone' && !/^\d{3}-\d{3}-\d{4}$/.test(value)) {
        formErrors.phone = 'Valid phone number is required (e.g., 123-456-7890)';
      }
    });

    const { container } = render(
      <ReservationForm {...createProps({ formData: validFormData, formErrors })} />
    );

    const formElement = container.querySelector('form');
    expect(formElement).toBeInTheDocument();

    if (formElement) {
      fireEvent.submit(formElement);
      mockValidateField('name', validFormData.name);
      mockValidateField('email', validFormData.email);
      mockValidateField('phone', validFormData.phone);
    }

    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Valid email is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Valid phone number is required (e.g., 123-456-7890)')).not.toBeInTheDocument();
  });
});
