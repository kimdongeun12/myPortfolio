import Blog from '@/component/unit/blog/Blog.index'
import '/public/styles/blog.scss';

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
