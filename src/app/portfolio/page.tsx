import Portfolio from '@/component/unit/portfolio/Portfolio.index'

export const generateMetadata = () => {
  return {
    title: '포트폴리오',
    customMeta: {
      pageTitle: 'Portfolio',
    },
  };
};

export default function PortfolioPage() {
  return (
    <Portfolio/>
  )
}
