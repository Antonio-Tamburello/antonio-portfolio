import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { prisma } from '@/server/db';

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Mark as CANCELLED all pending purchases older than 1 hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  const result = await prisma.purchase.updateMany({
    where: {
      userId: session.user.id,
      status: 'PENDING',
      createdAt: { lt: oneHourAgo }
    },
    data: {
      status: 'CANCELLED'
    }
  });

  return NextResponse.json({ 
    message: 'Pending purchases cleaned up',
    updated: result.count 
  });
}