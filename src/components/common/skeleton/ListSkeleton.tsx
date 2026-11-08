'use client';

import clsx from 'clsx';
import { ConfigProvider, Skeleton, theme } from 'antd';
import { useSyncExternalStore, type ReactNode } from 'react';

import ImgWrap from '@/components/common/box/ImgWrap';

const subscribe = () => () => {};

const SKELETON_THEME = {
  algorithm: theme.darkAlgorithm,
  components: {
    Skeleton: {
      gradientFromColor: 'rgba(255, 255, 255, 0.08)',
      gradientToColor: 'rgba(255, 255, 255, 0.16)',
    },
  },
};

function SkeletonTheme({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  if (!mounted) return null;
  return <ConfigProvider theme={SKELETON_THEME}>{children}</ConfigProvider>;
}

const range = (count: number) => Array.from({ length: count }, (_, index) => index);

export function PortfolioCardSkeletons({ count, layout = 'column' }: { count: number; layout?: 'row' | 'column' }) {
  return (
    <SkeletonTheme>
      {range(count).map((index) => (
        <li key={`skeleton-${index}`} aria-hidden='true'>
          <div className={clsx('portfolio-card', 'is-skeleton', `is-${layout}`)}>
            <div className='card-thumb'>
              <ImgWrap ratioObj={{ width: 3, height: 2 }}>
                <Skeleton.Node active className='skeleton-fill' />
              </ImgWrap>
            </div>
            <div className='card-info'>
              <Skeleton active title={{ width: '60%' }} paragraph={{ rows: 2 }} />
            </div>
          </div>
        </li>
      ))}
    </SkeletonTheme>
  );
}

export function PostCardSkeletons({ count }: { count: number }) {
  return (
    <SkeletonTheme>
      {range(count).map((index) => (
        <li key={`skeleton-${index}`} aria-hidden='true'>
          <div className='post-card is-skeleton'>
            <Skeleton active title={{ width: '40%' }} paragraph={{ rows: 3 }} />
          </div>
        </li>
      ))}
    </SkeletonTheme>
  );
}

export function CommentSkeletons({ count }: { count: number }) {
  return (
    <SkeletonTheme>
      {range(count).map((index) => (
        <li key={`skeleton-${index}`} className='comment-thread is-skeleton' aria-hidden='true'>
          <Skeleton active avatar title={{ width: '30%' }} paragraph={{ rows: 2 }} />
        </li>
      ))}
    </SkeletonTheme>
  );
}
