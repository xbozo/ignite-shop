import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Chave secreta do Stripe não configurada');
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2022-11-15',
  appInfo: {
    name: 'Ignite Shop'
  },
});
