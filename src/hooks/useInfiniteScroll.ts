'use client';

import { useEffect, useRef } from 'react';

type InfiniteScrollOptions = {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
};

export function useInfiniteScroll<T extends HTMLElement = HTMLDivElement>({
  hasMore,
  loading,
  onLoadMore,
  rootMargin = '400px 0px',
}: InfiniteScrollOptions) {
  const sentinelRef = useRef<T | null>(null);
  const loadMoreRef = useRef(onLoadMore);
  loadMoreRef.current = onLoadMore;

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMoreRef.current();
      },
      { rootMargin },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loading, rootMargin]);

  return sentinelRef;
}
