import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { getStripe } from '@/lib/stripe';

interface PricingData {
  tier: string;
  priceId: string;
  amount: number;
  currency: string;
  interval?: string;
}

export async function GET() {
  try {
    if (!env.ENABLE_BILLING) {
      return NextResponse.json({ 
        billingEnabled: false,
        prices: []
      });
    }

    const stripe = getStripe();
    const prices: PricingData[] = [];

    if (env.BILLING_MODE === 'subscription') {
      // For subscription mode, fetch the subscription price
      if (env.STRIPE_PRICE_ID_SUBSCRIPTION) {
        try {
          const priceData = await stripe.prices.retrieve(env.STRIPE_PRICE_ID_SUBSCRIPTION, {
            expand: ['product']
          });
          
          prices.push({
            tier: 'PRO',
            priceId: env.STRIPE_PRICE_ID_SUBSCRIPTION,
            amount: priceData.unit_amount || 0,
            currency: priceData.currency,
            interval: priceData.recurring?.interval
          });
        } catch (error) {
          console.error('Error fetching subscription price:', error);
        }
      }
    } else {
      // For payment mode, fetch all one-time payment prices
      const priceIds = [
        { id: env.STRIPE_PRICE_ID_STARTER, tier: 'STARTER' },
        { id: env.STRIPE_PRICE_ID_PRO, tier: 'PRO' },
        { id: env.STRIPE_PRICE_ID_ENTERPRISE, tier: 'ENTERPRISE' }
      ].filter(price => price.id); // Only include configured prices

      for (const { id, tier } of priceIds) {
        try {
          const priceData = await stripe.prices.retrieve(id, {
            expand: ['product']
          });
          
          prices.push({
            tier,
            priceId: id,
            amount: priceData.unit_amount || 0,
            currency: priceData.currency
          });
        } catch (error) {
          console.error(`Error fetching price for ${tier}:`, error);
        }
      }
    }

    return NextResponse.json({
      billingEnabled: env.ENABLE_BILLING,
      billingMode: env.BILLING_MODE,
      prices
    });

  } catch (error) {
    console.error('Error fetching pricing data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing data' }, 
      { status: 500 }
    );
  }
}