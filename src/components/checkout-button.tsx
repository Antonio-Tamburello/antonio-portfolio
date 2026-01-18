'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';

type Tier = 'starter' | 'pro' | 'enterprise';

export function CheckoutButton({ tier }: { tier: Tier }) {
  const [enabled, setEnabled] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/config', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((c) => setEnabled(Boolean(c?.billingEnabled)))
      .catch(() => setEnabled(false));
  }, []);

  return (
    <Button
      disabled={!enabled || pending}
      onClick={async () => {
        setPending(true);
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ tier })
        });
        const data = (await res.json().catch(() => ({}))) as { url?: string };
        if (data.url) window.location.href = data.url;
        setPending(false);
      }}
    >
      {enabled ? 'Checkout' : 'Billing disabled'}
    </Button>
  );
}
