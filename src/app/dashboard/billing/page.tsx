'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, CreditCard, Calendar, DollarSign } from 'lucide-react';
import Link from 'next/link';

function BillingContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState<{billingMode: string; enableBilling: boolean; priceIds: any} | null>(null);
  const [pricingData, setPricingData] = useState<{
    billingEnabled: boolean;
    billingMode: string;
    prices: Array<{
      tier: string;
      priceId: string;
      amount: number;
      currency: string;
      interval?: string;
    }>;
  } | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<{
    entitlement: {
      tier: string;
      billingMode: string | null;
      isActive: boolean;
      stripeSubscriptionId: string | null;
    };
    purchases: Array<{
      id: string;
      tier: string;
      amount: number;
      currency: string;
      status: string;
      createdAt: string;
      billingMode: string;
    }>;
  } | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  // Helper function to get price display for a tier
  const getPriceDisplay = (tier: string, billingMode: string | null) => {
    if (tier === 'FREE') return { amount: '$0', interval: '/month' };
    
    if (!pricingData?.prices) return { amount: 'N/A', interval: '' };
    
    const priceInfo = pricingData.prices.find(p => p.tier === tier);
    if (!priceInfo) return { amount: 'N/A', interval: '' };
    
    const amount = `$${(priceInfo.amount / 100).toFixed(0)}`;
    const interval = priceInfo.interval ? `/${priceInfo.interval}` : billingMode === 'subscription' ? '/month' : 'one-time';
    
    return { amount, interval };
  };

  // Helper function to get available tiers for upgrade based on current tier
  const getAvailableTiers = () => {
    if (!pricingData?.prices) return [];
    
    const currentTier = subscriptionData?.entitlement.tier;
    
    // If user is on FREE plan, show all tiers
    if (currentTier === 'FREE') {
      return pricingData.prices.filter(price => ['STARTER', 'PRO', 'ENTERPRISE'].includes(price.tier));
    }
    
    // If user has an active plan, show other tiers (exclude current one)
    if (subscriptionData?.entitlement.isActive) {
      return pricingData.prices.filter(price => 
        ['STARTER', 'PRO', 'ENTERPRISE'].includes(price.tier) && 
        price.tier !== currentTier
      );
    }
    
    // Fallback: show all tiers
    return pricingData.prices.filter(price => ['STARTER', 'PRO', 'ENTERPRISE'].includes(price.tier));
  };

  // Helper function to get features for each tier
  const getTierFeatures = (tier: string) => {
    switch (tier) {
      case 'STARTER':
        return [
          '• Basic authentication',
          '• Database setup', 
          '• Basic components',
          '• Email support',
          '• 1 project'
        ];
      case 'PRO':
        return [
          '• Everything in Starter',
          '• Stripe integration',
          '• Advanced components', 
          '• Priority support',
          '• 5 projects',
          '• Team collaboration'
        ];
      case 'ENTERPRISE':
        return [
          '• Everything in Pro',
          '• Custom integrations',
          '• Dedicated support',
          '• Unlimited projects', 
          '• White-label options',
          '• SLA guarantee'
        ];
      default:
        return [];
    }
  };

  const handlePurchase = async (priceId: string, tier: string) => {
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, tier: tier.toLowerCase() })
      });
      
      const data = await response.json();
      
      if (response.status === 409) {
        // User already has this subscription
        alert(`You already have an active ${tier} plan. No need to subscribe again!`);
        return;
      }
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create checkout session. Please try again.');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to create checkout session. Please try again.');
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscriptionData?.entitlement) return;
    
    const isSubscription = subscriptionData.entitlement.billingMode === 'subscription';
    const confirmMessage = isSubscription 
      ? 'Are you sure you want to cancel your subscription? It will remain active until the end of your billing period.'
      : 'Are you sure you want to reset to the Free plan? This action cannot be undone.';
    
    if (!confirm(confirmMessage)) return;

    setIsCancelling(true);
    try {
      const response = await fetch('/api/user/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      if (response.ok && result.success) {
        alert(result.message);
        // Reload data to reflect changes
        window.location.reload();
      } else {
        console.error('Cancellation failed:', result);
        alert(result.error || 'Failed to cancel subscription. Please try again.');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    
    const loadData = async () => {
      try {
        console.log('🔍 URL search params:', Array.from(searchParams.entries()));
        
        // In development, if coming back from successful checkout, simulate webhook
        if (process.env.NODE_ENV === 'development' && success === '1') {
          const sessionId = searchParams.get('session_id');
          console.log('🎯 Checkout success detected, session_id:', sessionId);
          
          if (sessionId) {
            console.log('🎯 Simulating webhook completion for session:', sessionId);
            const devCompleteResponse = await fetch('/api/stripe/dev-complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sessionId })
            });
            const devCompleteResult = await devCompleteResponse.json();
            console.log('✅ Dev webhook completed:', devCompleteResult);
          } else {
            console.log('❌ No session_id found in URL, skipping dev-complete');
          }
        }

        // Cleanup old pending purchases and fetch data
        const [configData, , subData, pricingResponse] = await Promise.all([
          fetch('/api/config').then(res => res.json()),
          fetch('/api/user/cleanup-purchases', { method: 'POST' }).then(() => {}), // Clean up abandoned purchases
          fetch('/api/user/subscription').then(res => res.json()),
          fetch('/api/pricing').then(res => res.json())
        ]);
        
        console.log('📊 Loaded subscription data:', subData);
        console.log('💰 Loaded pricing data:', pricingResponse);
        setConfig(configData);
        setSubscriptionData(subData);
        setPricingData(pricingResponse);
      } catch (error) {
        console.error('Error loading billing data:', error);
      }
    };

    loadData();
  }, [success, searchParams]);

  if (!mounted || !config || !subscriptionData || !pricingData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription and billing information</p>
      </div>

      {/* Success/Cancel Messages */}
      {success === '1' && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Payment successful! Your subscription has been activated.
          </AlertDescription>
        </Alert>
      )}

      {canceled === '1' && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <XCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Payment was canceled. You can try again anytime.
          </AlertDescription>
        </Alert>
      )}

      {/* Current Subscription Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Plan
              </CardTitle>
              <CardDescription>Your current subscription status</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <h3 className="font-semibold">
                  {subscriptionData.entitlement.tier === 'FREE' ? 'Free Plan' : 
                   subscriptionData.entitlement.tier.charAt(0) + subscriptionData.entitlement.tier.slice(1).toLowerCase() + ' Plan'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {subscriptionData.entitlement.isActive ? 'Currently active' : 'Inactive'}
                </p>
                {subscriptionData.entitlement.stripeSubscriptionId && (
                  <p className="text-xs text-muted-foreground">
                    Subscription ID: {subscriptionData.entitlement.stripeSubscriptionId.slice(-8)}...
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-bold text-2xl">
                  {getPriceDisplay(subscriptionData.entitlement.tier, subscriptionData.entitlement.billingMode).amount}
                </p>
                <p className="text-sm text-muted-foreground">
                  {getPriceDisplay(subscriptionData.entitlement.tier, subscriptionData.entitlement.billingMode).interval}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Plan Features:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {subscriptionData.entitlement.tier === 'FREE' ? (
                  <>
                    <li>• Basic authentication</li>
                    <li>• Limited features</li>
                    <li>• Community support</li>
                  </>
                ) : subscriptionData.entitlement.tier === 'STARTER' ? (
                  <>
                    <li>• Basic authentication</li>
                    <li>• Database setup</li>
                    <li>• Basic components</li>
                    <li>• Email support</li>
                    <li>• 1 project</li>
                  </>
                ) : subscriptionData.entitlement.tier === 'PRO' ? (
                  <>
                    <li>• Everything in Starter</li>
                    <li>• Stripe integration</li>
                    <li>• Advanced components</li>
                    <li>• Priority support</li>
                    <li>• 5 projects</li>
                    <li>• Team collaboration</li>
                  </>
                ) : (
                  <>
                    <li>• Everything in Pro</li>
                    <li>• Custom integrations</li>
                    <li>• Dedicated support</li>
                    <li>• Unlimited projects</li>
                    <li>• White-label options</li>
                    <li>• SLA guarantee</li>
                  </>
                )}
              </ul>
            </div>
            
            {/* Action buttons */}
            {subscriptionData.entitlement.tier !== 'FREE' && subscriptionData.entitlement.isActive && (
              <div className="flex gap-2 pt-4 border-t">
                {subscriptionData.entitlement.billingMode === 'subscription' && subscriptionData.entitlement.stripeSubscriptionId ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={handleCancelSubscription}
                    disabled={isCancelling}
                  >
                    {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
                  </Button>
                ) : subscriptionData.entitlement.billingMode === 'payment' ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={handleCancelSubscription}
                    disabled={isCancelling}
                  >
                    {isCancelling ? 'Resetting...' : 'Reset to Free Plan'}
                  </Button>
                ) : null}
                <Button variant="outline" size="sm" asChild>
                  <Link href="/#pricing">Change Plan</Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Options - Show available tiers based on current plan */}
      {getAvailableTiers().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {subscriptionData.entitlement.tier === 'FREE' ? 'Choose Your Plan' : 'Upgrade Your Plan'}
            </CardTitle>
            <CardDescription>
              {subscriptionData.entitlement.tier === 'FREE' 
                ? 'Select a plan that fits your needs' 
                : 'Upgrade to unlock more features'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {config.billingMode === 'subscription' ? (
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Pro Plan</h3>
                  <p className="text-2xl font-bold mb-2">
                    {getPriceDisplay('PRO', 'subscription').amount} 
                    <span className="text-sm font-normal text-muted-foreground">
                      {getPriceDisplay('PRO', 'subscription').interval}
                    </span>
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                    <li>• Full access to all features</li>
                    <li>• Unlimited projects</li>
                    <li>• Priority support</li>
                    <li>• Advanced analytics</li>
                    <li>• Team collaboration</li>
                  </ul>
                  <Button 
                    className="w-full"
                    onClick={() => handlePurchase(pricingData?.prices.find(p => p.tier === 'PRO')?.priceId || '', 'PRO')}
                    disabled={!pricingData?.prices.find(p => p.tier === 'PRO')?.priceId || (subscriptionData.entitlement.tier === 'PRO' && subscriptionData.entitlement.isActive)}
                  >
                    {(subscriptionData.entitlement.tier === 'PRO' && subscriptionData.entitlement.isActive) 
                      ? 'Current Active Plan' 
                      : 'Upgrade to Pro'
                    }
                  </Button>
                </div>
              ) : (
                <>
                  {/* Render pricing cards for payment mode using real Stripe data */}
                  {getAvailableTiers().map((priceInfo) => (
                    <div 
                      key={priceInfo.tier} 
                      className={`p-4 border rounded-lg ${priceInfo.tier === 'PRO' ? 'border-2 border-primary' : ''}`}
                    >
                      <h3 className="font-semibold mb-2">
                        {priceInfo.tier.charAt(0) + priceInfo.tier.slice(1).toLowerCase()} Plan
                      </h3>
                      <p className="text-2xl font-bold mb-2">
                        €{(priceInfo.amount / 100).toFixed(0)} 
                        <span className="text-sm font-normal text-muted-foreground"> one-time</span>
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                        {getTierFeatures(priceInfo.tier).map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                      <Button 
                        variant={priceInfo.tier === 'PRO' ? 'default' : 'outline'}
                        className="w-full"
                        onClick={() => handlePurchase(priceInfo.priceId, priceInfo.tier)}
                        disabled={subscriptionData.entitlement.tier === priceInfo.tier && subscriptionData.entitlement.isActive}
                      >
                        {(subscriptionData.entitlement.tier === priceInfo.tier && subscriptionData.entitlement.isActive) 
                          ? '✓ Current Active Plan' 
                          : `Purchase ${priceInfo.tier.charAt(0) + priceInfo.tier.slice(1).toLowerCase()}`
                        }
                      </Button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Billing History
          </CardTitle>
          <CardDescription>Your recent transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {subscriptionData.purchases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No billing history available</p>
              <p className="text-sm">Your transactions will appear here after making a purchase</p>
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptionData.purchases.map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">
                      {purchase.status === 'CANCELLED' 
                        ? `${purchase.tier.charAt(0) + purchase.tier.slice(1).toLowerCase()} Plan - Cancelled`
                        : `${purchase.tier.charAt(0) + purchase.tier.slice(1).toLowerCase()} Plan`
                      }
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(purchase.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })} • {purchase.billingMode || 'N/A'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        purchase.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        purchase.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        purchase.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                        purchase.status === 'CANCELLED' ? 'bg-orange-100 text-orange-800' :
                        purchase.status === 'REFUNDED' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {purchase.status.toLowerCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {purchase.status === 'CANCELLED' 
                        ? '–' 
                        : `$${(purchase.amount / 100).toFixed(2)} ${purchase.currency.toUpperCase()}`
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs font-mono space-y-1">
              <div>ENABLE_BILLING: {String(config.enableBilling)}</div>
              <div>BILLING_MODE: {config.billingMode}</div>
              <div>CURRENT_TIER: {subscriptionData?.entitlement.tier}</div>
              <div>IS_ACTIVE: {String(subscriptionData?.entitlement.isActive)}</div>
              <div>PRICING_LOADED: {String(Boolean(pricingData))}</div>
              <div>PRICE_COUNT: {pricingData?.prices?.length || 0}</div>
              <div>AVAILABLE_TIERS: {getAvailableTiers().length}</div>
              {pricingData?.prices?.map(price => (
                <div key={price.tier}>{price.tier}: €{price.amount/100} ({price.priceId.slice(-8)}...)</div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div>Loading billing page...</div>}>
      <BillingContent />
    </Suspense>
  );
}
