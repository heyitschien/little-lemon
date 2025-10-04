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

export const createPaymentIntent = async (payload: OrderPayload): Promise<{ clientSecret: string; paymentIntentId: string }> => {
  console.debug('[orderService] createPaymentIntent', payload);
  await new Promise((resolve) => setTimeout(resolve, 400));
  const paymentIntentId = `pi_${Math.random().toString(36).slice(2)}`;
  return {
    clientSecret: `${paymentIntentId}_secret` ,
    paymentIntentId
  };
};

export const submitOrder = async (payload: OrderPayload & { paymentIntentId: string }): Promise<OrderResponse> => {
  console.debug('[orderService] submitOrder', payload);
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    orderId: `order_${Math.random().toString(36).slice(2, 10)}`,
    etaMinutes: payload.fulfillment.method === 'delivery' ? 45 : 20,
    status: 'received'
  };
};
