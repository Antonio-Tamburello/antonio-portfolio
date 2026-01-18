'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Mode = 'sign-in' | 'sign-up';

async function fetchConfig() {
  const res = await fetch('/api/config', { cache: 'no-store' });
  if (!res.ok) return { googleEnabled: false } as const;
  return (await res.json()) as { googleEnabled: boolean };
}

export function AuthCard({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [googleEnabled, setGoogleEnabled] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  React.useEffect(() => {
    fetchConfig().then((c) => setGoogleEnabled(Boolean(c.googleEnabled))).catch(() => setGoogleEnabled(false));
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') ?? '');
    const email = String(fd.get('email') ?? '');
    const password = String(fd.get('password') ?? '');

    try {
      if (mode === 'sign-up') {
        const { error } = await authClient.signUp.email({
          name,
          email,
          password,
        });
        if (error) throw new Error(error.message);
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
        });
        if (error) throw new Error(error.message);
      }

      // Force redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setPending(false);
    }
  }

  async function onGoogle() {
    setError(null);
    setPending(true);
    try {
      const { error } = await authClient.signIn.social({ 
        provider: 'google',
        callbackURL: '/dashboard' // Redirect to dashboard after Google login
      });
      if (error) throw new Error(error.message);
      // social flow redirects automatically
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
      setPending(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <div className="text-2xl font-bold text-center">{mode === 'sign-up' ? 'Create account' : 'Welcome back'}</div>
        <div className="text-sm text-muted-foreground text-center">
          {mode === 'sign-up' 
            ? 'Enter your details to create your account' 
            : 'Enter your credentials to sign in'
          }
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {googleEnabled && (
          <>
            <Button type="button" variant="outline" onClick={onGoogle} disabled={pending} className="w-full">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
          </>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === 'sign-up' && (
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Name
              </label>
              <Input id="name" name="name" placeholder="Enter your name" required disabled={pending} />
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Email
            </label>
            <Input id="email" name="email" type="email" placeholder="Enter your email" required disabled={pending} />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Password
            </label>
            <Input id="password" name="password" type="password" placeholder="Enter your password" required disabled={pending} />
          </div>
          <Button className="w-full" disabled={pending}>
            {pending ? 'Loading...' : (mode === 'sign-up' ? 'Create Account' : 'Sign In')}
          </Button>
        </form>

        {error && (
          <div className="rounded-md bg-destructive/15 p-3">
            <div className="text-sm text-destructive">{error}</div>
          </div>
        )}

        <div className="text-center text-sm text-muted-foreground">
          {mode === 'sign-up' ? (
            <>
              Already have an account?{' '}
              <a className="underline underline-offset-4 hover:text-primary" href="/auth/sign-in">
                Sign in
              </a>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <a className="underline underline-offset-4 hover:text-primary" href="/auth/sign-up">
                Sign up
              </a>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
