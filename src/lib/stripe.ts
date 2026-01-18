import 'server-only';
import Stripe from 'stripe';
import { env } from '@/lib/env';

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!env.ENABLE_BILLING) {
    throw new Error('Stripe is disabled (ENABLE_BILLING=false).');
  }
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }
  if (!stripe) {
    stripe = new Stripe(env.STRIPE_SECRET_KEY);
  }
  return stripe;
}
