import Portfolio from '@/features/portfolio/components/Portfolio';
import { getPortfolioFirstPage } from '@/features/portfolio/data';

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
  const firstPage = await getPortfolioFirstPage();
  return <Portfolio firstPage={firstPage} />;
}
