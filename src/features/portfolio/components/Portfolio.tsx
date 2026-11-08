'use client';

import '@/styles/portfolio.scss';

import { useState } from 'react';

import { AmbientCollectionBackground } from '@/components/backgrounds';

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getErrorMessage } from '@/lib/api';

import PortfolioCard from '@/features/portfolio/components/PortfolioCard';
import { fetchPortfolioPage, type PortfolioPage, type PortfolioProject } from '@/features/portfolio/data';

export default function Portfolio({ firstPage }: { firstPage: PortfolioPage }) {
  const [projects, setProjects] = useState<PortfolioProject[]>(firstPage.items);
  const [page, setPage] = useState(firstPage.page);
  const [last, setLast] = useState(firstPage.last);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadMore = async () => {
    if (loading || last) return;
    setLoading(true);
    try {
      const next = await fetchPortfolioPage(page + 1);
      setProjects((prev) => [...prev, ...next.items.filter((item) => !prev.some((p) => p.id === item.id))]);
      setPage(next.page);
      setLast(next.last);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err, '프로젝트를 더 불러오지 못했습니다.'));
    } finally {
      setLoading(false);
    }
  };

  const sentinelRef = useInfiniteScroll({ hasMore: !last && !error, loading, onLoadMore: loadMore });
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
          <div ref={sentinelRef} aria-hidden='true' />
          {loading && <p className='list-status'>불러오는 중...</p>}
          {error && (
            <p className='list-status' role='alert'>
              {error}{' '}
              <button type='button' className='list-retry' onClick={() => setError('')}>
                다시 시도
              </button>
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
