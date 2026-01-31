
import AnimatedBackground from '@/components/ui/animated-background';
import { getProjects } from '@/content/load'
import { ProjectsPageClient } from './projects-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects | Antonio Tamburello',
  description: 'Explore my portfolio of web applications, SaaS products, and open source projects. Built with React, Node.js, and modern technologies.',
  keywords: ['projects', 'portfolio', 'web development', 'React', 'Next.js', 'Node.js'],
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <div className="relative z-10">
        <ProjectsPageClient projects={projects} />
      </div>
    </div>
  )
}
