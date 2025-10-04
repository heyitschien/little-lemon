import type { CartItem } from '../../context/CartContext';
import type { CheckoutContact, CheckoutFulfillment, CheckoutPayment } from '../../types/checkout';
import type { OrderPayload } from '../../services/orderService';

export interface BuildOrderPayloadParams {
  contact: CheckoutContact;
  fulfillment: CheckoutFulfillment;
  payment: CheckoutPayment;
  items: CartItem[];
  subtotal: number;
}

export const SERVICE_FEE = 1;
export const DELIVERY_FEE = 2;

export const buildOrderPayload = ({
  contact,
  fulfillment,
  payment,
  items,
  subtotal
}: BuildOrderPayloadParams): OrderPayload => {
  const deliveryFee = fulfillment.method === 'delivery' ? DELIVERY_FEE : 0;

  return {
    contact,
    fulfillment,
    payment,
    items,
    subtotal,
    serviceFee: SERVICE_FEE,
    deliveryFee,
    tipAmount: payment.tipAmount
  };
};

export default buildOrderPayload;
