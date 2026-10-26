import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

/**
 * Building blocks for the bento layout. Every page is made of these:
 * Tile (a card), Eyebrow (small mono label), Chip (tag), Highlight (accent mark),
 * SectionHeader (title + optional link) and ButtonLink.
 */

type TileVariant = 'default' | 'brand' | 'inverted' | 'dashed';

const tileVariants: Record<TileVariant, string> = {
  default: 'bg-card text-card-foreground border border-border',
  brand: 'bg-brand text-brand-foreground',
  inverted: 'bg-foreground text-background',
  dashed: 'border border-dashed border-muted-foreground/60',
};

const tileBase = 'rounded-[28px] p-7 sm:p-8 flex flex-col gap-3';

type TileProps = {
  variant?: TileVariant;
  /** When set, the whole tile is a link. External URLs open in a new tab. */
  href?: string;
  className?: string;
  children: ReactNode;
};

export function Tile({ variant = 'default', href, className, children }: TileProps) {
  const classes = cn(
    tileBase,
    tileVariants[variant],
    // Clickable tiles must look clickable: lift, stronger border and shadow on hover, and a
    // visible outline for keyboard users. Tiles without href stay flat.
    href &&
      'group transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:shadow-lg hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
    className,
  );
  if (!href) return <div className={classes}>{children}</div>;
  // In-page anchors (e.g. "#work") scroll smoothly with a plain link
  if (href.startsWith('#'))
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  const external = /^https?:\/\//.test(href) || href.startsWith('mailto:');
  return external ? (
    <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

/**
 * The "this card is a link" line at the bottom of a clickable Tile. The arrow moves on
 * hover; on touch screens the text alone says the card can be opened.
 */
export function TileCta({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn('mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium', className)}
    >
      {children}
      <span aria-hidden className="transition-transform group-hover:translate-x-1">
        →
      </span>
    </span>
  );
}

export function Eyebrow({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span className={cn('font-mono text-xs uppercase tracking-wide opacity-70', className)}>
      {children}
    </span>
  );
}

export function Chip({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span className={cn('rounded-lg bg-chip px-2.5 py-1.5 font-mono text-xs', className)}>
      {children}
    </span>
  );
}

export function ChipList({
  items,
  className,
  chipClassName,
}: {
  items: string[];
  className?: string;
  /** Extra classes for each chip, e.g. outlined chips on a dark tile. */
  chipClassName?: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {items.map((item) => (
        <Chip key={item} className={chipClassName}>
          {item}
        </Chip>
      ))}
    </div>
  );
}

/** The accent "marker" behind a word, e.g. "production". */
export function Highlight({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-[0.16em] bg-brand px-[0.16em] text-brand-foreground box-decoration-clone">
      {children}
    </span>
  );
}

export function HighlightedText({
  text,
}: {
  text: { before: string; highlight: string; after?: string };
}) {
  return (
    <>
      {text.before}
      <Highlight>{text.highlight}</Highlight>
      {text.after}
    </>
  );
}

export function SectionHeader({
  title,
  link,
  id,
}: {
  title: string;
  link?: { label: string; href: string };
  id?: string;
}) {
  return (
    <div id={id} className="flex scroll-mt-24 flex-wrap items-baseline justify-between gap-3">
      <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
      {link && (
        <Link
          href={link.href}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {link.label} →
        </Link>
      )}
    </div>
  );
}

type ButtonLinkProps = ComponentProps<'a'> & { variant?: 'solid' | 'soft' | 'brand' };

const buttonVariants = {
  solid: 'bg-foreground text-background font-semibold',
  soft: 'bg-chip text-foreground font-medium',
  brand: 'bg-brand text-brand-foreground font-semibold',
};

export function ButtonLink({ variant = 'soft', className, href = '#', ...props }: ButtonLinkProps) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className={cn(
        'inline-flex items-center rounded-[14px] px-5 py-3.5 text-[15px] transition-opacity hover:opacity-85',
        buttonVariants[variant],
        className,
      )}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    />
  );
}

/** Centered page width used on every page. */
export function PageContainer({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn('mx-auto w-full max-w-[1200px] px-5', className)}>{children}</div>;
}
