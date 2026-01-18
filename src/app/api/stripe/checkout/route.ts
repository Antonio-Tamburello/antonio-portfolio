import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { env } from '@/lib/env';
import { auth } from '@/lib/auth';
import { prisma } from '@/server/db';
import { getStripe } from '@/lib/stripe';

type Tier = 'starter' | 'pro' | 'enterprise';

export async function POST(req: Request) {
  if (!env.ENABLE_BILLING) {
    return NextResponse.json({ error: 'Billing disabled' }, { status: 404 });
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { tier = 'starter', priceId } = body as { tier?: Tier; priceId?: string };

  // Check if user already has an active subscription for this tier
  const existingEntitlement = await prisma.entitlement.findUnique({
    where: { userId: session.user.id }
  });

  if (existingEntitlement && existingEntitlement.isActive) {
    // Convert tier to uppercase for comparison
    const requestedTier = tier.toUpperCase();
    
    if (existingEntitlement.tier === requestedTier) {
      return NextResponse.json({ 
        error: 'You already have an active subscription for this plan',
        currentTier: existingEntitlement.tier,
        isActive: existingEntitlement.isActive
      }, { status: 409 }); // Conflict status
    }
  }

  const origin = process.env.NODE_ENV === 'production' 
    ? env.PRODUCTION_URL || 'https://yourdomain.com'
    : 'http://localhost:3000';
    
  const successUrl = `${origin}/dashboard/billing?success=1&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/dashboard/billing?canceled=1&session_id={CHECKOUT_SESSION_ID}`;

  const stripe = getStripe();

  const existing = await prisma.stripeCustomer.findUnique({ where: { userId: session.user.id } });
  const customerId =
    existing?.stripeCustomerId ??
    (
      await stripe.customers.create({
        email: session.user.email ?? undefined,
        name: session.user.name ?? undefined,
        metadata: { userId: session.user.id }
      })
    ).id;

  if (!existing) {
    await prisma.stripeCustomer.create({
      data: { userId: session.user.id, stripeCustomerId: customerId }
    });
  }

  // Determine the price ID to use
  let price: string;
  if (env.BILLING_MODE === 'subscription') {
    price = env.STRIPE_PRICE_ID_SUBSCRIPTION;
  } else {
    // For one-time payments
    if (priceId) {
      // Use the provided priceId
      price = priceId;
    } else {
      // Fallback to tier-based pricing
      switch (tier) {
        case 'pro':
          price = env.STRIPE_PRICE_ID_PRO;
          break;
        case 'enterprise':
          price = env.STRIPE_PRICE_ID_ENTERPRISE;
          break;
        default:
          price = env.STRIPE_PRICE_ID_STARTER;
          break;
      }
    }
  }

  if (!price) {
    return NextResponse.json({ error: 'Invalid price configuration' }, { status: 400 });
  }

  // Get price amount from Stripe
  const priceDetails = await stripe.prices.retrieve(price);
  const amount = priceDetails.unit_amount || 0;

  const checkout = await stripe.checkout.sessions.create(
    {
      mode: env.BILLING_MODE,
      customer: customerId,
      line_items: [{ price, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: session.user.id,
      metadata: {
        userId: session.user.id,
        tier,
        billingMode: env.BILLING_MODE
      }
    },
    {
      idempotencyKey: `checkout_${session.user.id}_${env.BILLING_MODE}_${tier}_${price}_${Date.now()}`
    }
  );

  // Save purchase in database
  const purchase = await prisma.purchase.create({
    data: {
      userId: session.user.id,
      stripeSessionId: checkout.id,
      tier: tier.toUpperCase() as any,
      billingMode: env.BILLING_MODE as any,
      amount,
      currency: priceDetails.currency || 'usd',
      status: 'PENDING'
    }
  });

  return NextResponse.json({ url: checkout.url });
}
