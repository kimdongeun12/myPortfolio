import Portfolio from '@/features/portfolio/components/Portfolio';
import { getPortfolioProjects } from '@/features/portfolio/data';

export const revalidate = 60;

export const generateMetadata = () => {
  return {
    title: '포트폴리오',
    customMeta: {
      pageTitle: 'Portfolio',
    },
  };
};

export default async function PortfolioPage() {
  const projects = await getPortfolioProjects();
  return <Portfolio projects={projects} />;
}
