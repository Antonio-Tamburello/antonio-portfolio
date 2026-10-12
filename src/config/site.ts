/**
 * Site configuration — the one place for look & feel and SEO.
 *
 * - Change `theme.accent` to recolor the whole site (buttons, highlights, badges).
 * - Texts live in `src/content/*.json` (profile, experience, projects).
 * - Light/dark colors live in `src/app/globals.css` (section "Theme tokens").
 */
export const site = {
  url: 'https://antonio-tamburello.vercel.app',

  theme: {
    /** Accent color used across the site. Try '#7DD3FC' (sky) or '#FDBA74' (orange). */
    accent: '#C6F24E',
    /** Text color on top of the accent. Keep it dark for light accents. */
    accentForeground: '#0B0B0D',
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
