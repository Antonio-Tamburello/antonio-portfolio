import { NextResponse } from 'next/server';
import { prisma } from '@/server/db';

// This endpoint simulates Stripe webhook completion in development
// Call this after redirecting back from Stripe checkout page
export async function POST(req: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Only available in development' }, { status: 403 });
  }

  const { sessionId } = await req.json();
  
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
  }

  console.log('🎯 Dev webhook simulation: Starting completion for session:', sessionId);

  // Find the pending purchase
  const purchase = await (prisma as any).purchase.findFirst({
    where: {
      stripeSessionId: sessionId,
      status: 'PENDING'
    }
  });

  if (!purchase) {
    console.log('❌ No pending purchase found for session:', sessionId);
    return NextResponse.json({ error: 'No pending purchase found' }, { status: 404 });
  }

  console.log('✅ Found pending purchase:', { 
    purchaseId: purchase.id, 
    userId: purchase.userId, 
    tier: purchase.tier, 
    billingMode: purchase.billingMode 
  });

  // Update entitlement
  const entitlementResult = await prisma.entitlement.upsert({
    where: { userId: purchase.userId },
    update: {
      tier: purchase.tier,
      billingMode: purchase.billingMode,
      isActive: true,
      stripeCustomerId: `fake_customer_${purchase.userId}`,
      stripeSubscriptionId: purchase.billingMode === 'subscription' ? `fake_sub_${purchase.userId}` : null
    },
    create: {
      userId: purchase.userId,
      tier: purchase.tier,
      billingMode: purchase.billingMode,
      isActive: true,
      stripeCustomerId: `fake_customer_${purchase.userId}`,
      stripeSubscriptionId: purchase.billingMode === 'subscription' ? `fake_sub_${purchase.userId}` : null
    }
  });

  console.log('✅ Updated entitlement:', { 
    entitlementId: entitlementResult.id, 
    tier: entitlementResult.tier, 
    isActive: entitlementResult.isActive 
  });

  // Update purchase status
  await (prisma as any).purchase.update({
    where: { id: purchase.id },
    data: { 
      status: 'COMPLETED',
      stripePaymentIntentId: `fake_pi_${purchase.id}`,
      stripeSubscriptionId: purchase.billingMode === 'subscription' ? `fake_sub_${purchase.userId}` : null
    }
  });

  console.log('🎯 Dev webhook simulation: Purchase completed', { purchaseId: purchase.id });

  return NextResponse.json({ success: true, purchaseId: purchase.id });
}