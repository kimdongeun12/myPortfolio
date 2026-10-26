import { notFound } from 'next/navigation';

import PortfolioDetail from '@/features/portfolio/components/PortfolioDetail';
import { getPortfolioProject, PORTFOLIO_PROJECTS } from '@/features/portfolio/data';

type PageProps = { params: { id: string } };

// 빌드할 때 프로젝트별 상세 페이지를 미리 생성
export const generateStaticParams = () =>
  PORTFOLIO_PROJECTS.map((project) => ({ id: project.id }));

export const generateMetadata = ({ params }: PageProps) => {
  const project = getPortfolioProject(params.id);
  return { title: project ? project.title : '포트폴리오' };
};

export default function PortfolioDetailPage({ params }: PageProps) {
  const project = getPortfolioProject(params.id);
  if (!project) notFound();

  return <PortfolioDetail project={project} />;
}
