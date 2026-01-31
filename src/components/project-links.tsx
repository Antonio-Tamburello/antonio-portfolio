import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Github, ExternalLink } from 'lucide-react'

interface ProjectLinksProps {
  githubUrl?: string | null;
  demoUrl?: string;
  projectUrl?: string;
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export function ProjectLinks({ githubUrl, demoUrl, projectUrl, align = 'start', className }: ProjectLinksProps) {
  const justify = align === 'center' ? 'justify-center' : align === 'end' ? 'justify-end' : '';
  if (!githubUrl && !demoUrl && !projectUrl) return null;
  return (
    <div className={`flex flex-wrap gap-4 mb-4 ${justify} ${className ?? ''}`}>
      {githubUrl && (
        <Button asChild variant="outline" size="lg">
          <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
            <Github className="w-4 h-4 mr-2" />
            Code
          </Link>
        </Button>
      )}
      {demoUrl && (
        <Button asChild size="lg">
          <Link href={demoUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            Demo
          </Link>
        </Button>
      )}
      {projectUrl && (
        <Button asChild variant="outline" size="lg">
          <Link href={projectUrl}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Progetto
          </Link>
        </Button>
      )}
    </div>
  );
}
