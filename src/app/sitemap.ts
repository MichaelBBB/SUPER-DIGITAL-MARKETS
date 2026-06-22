import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return [
    { url: `${base}/`, lastModified: new Date(), priority: 1.0, changeFrequency: 'daily' },
    { url: `${base}/products`, lastModified: new Date(), priority: 0.8, changeFrequency: 'daily' },
    { url: `${base}/checkout`, lastModified: new Date(), priority: 0.5, changeFrequency: 'weekly' },
  ];
}