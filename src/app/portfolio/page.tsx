import PortfolioUI from '@/component/unit/portfolio/PortfolioUI'

export const generateMetadata = () => {
  return {
    title: '포트폴리오',
    customMeta: {
      pageTitle: 'Portfolio',
    },
  };
};

export default function Portfolio() {
  return (
    <PortfolioUI/>
  )
}
