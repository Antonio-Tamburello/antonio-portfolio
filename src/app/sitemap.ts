import { site } from '@/config/site';
import { getCaseStudies, getProjects } from '@/content/load';
import type { MetadataRoute } from 'next';

/**
 * /sitemap.xml — the list of pages search engines should index.
 * Case studies are shown on their project page (/case-studies/* redirects there), so only
 * the project URL is listed, dated with the case study when there is one.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, caseStudies] = await Promise.all([getProjects(), getCaseStudies()]);
  const publishedAt = new Map(caseStudies.map((study) => [study.slug, study.publishedAt]));

  const pages: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: 'monthly', priority: 1 },
    { url: `${site.url}/projects`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/experience`, changeFrequency: 'monthly', priority: 0.8 },
  ];

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => {
    const date = publishedAt.get(project.id);
    return {
      url: `${site.url}/projects/${project.id}`,
      ...(date ? { lastModified: new Date(date) } : {}),
      changeFrequency: 'monthly',
      priority: date ? 0.8 : 0.6,
    };
  });

  return [...pages, ...projectPages];
}
