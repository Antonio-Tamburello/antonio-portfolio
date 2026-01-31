import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/tag'
import { getCaseStudyBySlug, getCaseStudies } from '@/content/load'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'

interface CaseStudyPageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies()
  return caseStudies.map((study) => ({
    slug: study.slug
  }))
}

export async function generateMetadata(props: CaseStudyPageProps) {
  const params = await (props.params as any)
  const caseStudy = await getCaseStudyBySlug(params.slug)

  if (!caseStudy) {
    return {
      title: 'Case Study Not Found',
    }
  }

  return {
    title: `${caseStudy.title} - Antonio Tamburello`,
    description: caseStudy.description,
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.description,
      images: [caseStudy.image],
      type: 'article',
      publishedTime: caseStudy.publishedAt,
    },
  }
}

const mdxComponents = {
  h1: (props: any) => <h1 className="text-4xl font-bold tracking-tight mb-8" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-bold tracking-tight mt-12 mb-6" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-bold tracking-tight mt-8 mb-4" {...props} />,
  p: (props: any) => <p className="text-lg leading-relaxed mb-6 text-muted-foreground" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside space-y-2 mb-6 text-muted-foreground" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside space-y-2 mb-6 text-muted-foreground" {...props} />,
  li: (props: any) => <li className="text-lg leading-relaxed" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-primary pl-6 my-6 italic text-lg" {...props} />
  ),
  code: (props: any) => (
    <code className="bg-muted px-2 py-1 rounded text-sm font-mono" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6 text-sm font-mono" {...props} />
  ),
  hr: (props: any) => <hr className="my-12 border-border" {...props} />,
  a: (props: any) => (
    <a
      className="text-primary hover:text-primary/80 underline underline-offset-4"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params
  const caseStudy = await getCaseStudyBySlug(slug)

  if (!caseStudy) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article>
        {/* Header */}
        <section className="py-16 border-b border-border/50">
          <Container>
            <div className="max-w-4xl mx-auto">
              {/* Back button */}
              <div className="mb-8">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/case-studies">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Case Studies
                  </Link>
                </Button>
              </div>

              {/* Hero image */}
              <div className="aspect-video relative rounded-xl overflow-hidden mb-8 bg-muted">
                <Image
                  src={caseStudy.image}
                  alt={caseStudy.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <time dateTime={caseStudy.publishedAt}>
                    {new Date(caseStudy.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>

                {caseStudy.readingTime && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{caseStudy.readingTime}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {caseStudy.tags.map((tag) => (
                  <Tag key={tag} variant="secondary">
                    {tag}
                  </Tag>
                ))}
              </div>

              {/* Title & Description */}
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                {caseStudy.title}
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                {caseStudy.description}
              </p>
            </div>
          </Container>
        </section>

        {/* Content */}
        <section className="py-16">
          <Container>
            <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
              <MDXRemote source={caseStudy.content} components={mdxComponents} />
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="py-16 border-t border-border/50">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Interested in working together?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                I'd love to hear about your project and discuss how we can create something amazing together.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <a href="mailto:antonio.tamburello@email.com">
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

      <Footer />
    </div>
  )
}