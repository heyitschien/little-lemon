import { useContext } from 'react';
import CheckoutContext, { type CheckoutContextValue } from '../context/CheckoutContext';

export const useCheckout = (): CheckoutContextValue => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};

export default useCheckout;
