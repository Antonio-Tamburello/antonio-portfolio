import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CheckoutButton } from '@/components/checkout-button';

const plans = [
  { tier: 'starter', title: 'Starter', price: '€9', perks: ['For prototypes', 'Basic support'] },
  { tier: 'pro', title: 'Pro', price: '€29', perks: ['For teams', 'Priority support'] },
  { tier: 'enterprise', title: 'Enterprise', price: 'Let\'s talk', perks: ['Custom', 'SLA'] }
] as const;

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10 space-y-8">
      <header className="flex items-center justify-between">
        <a className="font-semibold" href="/">saas-forge-kit</a>
        <nav className="flex gap-3 text-sm">
          <a className="underline" href="/auth/sign-in">Sign in</a>
          <a className="underline" href="/auth/sign-up">Sign up</a>
          <a className="underline" href="/dashboard">Dashboard</a>
        </nav>
      </header>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Pricing</h1>
        <p className="text-black/60">Stripe billing is optional. Plans are demo by default.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.tier}>
            <CardHeader>
              <div className="font-semibold">{p.title}</div>
              <div className="text-2xl font-bold">{p.price}</div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="text-sm text-black/70 space-y-1">
                {p.perks.map((x) => (
                  <li key={x}>• {x}</li>
                ))}
              </ul>
              <CheckoutButton tier={p.tier} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
