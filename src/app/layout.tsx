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
  authors: [{ name: 'Antonio Tamburello' }],
  openGraph: {
    title: site.seo.title,
    description: site.seo.description,
    type: 'website',
    locale: 'en_US',
    url: site.url,
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const profile = await getProfile();

  // The accent color comes from src/config/site.ts
  const brand = {
    '--brand': site.theme.accent,
    '--brand-foreground': site.theme.accentForeground,
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
