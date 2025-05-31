# Little Lemon Reservation System Testing Guide

## Overview
This guide outlines the testing strategy for the Little Lemon restaurant reservation system. The system consists of three main layers:
- UI Components (ReservationPage, ReservationForm, DateTimeSelector)
- Business Logic (useReservation hook)
- Data Layer (reservationService with localStorage)

## Project Structure
```
src/
  ├── components/Reservation/
  │   ├── DateTimeSelector.jsx
  │   ├── ReservationForm.jsx
  │   └── ReservationConfirmation.jsx
  ├── pages/
  │   └── ReservationPage.jsx
  ├── hooks/
  │   └── useReservation.js
  ├── services/
  │   └── reservationService.js
  └── tests/
      ├── components/
      ├── hooks/
      └── services/
```

## Testing Setup

### 1. Test Environment Setup
```javascript
// jest.setup.js
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Reset mocks before each test
beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});
```

### 2. Common Test Utilities
```javascript
// test-utils.js
export const mockReservationData = {
  date: '2025-06-01',
  time: '19:00',
  partySize: 4,
  name: 'John Doe',
  email: 'john@example.com',
  phone: '1234567890'
};

export const fillDateTimeForm = async (user) => {
  await user.type(screen.getByLabelText(/date/i), mockReservationData.date);
  await user.selectOptions(screen.getByLabelText(/time/i), mockReservationData.time);
  await user.type(screen.getByLabelText(/party size/i), String(mockReservationData.partySize));
};
```

2. **User-Centric Testing**
   - Test user flows, not implementation
   - Mirror actual user interactions
   - Focus on user-visible behavior

3. **Comprehensive Validation**
   - Test all form validations
   - Cover error states
   - Test boundary conditions

## Component Test Structure

### 1. ReservationPage Tests
```javascript
// File: src/pages/ReservationPage/ReservationPage.test.jsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReservationPage from './ReservationPage';

describe('ReservationPage', () => {
  // Step Navigation
  test('shows correct initial step');
  test('navigates through steps with valid data');
  test('prevents navigation with invalid data');

  // Error Handling
  test('displays error messages appropriately');
  test('handles API errors gracefully');

  // State Management
  test('maintains form state between steps');
  test('resets form on successful submission');
});
```

### 2. ReservationForm Tests
```javascript
// File: src/components/Reservation/ReservationForm.test.jsx

describe('ReservationForm', () => {
  // Required Fields
  test('validates required name field');
  test('validates required email field');
  test('validates required phone field');

  // Input Validation
  test('validates email format');
  test('validates phone number format');
  test('trims whitespace from inputs');

  // Form Submission
  test('calls onSubmit with valid data');
  test('prevents submission with invalid data');

  // Error Display
  test('shows field-specific error messages');
  test('clears errors on valid input');
});
```

### 3. DateTimeSelector Tests
```javascript
// File: src/components/Reservation/DateTimeSelector.test.jsx

describe('DateTimeSelector', () => {
  // Date Selection
  test('prevents selecting past dates');
  test('allows selecting future dates');

  // Time Slots
  test('shows available time slots');
  test('disables booked time slots');
  test('updates slots based on party size');

  // Party Size
  test('validates minimum party size');
  test('validates maximum party size');
});
```

## Integration Tests
```javascript
// File: src/tests/integration/ReservationFlow.test.jsx

describe('Reservation Flow', () => {
  test('completes full reservation successfully', async () => {
    // Setup
    render(<ReservationPage />);

    // Step 1: Date & Time
    await selectDate('2025-06-01');
    await selectTime('19:00');
    await setPartySize(4);
    await clickNext();

    // Step 2: Personal Info
    await fillPersonalInfo({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '(123) 456-7890'
    });
    await clickNext();

    // Step 3: Confirmation
    await confirmReservation();

    // Verify Success
    expect(screen.getByText(/reservation confirmed/i)).toBeInTheDocument();
  });
});
```

## Common Test Scenarios

### 1. Form Validation
```javascript
// Test invalid inputs
test('validates email format', async () => {
  const emailInput = screen.getByLabelText(/email/i);
  await userEvent.type(emailInput, 'invalid-email');
  expect(screen.getByText('Valid email is required')).toBeInTheDocument();
});
### 2. Custom Hook Tests (useReservation.test.js)
```javascript
import { renderHook, act } from '@testing-library/react-hooks';
import { useReservation } from '../hooks/useReservation';

describe('useReservation', () => {
  test('initializes with empty form data', () => {
    const { result } = renderHook(() => useReservation());
    expect(result.current.reservationData).toEqual({
      date: '',
      time: '',
      partySize: '',
      name: '',
      email: '',
      phone: '',
      occasion: '',
      specialRequests: ''
    });
  });

  test('handles step navigation', () => {
    const { result } = renderHook(() => useReservation());

    // Can't proceed without data
    expect(result.current.canProceedToNextStep()).toBe(false);

    // Fill step 1 data
    act(() => {
      result.current.handleDateTimeChange('date', '2025-06-01');
      result.current.handleDateTimeChange('time', '19:00');
      result.current.handleDateTimeChange('partySize', '4');
    });

    expect(result.current.canProceedToNextStep()).toBe(true);

    // Move to next step
    act(() => {
      result.current.handleNextStep();
    });

    expect(result.current.currentStep).toBe(2);
  });

  test('handles form submission', async () => {
    const { result } = renderHook(() => useReservation());

    // Fill all required data
    act(() => {
      result.current.handleFormChange(mockReservationData);
    });

    // Submit reservation
    await act(async () => {
      await result.current.handleConfirmReservation();
    });

    expect(result.current.confirmedReservation).toBeTruthy();
    expect(result.current.currentStep).toBe(4);
  });
});
```
### 3. Component Tests

#### DateTimeSelector Tests (DateTimeSelector.test.jsx)
```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateTimeSelector from '../components/Reservation/DateTimeSelector';

