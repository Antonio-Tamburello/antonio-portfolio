import { site } from '@/config/site';
import type { MetadataRoute } from 'next';

/** /robots.txt — everything can be indexed; points crawlers to the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
