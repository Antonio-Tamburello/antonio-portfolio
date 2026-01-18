'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';

interface Config {
  billingEnabled: boolean;
  billingMode: 'payment' | 'subscription';
}

interface SubscriptionData {
  entitlement: {
    tier: string;
    isActive: boolean;
    billingMode: string | null;
  };
}

interface PricingData {
  billingEnabled: boolean;
  billingMode: string;
  prices: Array<{
    tier: string;
    priceId: string;
    amount: number;
    currency: string;
    interval?: string;
  }>;
}

export function PricingSection() {
  const [config, setConfig] = useState<Config | null>(null);
  const [user, setUser] = useState<any>(null);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch config and pricing data
        const [configRes, pricingRes] = await Promise.all([
          fetch('/api/config'),
          fetch('/api/pricing')
        ]);
        
        const configData = await configRes.json();
        const pricingDataResponse = await pricingRes.json();
        
        setConfig(configData);
        setPricingData(pricingDataResponse);

        // Check auth status
        const session = await authClient.getSession();
        if (session?.data) {
          setUser(session.data.user || null);
          
          // If user is logged in, fetch subscription data
          try {
            const subRes = await fetch('/api/user/subscription');
            const subData = await subRes.json();
            setSubscriptionData(subData);
          } catch (error) {
            console.log('No subscription data available');
            setSubscriptionData(null);
          }
        } else {
          setUser(null);
          setSubscriptionData(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section id="pricing" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="animate-pulse">Loading pricing...</div>
        </div>
      </section>
    );
  }

  if (!config?.billingEnabled || !pricingData?.billingEnabled) {
    return null;
  }

  const handlePurchase = async (priceId: string, tier?: string) => {
    if (!user) {
      // Redirect to sign up
      window.location.href = '/auth/sign-up';
      return;
    }
    
    try {
      // Determine tier if not provided
      let selectedTier = tier;
      if (!selectedTier && pricingData?.prices) {
        const priceInfo = pricingData.prices.find(p => p.priceId === priceId);
        selectedTier = priceInfo?.tier.toLowerCase();
      }
      
      // Fallback to starter if still not found
      if (!selectedTier) {
        selectedTier = 'starter';
      }
      
      // Create checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          tier: selectedTier
        }),
      });
      
      const data = await response.json();
      
      if (response.status === 409) {
        // User already has this subscription
        alert('You already have an active subscription for this plan!');
        return;
      }
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }
      
      const { url } = data;
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to create checkout session. Please try again.');
    }
  };

  // Subscription mode - single tier
  if (pricingData.billingMode === 'subscription') {
    const proPlan = pricingData.prices.find(p => p.tier === 'PRO');
    
    if (!proPlan) {
      return (
        <section id="pricing" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <p>Pricing information not available</p>
          </div>
        </section>
      );
    }

    return (
      <section id="pricing" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get access to all features with our monthly subscription.
          </p>
        </div>
        <div className="max-w-md mx-auto">
          <Card className="border-2 border-primary shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="w-4 h-4 mr-1" />
                  Popular
                </Badge>
              </div>
              <CardTitle className="text-2xl">Pro Plan</CardTitle>
              <CardDescription>Everything you need to build and scale</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">€{(proPlan.amount / 100).toFixed(0)}</span>
                <span className="text-muted-foreground">/{proPlan.interval || 'month'}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                'Full access to all features',
                'Unlimited projects',
                'Priority support',
                'Advanced analytics',
                'Team collaboration',
                'API access'
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full text-lg cursor-pointer" 
                size="lg"
                onClick={() => handlePurchase(proPlan.priceId, 'pro')}
                disabled={subscriptionData?.entitlement.tier === 'PRO' && subscriptionData?.entitlement.isActive}
              >
                {subscriptionData?.entitlement.tier === 'PRO' && subscriptionData?.entitlement.isActive
                  ? '✓ Current Active Plan'
                  : user ? 'Subscribe Now' : 'Sign up to Subscribe'
                }
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    );
  }

  // Payment mode - three tiers using real Stripe data
  const isCurrentActivePlan = (tier: string) => {
    if (!subscriptionData?.entitlement) return false;
    return subscriptionData.entitlement.tier === tier && subscriptionData.entitlement.isActive;
  };

  // Get plan features based on tier
  const getPlanFeatures = (tier: string) => {
    switch (tier) {
      case 'STARTER':
        return [
          'Basic authentication',
          'Database setup',
          'Basic components',
          'Email support',
          '1 project'
        ];
      case 'PRO':
        return [
          'Everything in Starter',
          'Stripe integration', 
          'Advanced components',
          'Priority support',
          '5 projects',
          'Team collaboration'
        ];
      case 'ENTERPRISE':
        return [
          'Everything in Pro',
          'Custom integrations',
          'Dedicated support',
          'Unlimited projects',
          'White-label options',
          'SLA guarantee'
        ];
      default:
        return [];
    }
  };

  // Get plan description
  const getPlanDescription = (tier: string) => {
    switch (tier) {
      case 'STARTER':
        return 'Perfect for small projects';
      case 'PRO':
        return 'Best for growing businesses';
      case 'ENTERPRISE':
        return 'For large scale applications';
      default:
        return '';
    }
  };

  // Create plans from real pricing data
  const plans = pricingData.prices
    .filter(price => ['STARTER', 'PRO', 'ENTERPRISE'].includes(price.tier))
    .map(price => ({
      name: price.tier.charAt(0) + price.tier.slice(1).toLowerCase(),
      tier: price.tier,
      description: getPlanDescription(price.tier),
      price: Math.round(price.amount / 100),
      currency: price.currency,
      priceId: price.priceId,
      popular: price.tier === 'PRO',
      features: getPlanFeatures(price.tier)
    }))
    .sort((a, b) => {
      const order = { 'STARTER': 1, 'PRO': 2, 'ENTERPRISE': 3 };
      return (order[a.tier as keyof typeof order] || 0) - (order[b.tier as keyof typeof order] || 0);
    });

  return (
    <section id="pricing" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Choose your plan</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          One-time purchase. Lifetime access. Start building immediately.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`relative ${plan.popular ? 'border-2 border-primary shadow-lg scale-105' : 'border shadow'}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-4">
                  <Star className="w-4 h-4 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">€{plan.price}</span>
                <span className="text-muted-foreground"> one-time</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => handlePurchase(plan.priceId, plan.tier.toLowerCase())}
                disabled={isCurrentActivePlan(plan.tier)}
              >
                {isCurrentActivePlan(plan.tier)
                  ? '✓ Current Active Plan'
                  : user ? 'Purchase Now' : 'Sign up to Purchase'
                }
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {!user && (
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Ready to get started? Create your account first.
          </p>
          <Button asChild>
            <a href="/auth/sign-up">Create Account</a>
          </Button>
        </div>
      )}
    </section>
  );
}