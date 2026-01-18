'use client';

import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  // same domain => can omit; keeping explicit for clarity
  baseURL: process.env.NEXT_PUBLIC_APP_URL
});
