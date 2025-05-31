# Testing Custom React Hooks

## Overview

This guide provides best practices and examples for testing custom React hooks in the Little Lemon application, with a focus on hooks that support mobile functionality.

## Testing Library Setup

We use React Testing Library and Jest for testing custom hooks:

```javascript
import { renderHook, act } from '@testing-library/react-hooks';
import useCustomHook from './useCustomHook';
```

## Basic Hook Testing Pattern

```javascript
describe('useCustomHook', () => {
  it('should return the initial state', () => {
    const { result } = renderHook(() => useCustomHook());
    
    expect(result.current.value).toBe(initialValue);
  });
  
  it('should update the state when action is called', () => {
    const { result } = renderHook(() => useCustomHook());
    
    act(() => {
      result.current.updateValue('new value');
    });
    
    expect(result.current.value).toBe('new value');
  });
});
```

## Testing Hooks with Context

For hooks that depend on context:

```javascript
const wrapper = ({ children }) => (
  <ContextProvider>{children}</ContextProvider>
);

const { result } = renderHook(() => useCustomHook(), { wrapper });
```

## Testing Hooks with Parameters

```javascript
const { result } = renderHook(
  (props) => useCustomHook(props.initialValue), 
  { initialProps: { initialValue: 'initial' } }
);

// Update props
rerender({ initialValue: 'updated' });
```

## Testing Mobile-Specific Hooks

### Testing Viewport Hooks

```javascript
// Mock window.innerWidth
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 375, // Mobile viewport width
});

// Test the hook
const { result } = renderHook(() => useResponsive());
expect(result.current.isMobile).toBe(true);

// Test different viewport
act(() => {
  window.innerWidth = 1024;
  window.dispatchEvent(new Event('resize'));
});
expect(result.current.isMobile).toBe(false);
```

### Testing Touch Interaction Hooks

```javascript
const { result } = renderHook(() => useTouchGesture());

// Simulate touch events
act(() => {
  const touchStartEvent = new TouchEvent('touchstart', {
    touches: [{ clientX: 0, clientY: 0 }],
  });
  window.dispatchEvent(touchStartEvent);
});

act(() => {
  const touchMoveEvent = new TouchEvent('touchmove', {
    touches: [{ clientX: 50, clientY: 0 }],
  });
  window.dispatchEvent(touchMoveEvent);
});

act(() => {
  window.dispatchEvent(new TouchEvent('touchend'));
});

expect(result.current.swipeDirection).toBe('right');
```

## Common Mobile Hooks to Test

1. **useMediaQuery** - For responsive design
2. **useOrientation** - For detecting device orientation
3. **useTouchGesture** - For handling touch gestures
4. **useOnlineStatus** - For detecting network connectivity
5. **useScrollPosition** - For tracking scroll position

## Testing Async Hooks

```javascript
it('should handle async operations', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useAsyncHook());
  
  // Initial state
  expect(result.current.loading).toBe(true);
  
  // Wait for the async operation to complete
  await waitForNextUpdate();
  
  // Check the updated state
  expect(result.current.loading).toBe(false);
  expect(result.current.data).toEqual(expectedData);
});
```

## Testing Error Handling

```javascript
it('should handle errors', async () => {
  // Mock API to throw an error
  jest.spyOn(api, 'fetchData').mockRejectedValue(new Error('API Error'));
  
  const { result, waitForNextUpdate } = renderHook(() => useDataFetching());
  
  // Wait for the hook to handle the error
  await waitForNextUpdate();
  
  expect(result.current.error).toBe('API Error');
  expect(result.current.loading).toBe(false);
});
```

## Best Practices

1. **Test the public API** - Focus on testing the return values and behavior, not implementation details
2. **Use act() for state updates** - Wrap all state updates in act() to ensure proper test rendering
3. **Test edge cases** - Test error states, loading states, and boundary conditions
4. **Mock external dependencies** - Use jest.mock() to mock API calls and browser APIs
5. **Test mobile-specific behavior** - Ensure hooks work correctly on mobile devices

## Example: Testing a Form Hook

```javascript
describe('useForm', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useForm({
      name: '',
      email: '',
      phone: '',
    }));
    
    expect(result.current.values).toEqual({
      name: '',
      email: '',
      phone: '',
    });
    expect(result.current.errors).toEqual({});
  });
  
  it('should update a field value', () => {
    const { result } = renderHook(() => useForm({
      name: '',
      email: '',
      phone: '',
    }));
    
    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@example.com' },
      });
    });
    
    expect(result.current.values.email).toBe('test@example.com');
  });
  
  it('should validate fields on submit', () => {
    const { result } = renderHook(() => useForm({
      name: '',
      email: 'invalid-email',
      phone: '',
    }));
    
    act(() => {
      result.current.handleSubmit({ preventDefault: jest.fn() });
    });
    
    expect(result.current.errors.email).toBeTruthy();
    expect(result.current.isValid).toBe(false);
  });
});
```

---

Last updated: 2025-05-30
