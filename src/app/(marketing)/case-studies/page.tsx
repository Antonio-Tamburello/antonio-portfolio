import { getCaseStudies } from '@/content/load'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import AnimatedBackground from '@/components/ui/animated-background'
import { Container } from '@/components/container'
import { SectionHeading } from '@/components/section-heading'
import { CaseStudyCard } from '@/components/case-study-card'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Case Studies | Antonio Tamburello',
  description: 'In-depth case studies showcasing my development process, challenges faced, and solutions delivered across various projects.',
  keywords: ['case studies', 'development process', 'problem solving', 'software architecture', 'project management'],
}

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies()

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 -z-10">
        <AnimatedBackground />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <div className="py-16 flex-1">
        <Container>
          <SectionHeading
            title="Case Studies"
            subtitle={`${caseStudies.length} detailed breakdown${caseStudies.length !== 1 ? 's' : ''} of my work and process`}
            centered
            className="mb-12"
          />

          {caseStudies.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {caseStudies.map((caseStudy) => (
                <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No case studies available yet
              </h3>
              <p className="text-muted-foreground">
                Check back soon for detailed project breakdowns
              </p>
            </div>
          )}
        </Container>
      </div>

        <Footer className="mt-auto" />
      </div>
    </div>
  )
}