import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { ExperienceItem } from '@/components/experience-item'
import { getExperiences } from '@/content/load'

export const metadata = {
  title: 'Experience - Antonio Tamburello',
  description: 'My professional experience and career journey as a Senior Full Stack Developer.',
}

export default async function ExperiencePage() {
  const experiences = await getExperiences()

  return (
    <div className="min-h-screen">
      <Header />

      <div className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <SectionHeading
                title="Professional Experience"
                description="My career journey and the amazing teams I've had the privilege to work with."
                centered
              />
            </div>

            {/* Experience Timeline */}
            <div className="space-y-8">
              {experiences.map((experience, index: number) => (
                <ExperienceItem
                  key={experience.id}
                  experience={experience}
                />
              ))}
            </div>

            {/* CTA Section */}
            <div className="text-center mt-16 p-8 rounded-2xl bg-muted/30 border border-border/50">
              <h3 className="text-2xl font-bold mb-4">Let's Work Together</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                I'm always interested in new opportunities and collaborations. 
                If you think we'd be a good fit, let's connect!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:antonio.tamburello@email.com"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Get in Touch
                </a>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 hover:bg-accent transition-colors"
                >
                  Download Resume
                </a>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Footer />
    </div>
  )
}