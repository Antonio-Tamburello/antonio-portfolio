import { ChipList, Eyebrow, PageContainer, Tile, TileCta } from '@/components/site/bento';
import { PageIntro } from '@/components/site/page-intro';
import { ProjectTile } from '@/components/site/project-tile';
import { getProfile, getProjects } from '@/content/load';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Open source, side products and experiments by Antonio Tamburello.',
  alternates: { canonical: '/projects' },
};

export default async function ProjectsPage() {
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);
  const intro = profile.pages.projects;

  // Order: work in progress first (the big tile), then projects with an image, then the rest
  const [spotlight, ...others] = [...projects].sort(
    (a, b) => Number(b.status === 'wip') - Number(a.status === 'wip'),
  );
  const withImage = others.filter((p) => p.image && p.status !== 'archived');
  const rest = others.filter((p) => !withImage.includes(p));

  return (
    <PageContainer>
      <PageIntro eyebrow={intro.eyebrow} title={intro.title} intro={intro.intro} />

      <section className="flex flex-wrap gap-3.5 pt-3.5">
        {spotlight && (
          <Tile
            variant="inverted"
            href={`/projects/${spotlight.id}`}
            className="flex-[1_1_100%] flex-row flex-wrap items-end justify-between gap-6 p-7 sm:p-12"
          >
            <span className="flex flex-[1_1_420px] flex-col gap-3.5">
              {spotlight.label && (
                <span className="self-start rounded-lg bg-brand px-2.5 py-1.5 font-mono text-xs uppercase text-brand-foreground">
                  {spotlight.label}
                </span>
              )}
              <span className="text-[clamp(30px,3.6vw,46px)] font-bold tracking-tight">
                {spotlight.title}
              </span>
              <span className="max-w-[560px] text-[17px] leading-relaxed opacity-75">
                {spotlight.description} {spotlight.longDescription}
              </span>
              <TileCta>View project</TileCta>
            </span>
            <ChipList
              items={spotlight.technologies}
              chipClassName="border border-current bg-transparent"
            />
          </Tile>
        )}

        {withImage.map((project) => (
          <Tile
            key={project.id}
            href={`/projects/${project.id}`}
            className="flex-[2_1_560px] gap-0 overflow-hidden p-0 sm:p-0"
          >
            <span className="relative block h-[300px] border-b border-border">
              <Image
                src={project.image!}
                alt={`${project.title} screenshot`}
                fill
                sizes="(min-width: 1024px) 760px, 100vw"
                className="object-cover object-top"
              />
            </span>
            <span className="flex flex-col gap-2.5 p-7">
              <Eyebrow className="text-muted-foreground opacity-100">
                {project.label ?? project.category}
              </Eyebrow>
              <span className="text-2xl font-semibold">{project.title}</span>
              <span className="text-[15px] leading-relaxed text-muted-foreground">
                {project.description}
              </span>
              <ChipList items={project.technologies.slice(0, 3)} className="mt-1" />
              <TileCta>View project</TileCta>
            </span>
          </Tile>
        ))}

        <div className="flex flex-[1_1_300px] flex-col gap-3.5">
          {rest.map((project) => (
            <ProjectTile key={project.id} project={project} className="flex-1" />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
