/**
 * Site configuration — the one place for look & feel and SEO.
 *
 * - Change `theme.light.accent` / `theme.dark.accent` to recolor the site in each theme
 *   (buttons, highlights, badges, borders of clickable cards).
 * - Texts live in `src/content/*.json` (profile, experience, projects).
 * - Light/dark colors live in `src/app/globals.css` (section "Theme tokens").
 */
export const site = {
  url: 'https://antonio-tamburello.vercel.app',

  /**
   * Accent color per theme. `accentForeground` is the text color on top of the accent:
   * white on dark accents, near-black on light ones.
   */
  theme: {
    /** Light theme: electric blue, readable on the light background. */
    light: { accent: '#2563EB', accentForeground: '#FFFFFF' },
    /** Dark theme: lime. Also used by the link preview image, which is dark. */
    dark: { accent: '#C6F24E', accentForeground: '#0B0B0D' },
  },

  seo: {
    title: 'Antonio Tamburello — Applied AI & LLM Integrations',
    description:
      'I turn customer problems into AI that works in production. Technical BA & QA Lead at Reset, ex Lead Frontend Engineer.',
    keywords: [
      'Applied AI',
      'LLM Integrations',
      'Generative AI',
      'RAG',
      'Forward Deployed Engineer',
      'Solutions Engineer',
      'Technical Business Analyst',
      'Antonio Tamburello',
    ],
  },

  /** Main navigation. Add an item here to add it to the header. */
  nav: [
    { label: 'Work', href: '/#work' },
    { label: 'Experience', href: '/experience' },
    { label: 'Projects', href: '/projects' },
    { label: 'Contact', href: '#contact' },
  ],
} as const;
