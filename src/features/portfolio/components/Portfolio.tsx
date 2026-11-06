import '@/styles/portfolio.scss';

import { AmbientCollectionBackground } from '@/components/backgrounds';

import PortfolioCard from '@/features/portfolio/components/PortfolioCard';
import type { PortfolioProject } from '@/features/portfolio/data';

export default function Portfolio({ projects }: { projects: PortfolioProject[] }) {
  const pinned = projects.filter((project) => project.pinned);
  const others = projects.filter((project) => !project.pinned);

  return (
    <div className='contents-wrap portfolio-page'>
      <AmbientCollectionBackground variant='project' />
      <div className='content'>
        <h2 className='page-title'>Project</h2>

        <section className='portfolio-section pinned-section flex-con gap-2'>
          <div className='section-head col-4'>
            <h3 className='section-title kodchasan'>Pinned</h3>
            <p className='section-desc'>
              사용자 경험과 서비스의 안정성을 고민하며<br />
              진행한 주요 프로젝트입니다. 각 작업에서<br />
              맡은 역할과 문제를 해결한 과정을 소개합니다.
            </p>
          </div>
          <ul className='pinned-list col-8'>
            {pinned.map((project) => (
              <li key={project.id}>
                <PortfolioCard project={project} layout='row' />
              </li>
            ))}
          </ul>
        </section>

        <section className='portfolio-section'>
          <div className='section-head'>
            <h3 className='section-title kodchasan'>Other</h3>
            <p className='section-desc'>다양한 환경에서 쌓아온 작업들.</p>
          </div>
          <ul className='other-grid'>
            {others.map((project) => (
              <li key={project.id}>
                <PortfolioCard project={project} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
