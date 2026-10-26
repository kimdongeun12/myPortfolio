import { notFound } from 'next/navigation';

import '@/styles/blog.scss';

import BlogDetail from '@/features/blog/components/BlogDetail';
import { BLOG_POSTS, getAdjacentPosts, getBlogPost } from '@/features/blog/data';

type PageProps = { params: { id: string } };

// 빌드할 때 글별 상세 페이지를 미리 생성
export const generateStaticParams = () => BLOG_POSTS.map((post) => ({ id: post.id }));

export const generateMetadata = ({ params }: PageProps) => {
  const post = getBlogPost(params.id);
  return { title: post ? post.title : '블로그' };
};

export default function BlogDetailPage({ params }: PageProps) {
  const post = getBlogPost(params.id);
  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(post.id);
  return <BlogDetail post={post} prev={prev} next={next} />;
}
