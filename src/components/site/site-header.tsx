'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { site } from '@/config/site';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PageContainer } from './bento';

/** "Antonio Tamburello" → "AT" */
const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export function SiteHeader({ name }: { name: string }) {
  const pathname = usePathname();

  return (
    <header className="py-5">
      <PageContainer className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="order-1 flex items-center gap-3">
          <span
            aria-hidden
            className="flex size-10 items-center justify-center rounded-xl bg-brand text-[15px] font-bold text-brand-foreground"
          >
            {initialsOf(name)}
          </span>
          <span className="font-semibold">{name}</span>
        </Link>

        {/* Phone: name + theme switch on the first row, menu full width below. Desktop: one row. */}
        <div className="order-2 md:order-3">
          <ThemeToggle />
        </div>

        <nav
          aria-label="Main"
          className="order-3 flex w-full items-center justify-between gap-0.5 rounded-full border border-border bg-card p-1.5 text-[13px] sm:text-sm md:order-2 md:ml-auto md:w-auto md:gap-1"
        >
          {site.nav.map((item) => {
            const active = item.href === pathname;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex-1 rounded-full px-2 py-2.5 text-center transition-colors hover:bg-chip md:flex-none md:px-3.5',
                  active && 'bg-chip font-semibold',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </PageContainer>
    </header>
  );
}
