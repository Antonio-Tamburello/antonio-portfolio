import fs from 'fs/promises';
import matter from 'gray-matter';
import path from 'path';
import type { z } from 'zod';
import {
  CaseStudyFrontmatterSchema,
  CompanyExperiencesSchema,
  ProfileSchema,
  ProjectsSchema,
  type CaseStudyFrontmatter,
  type CompanyExperience,
  type Profile,
  type Project,
  type Role,
} from './schemas';

export type { CompanyExperience, Role };

const contentDir = path.join(process.cwd(), 'src/content');

/** Reads a JSON file from src/content and validates it against its schema. */
async function readJson<T extends z.ZodTypeAny>(file: string, schema: T): Promise<z.infer<T>> {
  const raw = await fs.readFile(path.join(contentDir, file), 'utf8');
  const result = schema.safeParse(JSON.parse(raw));
  if (!result.success) {
    throw new Error(`Invalid content in src/content/${file}:\n${result.error.message}`);
  }
  return result.data;
}

// ---------- Profile ----------

export function getProfile(): Promise<Profile> {
  return readJson('profile.json', ProfileSchema);
}

// ---------- Projects ----------

export function getProjects(): Promise<Project[]> {
  return readJson('projects.json', ProjectsSchema);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return (await getProjects()).filter((project) => project.isFeatured);
}

export async function getProjectById(id: string): Promise<Project | null> {
  return (await getProjects()).find((project) => project.id === id) ?? null;
}

// ---------- Experience ----------

export function getExperiences(): Promise<CompanyExperience[]> {
  return readJson('experience.json', CompanyExperiencesSchema);
}

export async function getCurrentExperience(): Promise<{ company: string; role: Role } | null> {
  for (const exp of await getExperiences()) {
    const role = exp.roles.find((r) => r.current);
    if (role) return { company: exp.company, role };
  }
  return null;
}

export type TimelineEntry = {
  key: string;
  years: string;
  title: string;
  company: string;
};

const year = (date: string) => date.slice(0, 4);

/**
 * Short timeline for the home page: one line per role, or one line per company
 * when the company has a `homeTitle`.
 */
export async function getHomeTimeline(): Promise<TimelineEntry[]> {
  const experiences = await getExperiences();
  return experiences.flatMap((exp) => {
    if (exp.homeTitle) {
      const starts = exp.roles.map((r) => r.startDate).sort();
      const current = exp.roles.some((r) => r.current);
      const ends = exp.roles.map((r) => r.endDate ?? '').sort();
      const end = current ? 'now' : year(ends[ends.length - 1]);
      return [
        {
          key: exp.company,
          years: `${year(starts[0])} — ${end}`,
          title: exp.homeTitle,
          company: exp.company,
        },
      ];
    }
    return exp.roles.map((role) => ({
      key: role.id,
      years: `${year(role.startDate)} — ${role.current || !role.endDate ? 'now' : year(role.endDate)}`,
      title: role.position,
      company: exp.company,
    }));
  });
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2025-03" → "Mar 2025" */
export function formatMonth(date: string): string {
  const [y, m] = date.split('-');
  return m ? `${MONTHS[Number(m) - 1]} ${y}` : y;
}

/** "Mar 2025 — Jun 2026" or "Jun 2026 — now" */
export function formatPeriod(role: Pick<Role, 'startDate' | 'endDate' | 'current'>): string {
  const end = role.current || !role.endDate ? 'now' : formatMonth(role.endDate);
  return `${formatMonth(role.startDate)} — ${end}`;
}

// ---------- Case studies (kept for later; not linked from the site right now) ----------

export async function getCaseStudies(): Promise<Array<CaseStudyFrontmatter & { content: string }>> {
  const dir = path.join(contentDir, 'case-studies');
  const files = (await fs.readdir(dir)).filter((file) => file.endsWith('.mdx'));
  const studies = await Promise.all(
    files.map(async (file) => {
      const { data, content } = matter(await fs.readFile(path.join(dir, file), 'utf8'));
      const frontmatter = CaseStudyFrontmatterSchema.parse({
        ...data,
        slug: data.slug || path.basename(file, '.mdx'),
      });
      return { ...frontmatter, content };
    }),
  );
  return studies.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getCaseStudyBySlug(slug: string) {
  return (await getCaseStudies()).find((study) => study.slug === slug) ?? null;
}

export async function getLatestCaseStudy() {
  return (await getCaseStudies())[0] ?? null;
}
