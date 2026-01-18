import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/header';
import { CheckCircle, Code2, Database, Shield, CreditCard, Zap, Github, ArrowRight } from 'lucide-react';
import { PricingSection } from '@/components/pricing-section';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted/30">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Badge variant="outline" className="px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Ship your SaaS in days, not months
            </Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            The Ultimate{' '}
            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              SaaS Blueprint
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A production-ready Next.js SaaS starter with authentication, payments, database, and everything you need to launch fast.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/auth/sign-up">
              <Button size="lg" className="text-lg px-8">
                Start Building
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="text-lg px-8">
                <Github className="w-5 h-5 mr-2" />
                View on GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need to ship</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Skip the boilerplate and focus on what matters - building your unique product.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: 'Authentication',
              description: 'Email/password and Google OAuth with Better Auth. Session management included.',
              features: ['Email verification', 'Password reset', 'Social login', 'Session security']
            },
            {
              icon: Database,
              title: 'Database Ready',
              description: 'PostgreSQL with Prisma ORM. Migrations and schema management built-in.',
              features: ['Type-safe queries', 'Auto migrations', 'Connection pooling', 'Production ready']
            },
            {
              icon: CreditCard,
              title: 'Stripe Integration',
              description: 'Complete billing system with subscriptions and one-time payments.',
              features: ['Checkout pages', 'Webhook handling', 'Invoice management', 'Tax compliance']
            }
          ].map((feature) => (
            <Card key={feature.title} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {feature.features.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Built with the best</h2>
            <p className="text-xl text-muted-foreground">
              Modern technologies for scalable, maintainable applications
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'Next.js 16', desc: 'App Router & RSC' },
              { name: 'TypeScript', desc: 'Type safety' },
              { name: 'Tailwind CSS', desc: 'Styling' },
              { name: 'Prisma', desc: 'Database ORM' },
              { name: 'Better Auth', desc: 'Authentication' },
              { name: 'Stripe', desc: 'Payments' },
              { name: 'PostgreSQL', desc: 'Database' },
              { name: 'shadcn/ui', desc: 'Components' }
            ].map((tech) => (
              <div key={tech.name} className="text-center">
                <div className="font-semibold">{tech.name}</div>
                <div className="text-sm text-muted-foreground">{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">SaaS Forge Kit</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SaaS Forge Kit. Built with ❤️ for developers.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
