"use client";
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TagList } from '@/components/tag'
import { type Project } from '@/content/schemas'
import { ExternalLink, Github, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusColors = {
    active: 'bg-green-500/10 text-green-500 border-green-500/20',
    wip: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    archived: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  }

  const statusLabels = {
    active: 'Active',
    wip: 'Work in Progress',
    archived: 'Archived'
  }

  return (
    <Link href={`/projects/${project.id}`} className="block group">
      <Card className="overflow-hidden transition-all hover:shadow-md z-10 cursor-pointer">
          <div className="aspect-video relative overflow-hidden flex items-center justify-center bg-muted h-full">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <Github className="w-32 h-32" />
          )}
          <div className="absolute top-3 left-3">
            <Badge
              variant="outline"
              className={statusColors[project.status]}
            >
              <Clock className="w-3 h-3 mr-1" />
              {statusLabels[project.status]}
            </Badge>
          </div>
          {project.isFeatured && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-primary/90">
                Featured
              </Badge>
            </div>
          )}
        </div>

          <CardContent className="p-6 flex-1 flex flex-col">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg line-clamp-1">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {project.description}
              </p>
            </div>

            <TagList tags={project.technologies} />

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{project.category}</span>
            </div>
          </div>
        </CardContent>

          <CardFooter className="px-6 pb-6 pt-0 flex flex-wrap gap-2 mt-auto">
          {project.githubUrl ? (
            <span onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              if (project.githubUrl) window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
            }}>
              <Button variant="outline" size="sm" asChild={false}>
                <span className="flex items-center">
                  <Github className="w-4 h-4 mr-2" />
                  Code
                </span>
              </Button>
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-muted text-muted-foreground border border-muted-foreground/20">
              Repo privato
            </span>
          )}
          {project.demoUrl && (
            <span onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              if (project.demoUrl) window.open(project.demoUrl, '_blank', 'noopener,noreferrer');
            }}>
              <Button size="sm" asChild={false}>
                <span className="flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Demo
                </span>
              </Button>
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}