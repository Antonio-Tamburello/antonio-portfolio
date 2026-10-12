import { ChipList, Eyebrow, PageContainer, Tile } from '@/components/site/bento';
import { PageIntro } from '@/components/site/page-intro';
import { formatPeriod, getExperiences, getProfile } from '@/content/load';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experience',
  description:
    'Seven years building products: from frontend lead to Technical BA & QA Lead bringing AI into production.',
};

export default async function ExperiencePage() {
  const [profile, experiences] = await Promise.all([getProfile(), getExperiences()]);
  const intro = profile.pages.experience;

  return (
    <PageContainer>
      <PageIntro
        eyebrow={intro.eyebrow}
        title={intro.title}
        intro={intro.intro}
        aside={
          profile.linkedin && (
            <Tile
              variant="brand"
              href={profile.linkedin}
              className="flex-[1_1_260px] justify-between"
            >
              <Eyebrow>Also on</Eyebrow>
              <span className="text-[26px] font-bold">LinkedIn ↗</span>
            </Tile>
          )
        }
      />

      <div className="flex flex-col gap-3.5 pt-3.5">
        {experiences.map((exp) => (
          <section key={exp.company} className="flex flex-col gap-3.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2 px-2 pt-9">
              <h2 className="text-3xl font-bold tracking-tight">{exp.company}</h2>
              {exp.summary && (
                <span className="font-mono text-xs text-muted-foreground">{exp.summary}</span>
              )}
            </div>

            {exp.roles.map((role) => (
              <article
                key={role.id}
                className={cn(
                  'flex flex-wrap gap-x-8 gap-y-5 rounded-[28px] border bg-card p-7 sm:p-8',
                  role.current ? 'border-brand' : 'border-border',
                )}
              >
                <div className="flex flex-[1_1_240px] flex-col gap-2.5">
                  <span
                    className={cn(
                      'self-start rounded-lg px-2.5 py-1.5 font-mono text-xs',
                      role.current ? 'bg-brand text-brand-foreground' : 'bg-chip',
                    )}
                  >
                    {formatPeriod(role)}
                  </span>
                  <h3 className="text-[21px] font-semibold leading-snug">{role.position}</h3>
                </div>
                <div className="flex flex-[3_1_480px] flex-col gap-4">
                  {role.achievements.length > 0 && (
                    <ul className="flex list-disc flex-col gap-2 pl-[18px] text-[15px] leading-relaxed">
                      {role.achievements.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}
                  <ChipList items={role.technologies} />
                </div>
              </article>
            ))}
          </section>
        ))}
      </div>
    </PageContainer>
  );
}
