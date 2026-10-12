import { z } from 'zod';

/**
 * Content schemas. Every JSON file in src/content is validated against these
 * at build time, so a typo or a missing field fails loudly instead of
 * rendering a broken page.
 */

// "Text with one highlighted part", e.g. "I turn … in [production]."
const HighlightedTextSchema = z.object({
  before: z.string(),
  highlight: z.string(),
  after: z.string().default(''),
});

const PageIntroSchema = z.object({
  eyebrow: z.string(),
  title: HighlightedTextSchema,
  intro: z.string(),
});

// Profile — src/content/profile.json
export const ProfileSchema = z.object({
  name: z.string(),
  headline: z.string(),
  title: z.string(),
  tagline: HighlightedTextSchema,
  location: z.string(),
  locationNote: z.string().optional(),
  email: z.email(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  avatar: z.string(),
  avatarPosition: z.string().default('50% 50%'),
  cards: z.array(z.object({ label: z.string(), title: z.string(), text: z.string() })),
  highlightCard: z.object({ label: z.string(), title: z.string(), href: z.string() }),
  aiWork: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      tags: z.array(z.string()).default([]),
      icon: z.string().optional(),
      /** Where it was built, e.g. "At Reset · internal tool". */
      context: z.string().optional(),
      /** Optional public link (demo, repo, article). */
      url: z.string().optional(),
    }),
  ),
  /** Short line under the "AI in production" title. */
  aiWorkNote: z.string().optional(),
  stack: z.array(z.string()),
  certifications: z.array(
    z.object({ issuer: z.string(), name: z.string(), url: z.string().optional() }),
  ),
  closing: z.string(),
  quote: z.string().optional(),
  pages: z.object({
    experience: PageIntroSchema,
    projects: PageIntroSchema,
  }),
});

// Projects — src/content/projects.json
export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  longDescription: z.string().optional(),
  image: z.string().optional(),
  technologies: z.array(z.string()),
  githubUrl: z.string().nullable().optional(),
  demoUrl: z.string().optional(),
  screenshots: z.array(z.string()).optional(),
  status: z.enum(['active', 'wip', 'archived']),
  isFeatured: z.boolean().default(false),
  category: z.string(),
  /** Small label shown on cards, e.g. "Live · PWA". */
  label: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export const ProjectsSchema = z.array(ProjectSchema);

// Experience — src/content/experience.json (companies, each with one or more roles)
export const RoleSchema = z.object({
  id: z.string(),
  position: z.string(),
  /** "YYYY-MM" */
  startDate: z.string(),
  /** "YYYY-MM"; omit when current */
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  achievements: z.array(z.string()),
  technologies: z.array(z.string()),
  location: z.string().optional(),
});

export const CompanyExperienceSchema = z.object({
  company: z.string(),
  /** Short line under the company name, e.g. "Energy & gas · remote". */
  summary: z.string().optional(),
  location: z.string().optional(),
  /** When set, the home page shows one line for the whole company with this title. */
  homeTitle: z.string().optional(),
  companyUrl: z.string().url().optional(),
  roles: z.array(RoleSchema),
});

export const CompanyExperiencesSchema = z.array(CompanyExperienceSchema);

// Case study frontmatter — src/content/case-studies/*.mdx
export const CaseStudyFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishedAt: z.string(),
  image: z.string(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  readingTime: z.string().optional(),
  category: z.string(),
  slug: z.string(),
  projectUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  demoUrl: z.string().optional(),
});

export type Profile = z.infer<typeof ProfileSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type CompanyExperience = z.infer<typeof CompanyExperienceSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type CaseStudyFrontmatter = z.infer<typeof CaseStudyFrontmatterSchema>;
/** @deprecated kept for older components; use Role */
export type Experience = Role & { company: string; companyUrl?: string };
