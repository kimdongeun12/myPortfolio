import Blog from '@/features/blog/components/Blog';
import { getBlogFirstPage, getBlogOverview } from '@/features/blog/data';

export const revalidate = 60;

export const generateMetadata = () => {
  return {
    title: '블로그',
    robots: { index: false, follow: true },
    customMeta: {
      pageTitle: 'Blog',
    },
  };
};

export default async function BlogPage() {
  const [firstPage, { stats, tags }] = await Promise.all([getBlogFirstPage(), getBlogOverview()]);
  return <Blog firstPage={firstPage} tags={tags} stats={stats} />;
}
