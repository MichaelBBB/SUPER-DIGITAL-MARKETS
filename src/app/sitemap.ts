import type { MetadataRoute } from 'next';

const BASE = 'https://super-digital-markets-co9n.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['', '/products', '/live-trackers'].map(p => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: p === '' ? 1 : 0.8,
  }));
  return staticPages;
}
