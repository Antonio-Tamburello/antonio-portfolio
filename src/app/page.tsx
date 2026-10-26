import {
  ButtonLink,
  ChipList,
  Eyebrow,
  HighlightedText,
  PageContainer,
  SectionHeader,
  Tile,
} from '@/components/site/bento';
import { JsonLd } from '@/components/site/json-ld';
import { ProjectTile } from '@/components/site/project-tile';
import { site } from '@/config/site';
import { getFeaturedProjects, getHomeTimeline, getProfile } from '@/content/load';
import { FileText, ScanSearch, Sparkles, type LucideIcon } from 'lucide-react';
import Image from 'next/image';

// Icons available for the "AI in production" cards (profile.json → aiWork[].icon)
const icons: Record<string, LucideIcon> = { FileText, ScanSearch, Sparkles };

export default async function HomePage() {
  const [profile, timeline, projects] = await Promise.all([
    getProfile(),
    getHomeTimeline(),
    getFeaturedProjects(),
  ]);

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    url: site.url,
    jobTitle: profile.title,
    description: site.seo.description,
    image: `${site.url}${profile.avatar}`,
    sameAs: [profile.github, profile.linkedin].filter(Boolean),
    knowsAbout: [...new Set([...site.seo.keywords.slice(0, 6), ...profile.stack])],
  };

  return (
    <PageContainer className="flex flex-col">
      <JsonLd data={person} />
      {/* Hero */}
      <section className="flex flex-wrap gap-3.5 pt-3">
        <div className="flex flex-[2_1_620px] flex-col justify-between gap-8 rounded-[28px] border border-border bg-card p-7 sm:p-12 lg:p-[60px]">
          <span className="self-start rounded-full bg-chip px-3.5 py-2 font-mono text-xs uppercase tracking-wider">
            {profile.headline}
          </span>
          <h1 className="text-[clamp(38px,5.6vw,80px)] font-bold leading-[1.02] tracking-[-0.04em]">
            <HighlightedText text={profile.tagline} />
          </h1>
          <div className="flex flex-wrap gap-2.5">
            {profile.linkedin && (
              <ButtonLink href={profile.linkedin} variant="solid">
                LinkedIn
              </ButtonLink>
            )}
            {profile.github && <ButtonLink href={profile.github}>GitHub</ButtonLink>}
            <ButtonLink href={`mailto:${profile.email}`}>Email</ButtonLink>
          </div>
        </div>

        <div className="relative min-h-[440px] flex-[1_1_300px] overflow-hidden rounded-[28px] border border-border">
          <Image
            src={profile.avatar}
            alt={profile.name}
            fill
            sizes="(min-width: 1024px) 400px, 100vw"
            className="object-cover"
            style={{ objectPosition: profile.avatarPosition }}
            priority
          />
          <div className="absolute inset-x-3.5 bottom-3.5 flex items-center justify-between gap-2.5 rounded-[18px] bg-glass px-4 py-3.5 backdrop-blur">
            <span className="text-sm font-semibold">{profile.location}</span>
            {profile.locationNote && (
              <span className="font-mono text-xs text-muted-foreground">
                {profile.locationNote}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Now / Before / AI */}
      <section className="flex flex-wrap gap-3.5 pt-3.5">
        {profile.cards.map((card) => (
          <Tile key={card.label} className="flex-[1_1_280px]">
            <Eyebrow className="text-muted-foreground opacity-100">{card.label}</Eyebrow>
            <span className="text-[22px] font-semibold leading-tight">{card.title}</span>
            <span className="text-[15px] leading-relaxed text-muted-foreground">{card.text}</span>
          </Tile>
        ))}
        <Tile
          variant="brand"
          href={profile.highlightCard.href}
          className="flex-[1_1_280px] justify-between"
        >
          <Eyebrow>{profile.highlightCard.label}</Eyebrow>
          <span className="text-[22px] font-semibold leading-tight">
            {profile.highlightCard.title}
          </span>
        </Tile>
      </section>

      {/* AI in production */}
      <section className="flex flex-col gap-5 pt-[72px]">
        <div className="flex flex-col gap-2">
          <SectionHeader id="work" title="AI in production" />
          {profile.aiWorkNote && (
            <p className="max-w-[720px] text-muted-foreground">{profile.aiWorkNote}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-3.5">
          {profile.aiWork.map((item) => {
            const Icon = (item.icon && icons[item.icon]) || Sparkles;
            return (
              <Tile key={item.title} className="min-h-[230px] flex-[1_1_340px] gap-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex size-12 items-center justify-center rounded-[14px] bg-chip">
                    <Icon className="size-[22px]" aria-hidden />
                  </span>
                  {item.context && (
                    <Eyebrow className="text-muted-foreground opacity-100">{item.context}</Eyebrow>
                  )}
                </div>
                <h3 className="text-[23px] font-semibold">{item.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{item.description}</p>
                <ChipList items={item.tags} className="mt-auto" />
                {item.url && (
                  <ButtonLink href={item.url} className="self-start">
                    See it ↗
                  </ButtonLink>
                )}
              </Tile>
            );
          })}
        </div>
      </section>

      {/* Experience + stack + certifications */}
      <section className="flex flex-wrap gap-3.5 pt-[72px]">
        <Tile className="flex-[1_1_420px] gap-1.5">
          <div className="mb-2">
            <SectionHeader
              title="Experience"
              link={{ label: 'Full timeline', href: '/experience' }}
            />
          </div>
          {timeline.map((entry) => (
            <div key={entry.key} className="flex items-start gap-4 border-t border-border py-3">
              <span className="w-[92px] shrink-0 pt-1 font-mono text-xs text-muted-foreground">
                {entry.years}
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="font-semibold">{entry.title}</span>
                <span className="text-sm text-muted-foreground">{entry.company}</span>
              </span>
            </div>
          ))}
        </Tile>

        <div className="flex flex-[1_1_320px] flex-col gap-3.5">
          <Tile className="gap-3.5">
            <h2 className="text-2xl font-semibold">Stack</h2>
            <div className="flex flex-wrap gap-2 text-sm">
              {profile.stack.map((item) => (
                <span key={item} className="rounded-[10px] bg-chip px-3 py-2">
                  {item}
                </span>
              ))}
            </div>
          </Tile>
          <Tile className="gap-3.5">
            <h2 className="text-2xl font-semibold">
              Certified by {profile.certifications[0]?.issuer}
            </h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {profile.certifications.map((cert) => (
                <span key={cert.name} className="rounded-xl bg-chip p-3">
                  {cert.name}
                </span>
              ))}
            </div>
          </Tile>
        </div>
      </section>

      {/* Projects */}
      <section className="flex flex-col gap-5 pt-[72px]">
        <SectionHeader title="Projects" link={{ label: 'All projects', href: '/projects' }} />
        <div className="flex flex-wrap gap-3.5">
          {projects.map((project) => (
            <ProjectTile key={project.id} project={project} />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
