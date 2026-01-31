import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import AnimatedBackground from '@/components/ui/animated-background';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'Antonio Tamburello | Full Stack Developer',
  description: 'Senior Full Stack Developer specializing in React, Node.js, and scalable web applications. View my portfolio, projects, and case studies.',
  keywords: ['Full Stack Developer', 'React', 'Node.js', 'Next.js', 'Portfolio', 'Antonio Tamburello'],
  authors: [{ name: 'Antonio Tamburello' }],
  openGraph: {
    title: 'Antonio Tamburello | Full Stack Developer',
    description: 'Senior Full Stack Developer specializing in React, Node.js, and scalable web applications.',
    type: 'website',
    locale: 'en_US',
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh text-foreground">
        <AnimatedBackground />
        <ThemeProvider>
          <div className="relative z-10 min-h-screen bg-background">
            {children}
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
