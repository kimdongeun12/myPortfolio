import { Suspense } from 'react';

import '@/styles/blog.scss';

import BlogList from '@/features/blog/components/BlogList';

/** 블로그 목록 (BlogList가 URL 쿼리를 읽으므로 Suspense로 감쌈) */
export default function Blog() {
  return (
    <Suspense>
      <BlogList />
    </Suspense>
  );
}
