import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Github, ExternalLink } from 'lucide-react'

export function ProjectLinks({ githubUrl, demoUrl, align = 'start' }: {
  githubUrl?: string | null,
  demoUrl?: string,
  align?: 'start' | 'center' | 'end'
}) {
  const justify = align === 'center' ? 'justify-center' : align === 'end' ? 'justify-end' : '';
  return (
    <div className={`flex gap-4 mb-4 ${justify}`}>
      {githubUrl ? (
        <Button asChild variant="outline" size="lg">
          <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
            <Github className="w-4 h-4 mr-2" />
            Code
          </Link>
        </Button>
      ) : null}
      {demoUrl && (
        <Button asChild size="lg">
          <Link href={demoUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            Demo
          </Link>
        </Button>
      )}
      {!githubUrl && !demoUrl && (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-muted text-muted-foreground border border-muted-foreground/20">
          Nessun link disponibile
        </span>
      )}
    </div>
  )
}
