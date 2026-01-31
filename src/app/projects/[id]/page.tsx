import { ProjectCarousel } from '@/components/project-carousel';
import { ProjectLinks } from '@/components/project-links';
import AnimatedBackground from '@/components/ui/animated-background';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Tag, TagList } from '@/components/tag';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { getProjects } from '@/content/load';
import { ArrowLeft, Clock, Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ProjectPageProps {
  params: { id: string }
}

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((project) => ({ id: project.id }))
}


export default async function ProjectPage({ params }: ProjectPageProps) {
  const resolvedParams = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.id === resolvedParams.id);
  if (!project) return notFound();

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

  // Social links for Footer
  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/Antonio-Tamburello' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/antonio-tamburello' },
    { name: 'Email', href: 'mailto:antonio.tamburello.dev@gmail.com' }
  ]

  return (
    <div className="relative min-h-screen bg-background">
      <AnimatedBackground />
      <div className="relative z-10">
        <Header />

        <article>
          {/* Header Section */}
          <section className="py-16 border-b border-border/50">
            <Container>
              <div className="max-w-4xl mx-auto">
                {/* Back button */}
                <div className="mb-8">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/projects">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Projects
                    </Link>
                  </Button>
                </div>

                {/* Hero image */}
                <div className="aspect-video relative rounded-xl overflow-hidden mb-8 bg-muted">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Github className="w-32 h-32" />
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge variant="outline" className={statusColors[project.status]}>
                      <Clock className="w-3 h-3 mr-1" />
                      {statusLabels[project.status]}
                    </Badge>
                  </div>
                  {project.isFeatured && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary/90">Featured</Badge>
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">Category:</span>
                    <span>{project.category}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags?.map((tag) => (
                    <Tag key={tag} variant="secondary">
                      {tag}
                    </Tag>
                  ))}
                </div>

                {/* Title & Description */}
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                  {project.title}
                </h1>

                {/* Links (Code/Demo) */}
                <ProjectLinks githubUrl={project.githubUrl} demoUrl={project.demoUrl} />

                <p className="text-xl text-muted-foreground leading-relaxed mb-4">
                  {project.description}
                </p>

                {project.longDescription && (
                  <p className="text-lg text-foreground whitespace-pre-line mb-6">
                    {project.longDescription}
                  </p>
                )}

                {/* Carousel screenshots se presenti */}
                {project.screenshots && project.screenshots.length > 0 && (
                  <ProjectCarousel images={project.screenshots} alt={project.title} />
                )}

                {/* Links (Code/Demo) */}
                <ProjectLinks githubUrl={project.githubUrl} demoUrl={project.demoUrl} align='end' />

                {/* Technologies */}
                <div className="mb-4">
                  <div className='mb-2'>
                    <span className="font-semibold mr-2">Technologies:</span>
                  </div>
                  <TagList tags={project.technologies} />
                </div>
              </div>
            </Container>
          </section>

          {/* CTA Section */}
          <section className="py-16 border-t border-border/50">
            <Container>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Interested in working together?</h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  I'd love to hear about your project and discuss how we can create something amazing together.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <a href="mailto:antonio.tamburello.dev@gmail.com">
                      Get in Touch
                    </a>
                  </Button>

                  <Button variant="outline" size="lg" asChild>
                    <Link href="/projects">
                      View More Projects
                    </Link>
                  </Button>
                </div>
              </div>
            </Container>
          </section>
        </article>

        <Footer socialLinks={socialLinks} />
      </div>
    </div>
  )
}
