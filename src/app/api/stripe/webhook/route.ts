import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

import { env } from '@/lib/env';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/server/db';

export async function POST(req: Request) {
  if (!env.ENABLE_BILLING) {
    return NextResponse.json({ error: 'Billing disabled' }, { status: 404 });
  }

  const stripe = getStripe();
  const sig = req.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });

  const raw = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, env.STRIPE_WEBHOOK_SECRET as string);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const seen = await prisma.stripeEvent.findUnique({ where: { stripeEventId: event.id } });
  if (seen) return NextResponse.json({ received: true });

  await prisma.stripeEvent.create({ data: { stripeEventId: event.id } });

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const userId = session?.metadata?.userId as string | undefined;
    const tier = (session?.metadata?.tier as string | undefined) ?? 'FREE';
    const billingMode = (session?.metadata?.billingMode as string | undefined) ?? 'payment';

    if (userId) {
      // Check if this session was already processed
      const existingCompletedPurchase = await (prisma as any).purchase.findFirst({
        where: { 
          stripeSessionId: session.id,
          status: 'COMPLETED'
        }
      });

      // If already processed, skip
      if (existingCompletedPurchase) {
        return NextResponse.json({ received: true, skipped: 'already_processed' });
      }

      await prisma.entitlement.upsert({
        where: { userId },
        update: {
          tier: tier as any,
          billingMode: billingMode as any,
          isActive: true,
          stripeCustomerId: (session.customer as string | null) ?? null,
          stripeSubscriptionId: (session.subscription as string | null) ?? null
        },
        create: {
          userId,
          tier: tier as any,
          billingMode: billingMode as any,
          isActive: true,
          stripeCustomerId: (session.customer as string | null) ?? null,
          stripeSubscriptionId: (session.subscription as string | null) ?? null
        }
      });

      // Update purchase status
      const updatedCount = await (prisma as any).purchase.updateMany({
        where: { 
          userId,
          stripeSessionId: session.id,
          status: 'PENDING'
        },
        data: { 
          status: 'COMPLETED',
          stripePaymentIntentId: session.payment_intent as string | null,
          stripeSubscriptionId: session.subscription as string | null
        }
      });

      // If no pending purchase was found to update, it means this session was already processed
      if (updatedCount.count === 0) {
        return NextResponse.json({ received: true, skipped: 'no_pending_purchase' });
      }
    }
  }

  return NextResponse.json({ received: true });
}
