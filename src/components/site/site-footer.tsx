import type { Profile } from '@/content/schemas';
import { ButtonLink, PageContainer } from './bento';

/** Closing block with contacts, shown at the bottom of every page (anchor: #contact). */
export function SiteFooter({ profile }: { profile: Profile }) {
  return (
    <PageContainer className="pb-12 pt-[72px]">
      <footer
        id="contact"
        className="flex scroll-mt-24 flex-col gap-7 rounded-[28px] bg-foreground p-8 text-background sm:p-12 lg:p-[72px]"
      >
        <p className="max-w-[900px] text-[clamp(30px,4.8vw,60px)] font-bold leading-[1.06] tracking-[-0.035em]">
          {profile.closing}
        </p>
        <div className="flex flex-wrap gap-2.5">
          <ButtonLink href={`mailto:${profile.email}`} variant="brand">
            {/* Full address on larger screens, short label on phones */}
            <span className="sm:hidden">Email me</span>
            <span className="hidden sm:inline">{profile.email}</span>
          </ButtonLink>
          {profile.linkedin && (
            <ButtonLink href={profile.linkedin} className="bg-background/10 text-background">
              LinkedIn
            </ButtonLink>
          )}
          {profile.github && (
            <ButtonLink href={profile.github} className="bg-background/10 text-background">
              GitHub
            </ButtonLink>
          )}
        </div>
        {profile.quote && <p className="text-sm italic opacity-70">{profile.quote}</p>}
      </footer>
      <p className="mt-6 text-center font-mono text-xs text-muted-foreground">
        © {new Date().getFullYear()} {profile.name}
      </p>
    </PageContainer>
  );
}
