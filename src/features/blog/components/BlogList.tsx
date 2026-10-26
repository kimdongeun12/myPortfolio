'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FiSearch } from 'react-icons/fi';

import { AmbientCollectionBackground } from '@/components/backgrounds';
import TagChip from '@/components/common/TagChip';

import BlogSidebar from '@/features/blog/components/BlogSidebar';
import PostCard from '@/features/blog/components/PostCard';
import { ALL_TAG, BLOG_POSTS, BLOG_STATS, BLOG_TAGS } from '@/features/blog/data';

export default function BlogList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // 선택한 태그는 URL(?tag=Vue)에 저장 → 상세의 태그를 눌러 들어오거나, 새로고침해도 유지
  const activeTag = searchParams.get('tag') ?? ALL_TAG;
  const [query, setQuery] = useState('');

  const selectTag = (tag: string) => {
    const url = tag === ALL_TAG ? pathname : `${pathname}?tag=${encodeURIComponent(tag)}`;
    router.replace(url, { scroll: false });
  };

  const posts = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return BLOG_POSTS.filter((post) => {
      const matchTag = activeTag === ALL_TAG || post.tags.includes(activeTag);
      const matchQuery =
        !keyword || post.title.toLowerCase().includes(keyword) || post.summary.toLowerCase().includes(keyword);
      return matchTag && matchQuery;
    });
  }, [activeTag, query]);

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
            {BLOG_TAGS.map((tag) => (
              <TagChip key={tag} label={tag} active={tag === activeTag} onClick={() => selectTag(tag)} />
            ))}
          </div>

          <p className='sidebar-label'>STATS</p>
          <dl className='sidebar-stats'>
            <dt>POSTS</dt>
            <dd>{BLOG_STATS.posts}</dd>
            <dt>VIEWS</dt>
            <dd>{BLOG_STATS.views}</dd>
            <dt>LIKES</dt>
            <dd>{BLOG_STATS.likes}</dd>
          </dl>
        </BlogSidebar>

        <div className='blog-main'>
          <h2 className='list-count' aria-live='polite'>
            {activeTag} : {posts.length}
          </h2>
          {posts.length > 0 ? (
            <ul className='post-grid'>
              {posts.map((post) => (
                <li key={post.id}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          ) : (
            <p className='list-empty'>조건에 맞는 글이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
