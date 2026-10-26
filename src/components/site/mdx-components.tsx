import type { ComponentPropsWithoutRef } from 'react';

/**
 * Styles for case-study content written in MDX.
 *
 * The page that renders a case study already has its own <h1> (the project title), so a
 * `#` heading inside the MDX is rendered as an <h2>: one <h1> per page is what search
 * engines and screen readers expect.
 */
export const mdxComponents = {
  h1: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2 className="mb-6 mt-12 text-3xl font-bold tracking-tight" {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2 className="mb-6 mt-12 text-3xl font-bold tracking-tight" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="mb-4 mt-8 text-2xl font-bold tracking-tight" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p className="mb-6 text-lg leading-relaxed text-muted-foreground" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul className="mb-6 list-inside list-disc space-y-2 text-muted-foreground" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol className="mb-6 list-inside list-decimal space-y-2 text-muted-foreground" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>) => (
    <li className="text-lg leading-relaxed" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<'strong'>) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote className="my-6 border-l-4 border-primary pl-6 text-lg italic" {...props} />
  ),
  code: (props: ComponentPropsWithoutRef<'code'>) => (
    <code className="rounded bg-muted px-2 py-1 font-mono text-sm" {...props} />
  ),
  pre: (props: ComponentPropsWithoutRef<'pre'>) => (
    <pre className="mb-6 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm" {...props} />
  ),
  hr: (props: ComponentPropsWithoutRef<'hr'>) => <hr className="my-12 border-border" {...props} />,
  a: ({ href, ...props }: ComponentPropsWithoutRef<'a'>) => {
    const external = href?.startsWith('http');
    return (
      <a
        href={href}
        className="text-primary underline underline-offset-4 hover:text-primary/80"
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        {...props}
      />
    );
  },
};
