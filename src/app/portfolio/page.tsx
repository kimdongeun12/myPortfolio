import Portfolio from '@/features/portfolio/components/Portfolio';
import { getPortfolioFirstPage } from '@/features/portfolio/data';
import { pageMetadata } from '@/lib/page-metadata';

export const revalidate = 60;

export const generateMetadata = () => {
  return {
    ...pageMetadata({ title: '포트폴리오', description: '프론트엔드 개발자 김동은이 참여한 프로젝트', path: '/portfolio' }),
    customMeta: {
      pageTitle: 'Portfolio',
    },
  };
};

export default async function PortfolioPage() {
  const firstPage = await getPortfolioFirstPage();
  return <Portfolio firstPage={firstPage} />;
}
