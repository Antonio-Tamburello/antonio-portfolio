import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { prisma } from '@/server/db';
import { getStripe } from '@/lib/stripe';
import { env } from '@/lib/env';

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Get user's current entitlement
    const entitlement = await prisma.entitlement.findUnique({
      where: { userId: session.user.id }
    });

    if (!entitlement) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    // Handle Stripe subscription cancellation only if billing is enabled and there's a subscription ID
    if (env.ENABLE_BILLING && entitlement.stripeSubscriptionId && entitlement.billingMode === 'subscription') {
      try {
        const stripe = getStripe();
        await stripe.subscriptions.cancel(entitlement.stripeSubscriptionId);
        console.log('🚫 Cancelled Stripe subscription:', entitlement.stripeSubscriptionId);
      } catch (stripeError) {
        console.error('Error cancelling Stripe subscription:', stripeError);
        // Continue with local cleanup even if Stripe fails
      }
    }

    // Update entitlement to Free plan
    await prisma.entitlement.update({
      where: { userId: session.user.id },
      data: {
        tier: 'FREE',
        billingMode: null,
        isActive: true,
        stripeSubscriptionId: null,
        stripeCustomerId: entitlement.stripeCustomerId // Keep customer ID for future purchases
      }
    });

    // Create a cancellation record in purchase history
    await (prisma as any).purchase.create({
      data: {
        userId: session.user.id,
        tier: entitlement.tier, // Store the tier that was cancelled
        billingMode: entitlement.billingMode,
        amount: 0, // No charge for cancellation
        currency: 'eur',
        status: 'CANCELLED',
        stripeSubscriptionId: entitlement.stripeSubscriptionId
      }
    });

    console.log('✅ Reset user to Free plan:', session.user.id);
    console.log('📝 Created cancellation record in purchase history');

    return NextResponse.json({ 
      success: true, 
      message: entitlement.billingMode === 'subscription' 
        ? 'Subscription cancelled successfully' 
        : 'Reset to Free plan successfully'
    });

  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json({ 
      error: 'Failed to cancel subscription', 
      success: false 
    }, { status: 500 });
  }
}