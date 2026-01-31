import { CaseStudyCard } from '@/components/case-study-card'
import { Container } from '@/components/container'
import { ExperienceItem } from '@/components/experience-item'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { ProjectCard } from '@/components/project-card'
import { SectionHeading } from '@/components/section-heading'
import { TagList } from '@/components/tag'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  getExperiences,
  getFeaturedProjects,
  getLatestCaseStudy,
  getProfile
} from '@/content/load'
import {
  ArrowRight,
  BookOpen,
  Brain,
  Code2,
  Rocket,
  Sparkles,
  TrendingUp,
  Users,
  Wrench
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Dynamic imports for Lucide icons based on profile data
const iconMap: Record<string, any> = {
  Users,
  Code2,
  TrendingUp,
  Rocket,
  Sparkles,
  Brain,
  Wrench,
  BookOpen
}

export default async function HomePage() {
  const profile = await getProfile()
  const featuredProjects = await getFeaturedProjects()
  const latestCaseStudy = await getLatestCaseStudy()
  const experiences = await getExperiences()
  const recentExperiences = experiences.slice(0, 2)

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="py-20 sm:py-24 lg:py-32">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  Hi, I'm{' '}
                  <span className="bg-linear-to-r from-blue-600 to-cyan-400 dark:from-orange-500 dark:to-yellow-500 bg-clip-text text-transparent">
                    {profile.name}
                  </span>
                </h1>
                <h2 className="text-xl sm:text-2xl text-muted-foreground font-medium">
                  {profile.title}
                </h2>
                <p className="text-lg text-muted-foreground max-w-108">
                  {profile.bio}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/projects">
                    View My Work
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={`mailto:${profile.email}`}>
                    Contact Me
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative z-10">
                <div className="w-64 h-64 xs:w-80 xs:h-80 sm:w-96 sm:h-96 lg:w-md lg:h-112 relative z-10">
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    fill
                    className="rounded-2xl object-cover shadow-2xl"
                    priority
                  />
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-t from-background/20 to-transparent" />
                </div>
                <Link href={profile.linkedin ?? '#'} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <div className="absolute -bottom-3.5 -right-3.5 bg-card border rounded-lg p-3 shadow-lg text-blue-600 hover:text-blue-800 transition-colors z-10">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-blue-100 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.6 2.001 3.6 4.601v5.595z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <div className="flex justify-center mt-8">
        <h1 className="text-3xl italic text-muted-foreground text-center max-w-4xl">
          <p>"Born too early to explore space, born too late to sail the seas.</p>
          <p>So I navigate the web—one idea at a time."</p>
        </h1>
      </div>
      
      {/* Highlights Section */}
      <section className="py-16">
        <Container>
          <SectionHeading
            title="What I Bring"
            subtitle="Combining technical expertise with business impact"
            centered
            className="mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {profile.highlights.map((highlight) => {
              const Icon = highlight.icon ? iconMap[highlight.icon] : Code2
              return (
                <Card key={highlight.title} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{highlight.title}</h3>
                    <p className="text-muted-foreground">{highlight.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Featured Projects */}
      <section className="py-16">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <SectionHeading
              title="Featured Projects"
              subtitle="A selection of my best work"
            />
            <Button asChild variant="outline">
              <Link href="/projects">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Container>
      </section>

      {/* Latest Case Study */}
      {latestCaseStudy && (
        <section className="py-16">
          <Container>
            <SectionHeading
              title="Latest Case Study"
              subtitle="Deep dive into my process and impact"
              className="mb-8"
              centered
            />

            <div className="max-w-2xl">
              <CaseStudyCard caseStudy={latestCaseStudy} />
            </div>

            <div className="mt-8">
              <Button asChild variant="outline">
                <Link href="/case-studies">
                  All Case Studies
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Container>
        </section>
      )}

      {/* Experience Preview */}
      <section className="py-16">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <SectionHeading
              title="Experience"
              subtitle="Recent roles and achievements"
            />
            <Button asChild variant="outline">
              <Link href="/experience">
                Full Experience
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-0">
            {recentExperiences.map((experience, index) => (
              <ExperienceItem
                key={experience.id}
                experience={experience}
                showTimeline={index < recentExperiences.length - 2}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Skills */}
      <section className="py-16">
        <Container>
          <SectionHeading
            title="Technologies & Skills"
            subtitle="The tools and technologies I work with"
            centered
            className="mb-8"
          />

          <Card className="max-w-4xl mx-auto">
            <CardContent className="pt-6">
              <TagList
                tags={profile.skills}
                className="justify-center"
              />
            </CardContent>
          </Card>
        </Container>
      </section>

      <Footer
        socialLinks={[
          profile.github ? { name: 'GitHub', href: profile.github } : null,
          profile.linkedin ? { name: 'LinkedIn', href: profile.linkedin } : null,
          profile.email ? { name: 'Email', href: `mailto:${profile.email}` } : null,
        ].filter((item): item is { name: string; href: string } => item !== null)}
      />
    </div>
  )
}