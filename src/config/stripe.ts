import { loadStripe, type Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? 'pk_test_51PlaceholderKeyForDevOnly';
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export default getStripe;
