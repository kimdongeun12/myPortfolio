import { notFound } from 'next/navigation';

import ProjectForm from '@/features/admin/components/project/ProjectForm';

export const metadata = { title: '프로젝트 수정' };

type PageProps = { params: { id: string } };

export default function AdminProjectEditPage({ params }: PageProps) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  return <ProjectForm projectId={id} />;
}
