import { ButtonLink, ChipList, Eyebrow, PageContainer, Tile } from '@/components/site/bento';
import { ScreenshotGallery } from '@/components/site/screenshot-gallery';
import { getProjectById, getProjects } from '@/content/load';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type ProjectPageProps = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return (await getProjects()).map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectById((await params).id);
  return project ? { title: project.title, description: project.description } : {};
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProjectById((await params).id);
  if (!project) notFound();

  return (
    <PageContainer className="flex flex-col gap-3.5 pt-3">
      <Link
        href="/projects"
        className="px-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← All projects
      </Link>

      <section className="flex flex-wrap gap-3.5">
        <Tile className="flex-[2_1_560px] gap-4 p-7 sm:p-12">
          <Eyebrow className="text-muted-foreground opacity-100">
            {project.label ?? project.category}
          </Eyebrow>
          <h1 className="text-[clamp(36px,4.6vw,60px)] font-bold leading-[1.04] tracking-[-0.04em]">
            {project.title}
          </h1>
          <p className="text-lg text-muted-foreground">{project.description}</p>
          {project.longDescription && (
            <p className="max-w-[720px] leading-relaxed">{project.longDescription}</p>
          )}
          <div className="flex flex-wrap gap-2.5 pt-2">
            {project.demoUrl && (
              <ButtonLink href={project.demoUrl} variant="solid">
                Open live ↗
              </ButtonLink>
            )}
            {project.githubUrl && <ButtonLink href={project.githubUrl}>Source code ↗</ButtonLink>}
          </div>
        </Tile>
        <Tile className="flex-[1_1_280px] gap-3.5">
          <h2 className="text-xl font-semibold">Built with</h2>
          <ChipList items={project.technologies} />
        </Tile>
      </section>

      {project.screenshots && project.screenshots.length > 0 && (
        <section className="flex flex-col gap-3.5 pt-6">
          <h2 className="px-2 text-2xl font-semibold">Screenshots</h2>
          <ScreenshotGallery images={project.screenshots} title={project.title} />
        </section>
      )}
    </PageContainer>
  );
}
