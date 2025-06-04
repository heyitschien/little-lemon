// src/setupTests.js
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Define global mocks for API functions
// These will be spied on and further customized in individual test files
global.fetchAPI = vi.fn();
global.submitAPI = vi.fn();

// Mock MOCK_TODAY for consistent date testing
// Constants file is at src/hooks/utils/constants.js
vi.mock('./hooks/utils/constants', () => ({
  MOCK_TODAY: new Date('2025-07-15T12:00:00.000Z'), // A fixed date for testing
}));
