import Blog from '@/features/blog/components/Blog';
import { getBlogFirstPage, getBlogOverview } from '@/features/blog/data';
import { pageMetadata } from '@/lib/page-metadata';

export const revalidate = 60;

export const generateMetadata = () => {
  return {
    ...pageMetadata({ title: '블로그', description: '프론트엔드 개발자 김동은이 공부하고 기록한 글', path: '/blog' }),
    robots: { index: true, follow: true },
    customMeta: {
      pageTitle: 'Blog',
    },
  };
};

export default async function BlogPage() {
  const [firstPage, { stats, tags }] = await Promise.all([getBlogFirstPage(), getBlogOverview()]);
  return <Blog firstPage={firstPage} tags={tags} stats={stats} />;
}
