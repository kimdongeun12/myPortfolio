import { notFound } from 'next/navigation';

import '@/styles/blog.scss';

import { extractToc } from '@/components/mdx/headings';
import BlogDetail from '@/features/blog/components/BlogDetail';
import { getAdjacentPosts, getBlogPost, getBlogPosts } from '@/features/blog/data';

export const revalidate = 60;

type PageProps = { params: Promise<{ id: string }> };

export const generateStaticParams = async () => (await getBlogPosts()).map((post) => ({ id: post.id }));

export const generateMetadata = async ({ params }: PageProps) => {
  const { id } = await params;
  const posts = await getBlogPosts();
  const post = await getBlogPost(id, posts.find((item) => item.id === id));
  return {
    title: post ? post.title : '블로그',
    description: post?.summary || undefined,
    robots: { index: true, follow: true },
  };
};

export default async function BlogDetailPage({ params }: PageProps) {
  const { id } = await params;
  const posts = await getBlogPosts();
  const post = await getBlogPost(id, posts.find((item) => item.id === id));
  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(posts, post.id);
  return <BlogDetail post={post} toc={extractToc(post.content)} prev={prev} next={next} />;
}
