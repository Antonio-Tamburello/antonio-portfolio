import './globals.css';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { ThemeProvider } from '@/components/theme-provider';
import { site } from '@/config/site';
import { getProfile } from '@/content/load';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Geist_Mono, Sora } from 'next/font/google';
import type { CSSProperties, ReactNode } from 'react';

const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' });
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.seo.title, template: '%s — Antonio Tamburello' },
  description: site.seo.description,
  keywords: [...site.seo.keywords],
  authors: [{ name: 'Antonio Tamburello', url: site.url }],
  creator: 'Antonio Tamburello',
  // Every page sets its own canonical URL; this one is the home page's.
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  // Google Search Console ownership check (public by design: it ends up in the page HTML).
  verification: { google: 'g2UN7ABa9rZQs4vs-Uxo4ogFq-8FUnByW2q2qzgTQi4' },
  openGraph: {
    title: site.seo.title,
    description: site.seo.description,
    type: 'website',
    locale: 'en_US',
    url: site.url,
    siteName: 'Antonio Tamburello',
  },
  twitter: {
    card: 'summary_large_image',
    title: site.seo.title,
    description: site.seo.description,
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const profile = await getProfile();

  // Accent colors come from src/config/site.ts; globals.css picks the light or dark pair.
  const brand = {
    '--brand-light': site.theme.light.accent,
    '--brand-light-foreground': site.theme.light.accentForeground,
    '--brand-dark': site.theme.dark.accent,
    '--brand-dark-foreground': site.theme.dark.accentForeground,
  } as CSSProperties;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${geistMono.variable}`}
      style={brand}
    >
      <body className="min-h-dvh">
        <ThemeProvider>
          <SiteHeader name={profile.name} />
          <main>{children}</main>
          <SiteFooter profile={profile} />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
