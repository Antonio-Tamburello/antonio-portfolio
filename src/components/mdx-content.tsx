'use client'

import { useMemo } from 'react'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

interface MDXContentProps {
  content: string
}

export function MDXContent({ content }: MDXContentProps) {
  // This will be handled server-side
  return null
}

// Server-side MDX rendering component
interface ServerMDXContentProps {
  serializedContent: MDXRemoteSerializeResult
}

export function ServerMDXContent({ serializedContent }: ServerMDXContentProps) {
  const components = {
    h1: ({ children, ...props }: ComponentPropsWithoutRef<'h1'>) => (
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6 mt-8" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: ComponentPropsWithoutRef<'h2'>) => (
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl mb-4 mt-8" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: ComponentPropsWithoutRef<'h3'>) => (
      <h3 className="text-xl font-semibold tracking-tight sm:text-2xl mb-3 mt-6" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }: ComponentPropsWithoutRef<'h4'>) => (
      <h4 className="text-lg font-semibold tracking-tight mb-2 mt-4" {...props}>
        {children}
      </h4>
    ),
    p: ({ children, ...props }: ComponentPropsWithoutRef<'p'>) => (
      <p className="leading-7 mb-4 text-muted-foreground" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }: ComponentPropsWithoutRef<'ul'>) => (
      <ul className="list-disc list-inside mb-4 space-y-2" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: ComponentPropsWithoutRef<'ol'>) => (
      <ol className="list-decimal list-inside mb-4 space-y-2" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: ComponentPropsWithoutRef<'li'>) => (
      <li className="text-muted-foreground" {...props}>
        {children}
      </li>
    ),
    blockquote: ({ children, ...props }: ComponentPropsWithoutRef<'blockquote'>) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props}>
        {children}
      </blockquote>
    ),
    code: ({ children, className, ...props }: ComponentPropsWithoutRef<'code'> & { className?: string }) => {
      if (className?.includes('language-')) {
        return (
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4" {...props}>
            <code className={className}>{children}</code>
          </pre>
        )
      }
      return (
        <code className="bg-muted px-2 py-1 rounded text-sm" {...props}>
          {children}
        </code>
      )
    },
    pre: ({ children, ...props }: ComponentPropsWithoutRef<'pre'>) => (
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4" {...props}>
        {children}
      </pre>
    ),
    a: ({ children, href, ...props }: ComponentPropsWithoutRef<'a'> & { href?: string }) => (
      <a 
        href={href} 
        className="text-primary hover:underline" 
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    ),
    strong: ({ children, ...props }: ComponentPropsWithoutRef<'strong'>) => (
      <strong className="font-semibold text-foreground" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }: ComponentPropsWithoutRef<'em'>) => (
      <em className="italic" {...props}>
        {children}
      </em>
    ),
    hr: (props: ComponentPropsWithoutRef<'hr'>) => (
      <hr className="border-border my-8" {...props} />
    ),
  }

  return (
    <div className="prose prose-lg max-w-none">
      <MDXRemote {...serializedContent} components={components} />
    </div>
  )
}