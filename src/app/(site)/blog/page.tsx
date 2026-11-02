import Blog from '@/features/blog/components/Blog';

export const generateMetadata = () => {
  return {
    title: '블로그',
    customMeta: {
      pageTitle: 'Blog',
    },
  };
};

export default function BlogPage() {
  return <Blog />;
}
