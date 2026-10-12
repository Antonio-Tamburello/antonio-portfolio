import type { ReactNode } from 'react';
import { HighlightedText } from './bento';

type PageIntroProps = {
  eyebrow: string;
  title: { before: string; highlight: string; after?: string };
  intro: string;
  /** Optional tile shown next to the intro (e.g. a link to LinkedIn). */
  aside?: ReactNode;
};

/** Big intro card at the top of inner pages (Experience, Projects). */
export function PageIntro({ eyebrow, title, intro, aside }: PageIntroProps) {
  return (
    <section className="flex flex-wrap gap-3.5 pt-3">
      <div className="flex flex-[2_1_560px] flex-col gap-4 rounded-[28px] border border-border bg-card p-7 sm:p-12">
        <span className="self-start rounded-full bg-chip px-3.5 py-2 font-mono text-xs uppercase tracking-wider">
          {eyebrow}
        </span>
        <h1 className="text-[clamp(36px,4.6vw,64px)] font-bold leading-[1.04] tracking-[-0.04em]">
          <HighlightedText text={title} />
        </h1>
        <p className="max-w-[640px] text-[17px] leading-relaxed text-muted-foreground">{intro}</p>
      </div>
      {aside}
    </section>
  );
}
