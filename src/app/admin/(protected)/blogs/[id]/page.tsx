import { notFound } from 'next/navigation';

import BlogForm from '@/features/admin/components/blog/BlogForm';

export const metadata = { title: '글 수정' };

type PageProps = { params: { id: string } };

export default function AdminBlogEditPage({ params }: PageProps) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  return <BlogForm blogId={id} />;
}
