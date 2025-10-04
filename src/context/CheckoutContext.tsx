import { createContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
import type { CheckoutContact, CheckoutFulfillment, CheckoutPayment, CheckoutState, CheckoutStep } from '../types/checkout';
import { CHECKOUT_STEPS } from '../types/checkout';
import type { ValidationErrorMap } from '../utils/validation/mapYupErrors';

const STORAGE_KEY = 'littleLemonCheckoutDraft';

type CheckoutAction =
  | { type: 'setStep'; payload: CheckoutStep }
  | { type: 'updateContact'; payload: CheckoutContact }
  | { type: 'updateFulfillment'; payload: CheckoutFulfillment }
  | { type: 'updatePayment'; payload: CheckoutPayment }
  | { type: 'setTermsAccepted'; payload: boolean }
  | { type: 'setSubmitting'; payload: boolean }
  | { type: 'setConfirmation'; payload: CheckoutState['orderConfirmation'] }
  | { type: 'reset' };

const defaultState: CheckoutState = {
  currentStep: 'contact',
  contact: {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  },
  fulfillment: {
    method: 'pickup',
    pickupTime: '',
    deliveryAddress: undefined,
    instructions: '',
    cutlery: false,
    scheduledFor: ''
  },
  payment: {
    tipAmount: 0,
    saveCard: false,
    billingSameAsContact: true,
    paymentMethodId: undefined,
    paymentMethodBrand: undefined,
    paymentLast4: undefined
  },
  termsAccepted: false,
  isSubmitting: false,
  orderConfirmation: undefined
};

const loadStoredState = (): CheckoutState | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return undefined;
    }
    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') {
      return undefined;
    }
    return {
      ...defaultState,
      ...parsed,
      currentStep: CHECKOUT_STEPS.includes(parsed.currentStep) ? parsed.currentStep : 'contact'
    } satisfies CheckoutState;
  } catch (error) {
    console.error('Failed to load checkout draft from storage', error);
    return undefined;
  }
};

const checkoutReducer = (state: CheckoutState, action: CheckoutAction): CheckoutState => {
  switch (action.type) {
    case 'setStep':
      return {
        ...state,
        currentStep: action.payload
      };
    case 'updateContact':
      return {
        ...state,
        contact: action.payload
      };
    case 'updateFulfillment':
      return {
        ...state,
        fulfillment: action.payload
      };
    case 'updatePayment':
      return {
        ...state,
        payment: action.payload
      };
    case 'setTermsAccepted':
      return {
        ...state,
        termsAccepted: action.payload
      };
    case 'setSubmitting':
      return {
        ...state,
        isSubmitting: action.payload
      };
    case 'setConfirmation':
      return {
        ...state,
        orderConfirmation: action.payload
      };
    case 'reset':
      return defaultState;
    default:
      return state;
  }
};

export interface CheckoutContextValue {
  state: CheckoutState;
  getStepIndex: (step: CheckoutStep) => number;
  getNextStep: (current: CheckoutStep) => CheckoutStep | null;
  getPreviousStep: (current: CheckoutStep) => CheckoutStep | null;
  setStep: (step: CheckoutStep) => void;
  updateContact: (contact: CheckoutContact) => void;
  updateFulfillment: (fulfillment: CheckoutFulfillment) => void;
  updatePayment: (payment: CheckoutPayment) => void;
  setTermsAccepted: (accepted: boolean) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setConfirmation: (confirmation: CheckoutState['orderConfirmation']) => void;
  resetCheckout: () => void;
  fieldErrors: ValidationErrorMap;
  setFieldErrors: (errors: ValidationErrorMap) => void;
  clearFieldErrors: () => void;
  registerStepProcessor: (step: CheckoutStep, handler: () => Promise<void> | void) => () => void;
  runStepProcessor: (step: CheckoutStep) => Promise<void>;
}

const CheckoutContext = createContext<CheckoutContextValue | undefined>(undefined);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const storedState = loadStoredState();
  const [state, dispatch] = useReducer(checkoutReducer, storedState ?? defaultState);
  const [fieldErrors, setFieldErrorsState] = useState<ValidationErrorMap>({});
  const stepProcessorsRef = useRef<Partial<Record<CheckoutStep, () => Promise<void> | void>>>({});

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to persist checkout draft', error);
    }
  }, [state]);

  const contextValue: CheckoutContextValue = useMemo(
    () => ({
      state,
      getStepIndex: (step) => CHECKOUT_STEPS.indexOf(step),
      getNextStep: (current) => {
        const index = CHECKOUT_STEPS.indexOf(current);
        if (index < 0 || index + 1 >= CHECKOUT_STEPS.length) {
          return null;
        }
        return CHECKOUT_STEPS[index + 1];
      },
      getPreviousStep: (current) => {
        const index = CHECKOUT_STEPS.indexOf(current);
        if (index <= 0) {
          return null;
        }
        return CHECKOUT_STEPS[index - 1];
      },
      setStep: (step) => dispatch({ type: 'setStep', payload: step }),
      updateContact: (contact) => dispatch({ type: 'updateContact', payload: contact }),
      updateFulfillment: (fulfillment) => dispatch({ type: 'updateFulfillment', payload: fulfillment }),
      updatePayment: (payment) => dispatch({ type: 'updatePayment', payload: payment }),
      setTermsAccepted: (accepted) => dispatch({ type: 'setTermsAccepted', payload: accepted }),
      setSubmitting: (isSubmitting) => dispatch({ type: 'setSubmitting', payload: isSubmitting }),
      setConfirmation: (confirmation) => dispatch({ type: 'setConfirmation', payload: confirmation }),
      resetCheckout: () => dispatch({ type: 'reset' }),
      fieldErrors,
      setFieldErrors: (errors) => setFieldErrorsState(errors),
      clearFieldErrors: () => setFieldErrorsState({}),
      registerStepProcessor: (step, handler) => {
        stepProcessorsRef.current[step] = handler;
        return () => {
          if (stepProcessorsRef.current[step] === handler) {
            delete stepProcessorsRef.current[step];
          }
        };
      },
      runStepProcessor: async (step) => {
        const handler = stepProcessorsRef.current[step];
        if (handler) {
          await handler();
        }
      }
    }),
    [fieldErrors, state]
  );

  return <CheckoutContext.Provider value={contextValue}>{children}</CheckoutContext.Provider>;
};

export default CheckoutContext;
