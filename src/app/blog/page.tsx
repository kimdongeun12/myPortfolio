import Blog from '@/features/blog/components/Blog'
import '@/styles/blog.scss';

export const generateMetadata = () => {
  return {
    title: '경력',
    customMeta: {
      pageTitle: 'Blog',
    },
  };
};

export default function BlogPage() {
  return (
    <Blog/>
  )
}
