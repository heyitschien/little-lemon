export type CheckoutStep = 'contact' | 'fulfillment' | 'payment' | 'review';

export const CHECKOUT_STEPS: CheckoutStep[] = ['contact', 'fulfillment', 'payment', 'review'];

export interface CheckoutContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export type FulfillmentMethod = 'pickup' | 'delivery';

export interface CheckoutAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface CheckoutFulfillment {
  method: FulfillmentMethod;
  pickupTime?: string;
  deliveryAddress?: CheckoutAddress;
  instructions?: string;
  cutlery?: boolean;
  scheduledFor?: string;
}

export interface CheckoutPayment {
  tipAmount: number;
  saveCard: boolean;
  billingSameAsContact: boolean;
  paymentMethodId?: string;
  paymentMethodBrand?: string;
  paymentLast4?: string;
  paymentIntentId?: string;
  paymentIntentClientSecret?: string;
}

export interface CheckoutConfirmation {
  orderId: string;
  etaMinutes: number;
  submittedAt: string;
}

export interface CheckoutState {
  currentStep: CheckoutStep;
  contact: CheckoutContact;
  fulfillment: CheckoutFulfillment;
  payment: CheckoutPayment;
  termsAccepted: boolean;
  isSubmitting: boolean;
  orderConfirmation?: CheckoutConfirmation;
}
