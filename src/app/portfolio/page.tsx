import Portfolio from '@/features/portfolio/components/Portfolio'

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
