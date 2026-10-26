import { ButtonLink, ChipList, Eyebrow, PageContainer, Tile } from '@/components/site/bento';
import { JsonLd } from '@/components/site/json-ld';
import { mdxComponents } from '@/components/site/mdx-components';
import { ScreenshotGallery } from '@/components/site/screenshot-gallery';
import { site } from '@/config/site';
import { getCaseStudyBySlug, getProfile, getProjectById, getProjects } from '@/content/load';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type ProjectPageProps = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return (await getProjects()).map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const [project, caseStudy] = await Promise.all([getProjectById(id), getCaseStudyBySlug(id)]);
  if (!project) return {};

  // A case study, when there is one, has the more descriptive title and summary.
  const title = caseStudy?.title ?? project.title;
  const description = caseStudy?.description ?? project.description;
  const image = caseStudy?.image ?? project.image;
  const path = `/projects/${project.id}`;

  return {
    title,
    description,
    keywords: [...new Set([...project.technologies, ...(caseStudy?.tags ?? [])])],
    alternates: { canonical: path },
    openGraph: {
      type: caseStudy ? 'article' : 'website',
      url: path,
      title,
      description,
      ...(caseStudy
        ? { publishedTime: caseStudy.publishedAt, authors: ['Antonio Tamburello'] }
        : {}),
      ...(image ? { images: [{ url: image, alt: title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const [project, caseStudy, profile] = await Promise.all([
    getProjectById(id),
    getCaseStudyBySlug(id),
    getProfile(),
  ]);
  if (!project) notFound();

  const url = `${site.url}/projects/${project.id}`;
  const author = { '@type': 'Person', name: profile.name, url: site.url };
  const structuredData: Record<string, unknown>[] = [];
  if (caseStudy) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: caseStudy.title,
      description: caseStudy.description,
      datePublished: caseStudy.publishedAt,
      author,
      url,
      mainEntityOfPage: url,
      image: `${site.url}${caseStudy.image}`,
      keywords: caseStudy.tags.join(', '),
    });
  }
  if (project.githubUrl) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name: project.title,
      description: project.description,
      codeRepository: project.githubUrl,
      author,
      url,
      keywords: project.technologies.join(', '),
    });
  }

  return (
    <PageContainer className="flex flex-col gap-3.5 pt-3">
      {structuredData.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}

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
            {caseStudy && <ButtonLink href="#case-study">Read the case study ↓</ButtonLink>}
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

      {caseStudy && (
        <article id="case-study" className="scroll-mt-24 pt-6">
          <Tile className="gap-0 p-7 sm:p-12">
            <Eyebrow className="text-muted-foreground opacity-100">Case study</Eyebrow>
            <h2 className="mt-4 text-[clamp(28px,3.4vw,44px)] font-bold leading-[1.1] tracking-[-0.03em]">
              {caseStudy.title}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              <time dateTime={caseStudy.publishedAt}>
                {new Date(caseStudy.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              {caseStudy.readingTime && <> · {caseStudy.readingTime}</>}
            </p>
            <div className="mt-6 max-w-[760px]">
              <MDXRemote source={caseStudy.content} components={mdxComponents} />
            </div>
          </Tile>
        </article>
      )}
    </PageContainer>
  );
}
