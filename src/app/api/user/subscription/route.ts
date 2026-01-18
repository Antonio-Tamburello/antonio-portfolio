import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { prisma } from '@/server/db';

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  console.log('🔍 Fetching subscription data for user:', session.user.id);

  // Get user's entitlement and purchases (exclude pending purchases from history)
  const [entitlement, purchases] = await Promise.all([
    prisma.entitlement.findUnique({
      where: { userId: session.user.id }
    }),
    prisma.purchase.findMany({
      where: { 
        userId: session.user.id,
        status: { not: 'PENDING' } // Only show completed, failed, cancelled, or refunded purchases
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
  ]);

  console.log('📊 Found entitlement:', entitlement);
  console.log('📊 Found purchases:', purchases.length);

  return NextResponse.json({
    entitlement: entitlement || {
      tier: 'FREE',
      billingMode: null,
      isActive: true,
      stripeSubscriptionId: null
    },
    purchases
  });
}