describe('DateTimeSelector', () => {
  const mockProps = {
    selectedDate: '',
    selectedTime: '',
    partySize: '',
    onDateChange: jest.fn(),
    onTimeChange: jest.fn(),
    onPartySizeChange: jest.fn()
  };

  test('prevents selecting past dates', async () => {
    render(<DateTimeSelector {...mockProps} />);
    const dateInput = screen.getByLabelText(/date/i);
    const pastDate = '2020-01-01';
    
    await userEvent.type(dateInput, pastDate);
    expect(dateInput).not.toHaveValue(pastDate);
  });

  test('shows available time slots', async () => {
    render(<DateTimeSelector {...mockProps} />);
    await userEvent.type(screen.getByLabelText(/date/i), '2025-06-01');
    
    const timeSelect = screen.getByLabelText(/time/i);
    const options = screen.getAllByRole('option');
    expect(options.length).toBeGreaterThan(1);
    expect(options[1]).toHaveTextContent(/5:00 PM/i);
  });
});
```

#### ReservationForm Tests (ReservationForm.test.jsx)
```javascript
describe('ReservationForm', () => {
  test('validates required fields', async () => {
    render(<ReservationForm formData={{}} onFormChange={jest.fn()} />);
    
    // Try to submit empty form
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Valid email is required')).toBeInTheDocument();
    expect(screen.getByText('Valid phone number is required')).toBeInTheDocument();
  });

  test('handles input changes', async () => {
    const handleChange = jest.fn();
    render(<ReservationForm formData={{}} onFormChange={handleChange} />);
    
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    
    expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({
      name: 'John Doe'
    }));
  });
});
```
### 4. Integration Tests (ReservationFlow.test.jsx)
```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReservationPage from '../pages/ReservationPage';

describe('Reservation Flow', () => {
  test('completes full reservation process', async () => {
    render(<ReservationPage />);
    const user = userEvent.setup();

    // Step 1: Date & Time
    await fillDateTimeForm(user);
    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText(/your information/i)).toBeInTheDocument();

    // Step 2: Personal Information
    await user.type(screen.getByLabelText(/name/i), mockReservationData.name);
    await user.type(screen.getByLabelText(/email/i), mockReservationData.email);
    await user.type(screen.getByLabelText(/phone/i), mockReservationData.phone);
    await user.click(screen.getByRole('button', { name: /next/i }));

    // Step 3: Confirmation
    expect(screen.getByText(/review & confirm/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /confirm/i }));

    // Success
    expect(screen.getByText(/reservation confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(mockReservationData.email)).toBeInTheDocument();
  });

  test('handles validation errors', async () => {
    render(<ReservationPage />);
    const user = userEvent.setup();

    // Try to proceed without data
    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText(/please fill in all required fields/i)).toBeInTheDocument();
  });

  test('handles reservation conflicts', async () => {
    // Create existing reservation
    createReservation(mockReservationData);
    
    render(<ReservationPage />);
    const user = userEvent.setup();

    // Try to book same slot
    await fillDateTimeForm(user);
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });
});
```

## Mobile-Specific Tests

### Date Input Tests
```javascript
describe('DateTimeSelector Mobile', () => {
  beforeEach(() => {
    // Mock mobile viewport
    global.innerWidth = 375;
    global.dispatchEvent(new Event('resize'));
  });

  test('uses native date picker on mobile', async () => {
    render(<DateTimeSelector {...mockProps} />);
    const dateInput = screen.getByLabelText(/date/i);
    
    // Verify it's using the native date input
    expect(dateInput).toHaveAttribute('type', 'date');
    expect(dateInput).not.toBeVisible(); // Should be hidden
    
    // Verify the styled label is visible
    expect(screen.getByTestId('date-label')).toBeVisible();
  });
});
```
```

## Best Practices & Guidelines

### 1. Test Organization
- Group tests by feature/component
- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)
- Keep tests focused and atomic

### 2. Testing Priorities
1. **Critical Paths**
   - Complete reservation flow
   - Time slot availability
   - Form validation
   - Error handling

2. **Edge Cases**
   - Past dates
   - Full time slots
   - Invalid inputs
   - Mobile responsiveness

3. **User Interactions**
   - Keyboard navigation
   - Screen reader compatibility
   - Touch events on mobile

### 3. Code Coverage Goals
- Overall: >80%
- Critical paths: 100%
- UI Components: >75%
- Services: >90%
- Custom hooks: >85%

### 4. Test Performance
- Mock heavy operations
- Use setup/teardown efficiently
- Avoid unnecessary renders
- Clean up after each test

## Running Tests

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Test specific component
npm test ReservationForm

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

## Debugging Tips

### 1. Component Testing
```javascript
// Use screen.debug() to see rendered output
screen.debug();

// Log state changes
console.log('Current form data:', result.current.reservationData);

// Check accessibility
const { container } = render(<ReservationForm />);
expect(container).toBeAccessible();
```

### 2. Service Testing
```javascript
// Log localStorage operations
console.log('Storage after operation:', localStorage.getItem('littleLemonReservations'));

// Debug time slot calculations
console.log('Available slots:', getAvailableTimeSlots('2025-06-01'));
```

### 3. Common Issues
1. **Async Testing**
   - Always use `await` with user events
   - Wrap state updates in `act()`
   - Handle promises properly

2. **State Updates**
   - Check state after all updates complete
   - Verify component re-renders
   - Test state persistence

3. **Mobile Testing**
   - Test touch events
   - Verify date picker behavior
   - Check responsive layouts

## Continuous Integration

### GitHub Actions Workflow
```yaml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
      - run: npm test -- --coverage
```
