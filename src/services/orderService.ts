import type { CartItem } from '../context/CartContext';
import type { CheckoutContact, CheckoutFulfillment, CheckoutPayment } from '../types/checkout';

export interface OrderPayload {
  contact: CheckoutContact;
  fulfillment: CheckoutFulfillment;
  payment: CheckoutPayment;
  items: CartItem[];
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  tipAmount: number;
}

export interface OrderResponse {
  orderId: string;
  etaMinutes: number;
  status: 'received' | 'preparing' | 'ready' | 'out_for_delivery';
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8787';

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  let message = 'Request failed';
  try {
    const data = await response.json();
    message = data?.error ?? message;
  } catch (cause) {
    if (cause instanceof Error && cause.message) {
      message = cause.message;
    }
  }
  throw new Error(message);
};

export const createPaymentIntent = async (payload: OrderPayload): Promise<{ clientSecret: string; paymentIntentId: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/payment-intents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return handleResponse(response);
};

export const submitOrder = async (payload: OrderPayload & { paymentIntentId: string }): Promise<OrderResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return handleResponse(response);
};
