import * as yup from 'yup';
import type { CheckoutContact, CheckoutFulfillment, CheckoutPayment } from '../../types/checkout';

export const contactSchema = yup
  .object<CheckoutContact>({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    phone: yup
      .string()
      .required('Phone number is required')
      .matches(/^[0-9\-+()\s]{7,}$/, 'Enter a valid phone number')
  })
  .required();

export const fulfillmentSchema = yup
  .object<CheckoutFulfillment>({
    method: yup.mixed<'pickup' | 'delivery'>().oneOf(['pickup', 'delivery']).required(),
    pickupTime: yup.string().when('method', {
      is: 'pickup',
      then: (schema) => schema.required('Select a pickup time'),
      otherwise: (schema) => schema.optional()
    }),
    scheduledFor: yup.string().optional(),
    instructions: yup.string().max(240, 'Instructions must be 240 characters or fewer').optional(),
    cutlery: yup.boolean().optional(),
    deliveryAddress: yup.object({
      line1: yup.string().required('Address line is required'),
      line2: yup.string().optional(),
      city: yup.string().required('City is required'),
      state: yup.string().required('State is required'),
      postalCode: yup.string().required('Postal code is required')
    }).when('method', {
      is: 'delivery',
      then: (schema) => schema.required('Delivery address is required'),
      otherwise: (schema) => schema.optional()
    })
  })
  .required();

export const paymentSchema = yup
  .object<CheckoutPayment>({
    tipAmount: yup.number().min(0).max(200, 'Tip must be reasonable').required(),
    saveCard: yup.boolean().required(),
    billingSameAsContact: yup.boolean().required(),
    paymentMethodId: yup.string().optional(),
    paymentMethodBrand: yup.string().optional(),
    paymentLast4: yup.string().optional()
  })
  .required();

export const reviewSchema = yup
  .object({
    termsAccepted: yup.boolean().oneOf([true], 'You must accept terms to continue')
  })
  .required();
