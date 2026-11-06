import type { MetadataRoute } from 'next';

import { getBlogPosts } from '@/features/blog/data';
import { SITE_URL } from '@/lib/site-url';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts();
  return [
    { url: `${SITE_URL}/` },
    { url: `${SITE_URL}/blog` },
    ...posts.map((post) => ({ url: `${SITE_URL}/blog/${post.id}` })),
  ];
}
