import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

export function GET() {
  return NextResponse.json({
    googleEnabled: env.googleEnabled,
    enableBilling: env.ENABLE_BILLING,
    billingEnabled: env.ENABLE_BILLING,
    billingMode: env.BILLING_MODE,
    priceIds: {
      subscription: env.STRIPE_PRICE_ID_SUBSCRIPTION,
      starter: env.STRIPE_PRICE_ID_STARTER,
      pro: env.STRIPE_PRICE_ID_PRO,
      enterprise: env.STRIPE_PRICE_ID_ENTERPRISE
    }
  });
}
