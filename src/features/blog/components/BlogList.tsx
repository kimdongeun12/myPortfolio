'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FiSearch } from 'react-icons/fi';

import { AmbientCollectionBackground } from '@/components/backgrounds';
import TagChip from '@/components/common/TagChip';

import BlogSidebar from '@/features/blog/components/BlogSidebar';
import { PostCardSkeletons } from '@/components/common/skeleton/ListSkeleton';
import PostCard from '@/features/blog/components/PostCard';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getErrorMessage } from '@/lib/api';

import { ALL_TAG, fetchBlogPage } from '@/features/blog/data';
import type { BlogPage, BlogPost, BlogStats } from '@/features/blog/types';

const SEARCH_DELAY = 300;

type BlogListProps = {
  firstPage: BlogPage;
  tags: string[];
  stats: BlogStats;
};

export default function BlogList({ firstPage, tags, stats }: BlogListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get('tag') ?? ALL_TAG;
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>(firstPage.items);
  const [page, setPage] = useState(firstPage.page);
  const [last, setLast] = useState(firstPage.last);
  const [total, setTotal] = useState(firstPage.total);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef(0);
  const isFirstFilter = useRef(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchQuery(query.trim()), SEARCH_DELAY);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (isFirstFilter.current) {
      isFirstFilter.current = false;
      if (activeTag === ALL_TAG && !searchQuery) return;
    }
    const id = ++requestId.current;
    setLoading(true);
    setRefreshing(true);
    setError('');
    fetchBlogPage(0, activeTag, searchQuery)
      .then((result) => {
        if (id !== requestId.current) return;
        setPosts(result.items);
        setPage(result.page);
        setLast(result.last);
        setTotal(result.total);
      })
      .catch((err: unknown) => {
        if (id !== requestId.current) return;
        setPosts([]);
        setPage(-1);
        setLast(false);
        setError(getErrorMessage(err, '글 목록을 불러오지 못했습니다.'));
      })
      .finally(() => {
        if (id !== requestId.current) return;
        setLoading(false);
        setRefreshing(false);
      });
  }, [activeTag, searchQuery]);

  const loadMore = async () => {
    if (loading || last) return;
    const id = ++requestId.current;
    setLoading(true);
    try {
      const result = await fetchBlogPage(page + 1, activeTag, searchQuery);
      if (id !== requestId.current) return;
      setPosts((prev) => [...prev, ...result.items.filter((item) => !prev.some((p) => p.id === item.id))]);
      setPage(result.page);
      setLast(result.last);
      setTotal(result.total);
    } catch (err) {
      if (id === requestId.current) setError(getErrorMessage(err, '글을 더 불러오지 못했습니다.'));
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  };

  const sentinelRef = useInfiniteScroll({ hasMore: !last && !error, loading, onLoadMore: loadMore });

  const selectTag = (tag: string) => {
    const url = tag === ALL_TAG ? pathname : `${pathname}?tag=${encodeURIComponent(tag)}`;
    router.replace(url, { scroll: false });
  };

  return (
    <div className='contents-wrap blog-page'>
      <AmbientCollectionBackground variant='blog-list' />
      <div className='content blog-layout'>
        <BlogSidebar>
          <label className='sidebar-search'>
            <FiSearch aria-hidden />
            <input
              type='search'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='전체 검색'
              aria-label='글 검색'
            />
          </label>

          <p className='sidebar-label'>TAGS</p>
          <div className='tag-list'>
            {tags.map((tag) => (
              <TagChip key={tag} label={tag} active={tag === activeTag} onClick={() => selectTag(tag)} />
            ))}
          </div>

          <p className='sidebar-label'>STATS</p>
          <dl className='sidebar-stats'>
            <dt>POSTS</dt>
            <dd>{stats.posts}</dd>
            <dt>LIKES</dt>
            <dd>{stats.likes}</dd>
            <dt>COMMENTS</dt>
            <dd>{stats.comments}</dd>
          </dl>
        </BlogSidebar>

        <div className='blog-main'>
          <h2 className='list-count' aria-live='polite'>
            {activeTag} : {total}
          </h2>
          {refreshing || (posts.length === 0 && !last) ? (
            <ul className='post-grid' aria-busy='true'>
              <PostCardSkeletons count={4} />
            </ul>
          ) : posts.length > 0 ? (
            <ul className='post-grid' aria-busy={loading}>
              {posts.map((post) => (
                <li key={post.id}>
                  <PostCard post={post} />
                </li>
              ))}
              {loading && <PostCardSkeletons count={2} />}
            </ul>
          ) : (
            !loading && !error && <p className='list-empty'>조건에 맞는 글이 없습니다.</p>
          )}
          <div ref={sentinelRef} aria-hidden='true' />
          {error && (
            <p className='list-status' role='alert'>
              {error}{' '}
              <button type='button' className='list-retry' onClick={() => setError('')}>
                다시 시도
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
