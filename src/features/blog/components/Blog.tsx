import { Suspense } from 'react';

import '@/styles/blog.scss';

import BlogList from '@/features/blog/components/BlogList';
import { getBlogStats, getBlogTags } from '@/features/blog/data';
import type { BlogPost } from '@/features/blog/types';

export default function Blog({ posts }: { posts: BlogPost[] }) {
  return (
    <Suspense>
      <BlogList posts={posts} tags={getBlogTags(posts)} stats={getBlogStats(posts)} />
    </Suspense>
  );
}
