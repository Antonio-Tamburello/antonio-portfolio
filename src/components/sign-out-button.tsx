'use client';

import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SignOutButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export function SignOutButton({ children, className }: SignOutButtonProps) {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      className={cn(className)}
      onClick={async () => {
        await authClient.signOut();
        router.push('/');
        router.refresh();
      }}
    >
      {children || 'Sign out'}
    </Button>
  );
}
