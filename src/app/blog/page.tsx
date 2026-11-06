import Blog from '@/features/blog/components/Blog';
import { getBlogPosts } from '@/features/blog/data';

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
  const posts = await getBlogPosts();
  return <Blog posts={posts} />;
}
