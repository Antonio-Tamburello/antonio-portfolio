import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Calendar, User, Mail } from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome back{user?.name ? `, ${user.name}` : ''}! 👋</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              Your account is in good standing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
            </div>
            <p className="text-xs text-muted-foreground">
              Account creation date
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.emailVerified ? '✓' : '⚠️'}
            </div>
            <p className="text-xs text-muted-foreground">
              {user?.emailVerified ? 'Email verified' : 'Please verify email'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan</CardTitle>
            <Badge variant="secondary">Free</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Starter</div>
            <p className="text-xs text-muted-foreground">
              <a href="/dashboard/billing" className="text-primary hover:underline">
                Upgrade plan
              </a>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <div className="mt-1 text-sm">{user?.email}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <div className="mt-1 text-sm">{user?.name || 'Not set'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Account Type</label>
              <div className="mt-1">
                <Badge variant="outline">Personal Account</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email Verification</label>
              <div className="mt-1">
                {user?.emailVerified ? (
                  <Badge variant="default" className="bg-green-500">Verified</Badge>
                ) : (
                  <Badge variant="destructive">Not Verified</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and settings for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" className="h-auto p-4 justify-start" asChild>
              <a href="/dashboard/settings">
                <div className="space-y-1">
                  <div className="font-medium">Account Settings</div>
                  <div className="text-sm text-muted-foreground">
                    Update your profile and preferences
                  </div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start" asChild>
              <a href="/dashboard/billing">
                <div className="space-y-1">
                  <div className="font-medium">Billing & Plans</div>
                  <div className="text-sm text-muted-foreground">
                    Manage subscriptions and payments
                  </div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start" asChild>
              <a href="/">
                <div className="space-y-1">
                  <div className="font-medium">Back to Home</div>
                  <div className="text-sm text-muted-foreground">
                    Return to the main website
                  </div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
