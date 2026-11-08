import { Suspense } from 'react';

import '@/styles/blog.scss';

import BlogList from '@/features/blog/components/BlogList';
import type { BlogPage, BlogStats } from '@/features/blog/types';

type BlogProps = {
  firstPage: BlogPage;
  tags: string[];
  stats: BlogStats;
};

export default function Blog({ firstPage, tags, stats }: BlogProps) {
  return (
    <Suspense>
      <BlogList firstPage={firstPage} tags={tags} stats={stats} />
    </Suspense>
  );
}
