import { AuthCard } from '@/components/auth-card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Code2 } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">SaaS Forge Kit</span>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <AuthCard mode="sign-up" />
      </div>
    </div>
  );
}
