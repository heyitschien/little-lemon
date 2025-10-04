import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('Missing STRIPE_SECRET_KEY environment variable.');
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20'
});

const app = express();
const port = Number(process.env.PORT ?? 8787);
const clientOrigin = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';

app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json());

const toCents = (value) => Math.round(Number(value || 0) * 100);

const calculateOrderAmount = ({ subtotal = 0, serviceFee = 0, deliveryFee = 0, tipAmount = 0 }) => {
  return toCents(subtotal) + toCents(serviceFee) + toCents(deliveryFee) + toCents(tipAmount);
};

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/payment-intents', async (req, res) => {
  try {
    const { subtotal, serviceFee, deliveryFee, tipAmount, contact } = req.body ?? {};

    if (typeof subtotal !== 'number') {
      return res.status(400).json({ error: 'Invalid payload: subtotal is required.' });
    }

    const amount = calculateOrderAmount({ subtotal, serviceFee, deliveryFee, tipAmount });

    if (amount <= 0) {
      return res.status(400).json({ error: 'Payment amount must be greater than zero.' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true
      },
      metadata: {
        customer_email: contact?.email ?? '',
        customer_phone: contact?.phone ?? ''
      }
    });

    res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (error) {
    console.error('Failed to create payment intent', error);
    res.status(500).json({ error: 'Unable to create payment intent' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { paymentIntentId, fulfillment } = req.body ?? {};

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'PaymentIntent ID is required.' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment has not been completed.' });
    }

    const orderId = `order_${Math.random().toString(36).slice(2, 10)}`;
    const etaMinutes = fulfillment?.method === 'delivery' ? 45 : 20;

    res.json({ orderId, etaMinutes, status: 'received' });
  } catch (error) {
    console.error('Failed to submit order', error);
    res.status(500).json({ error: 'Unable to submit order' });
  }
});

app.listen(port, () => {
  console.log(`Stripe API server listening on http://localhost:${port}`);
  console.log(`Allowing requests from ${clientOrigin}`);
});
