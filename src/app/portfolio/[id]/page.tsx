import { notFound } from 'next/navigation';

import PortfolioDetail from '@/features/portfolio/components/PortfolioDetail';
import { getPortfolioProject, getPortfolioProjects } from '@/features/portfolio/data';
import { pageMetadata } from '@/lib/page-metadata';

export const revalidate = 60;

type PageProps = { params: Promise<{ id: string }> };

export const generateStaticParams = async () =>
  (await getPortfolioProjects()).map((project) => ({ id: project.id }));

export const generateMetadata = async ({ params }: PageProps) => {
  const { id } = await params;
  const project = await getPortfolioProject(id);
  return pageMetadata({
    title: project ? project.title : '포트폴리오',
    description: project?.summary,
    path: `/portfolio/${id}`,
    type: 'article',
  });
};

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getPortfolioProject(id);
  if (!project) notFound();

  return <PortfolioDetail project={project} />;
}
