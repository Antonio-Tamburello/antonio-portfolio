import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Case studies are not linked from the site for now: send old links to Projects.
  async redirects() {
    return [
      { source: '/case-studies', destination: '/projects', permanent: false },
      { source: '/case-studies/:slug', destination: '/projects/:slug', permanent: false },
    ];
  },
};

export default nextConfig;
