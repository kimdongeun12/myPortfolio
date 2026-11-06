'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FiSearch } from 'react-icons/fi';

import { AmbientCollectionBackground } from '@/components/backgrounds';
import TagChip from '@/components/common/TagChip';

import BlogSidebar from '@/features/blog/components/BlogSidebar';
import PostCard from '@/features/blog/components/PostCard';
import { ALL_TAG } from '@/features/blog/data';
import type { BlogPost, BlogStats } from '@/features/blog/types';

type BlogListProps = {
  posts: BlogPost[];
  tags: string[];
  stats: BlogStats;
};

export default function BlogList({ posts: allPosts, tags, stats }: BlogListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get('tag') ?? ALL_TAG;
  const [query, setQuery] = useState('');

  const selectTag = (tag: string) => {
    const url = tag === ALL_TAG ? pathname : `${pathname}?tag=${encodeURIComponent(tag)}`;
    router.replace(url, { scroll: false });
  };

  const posts = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return allPosts.filter((post) => {
      const matchTag = activeTag === ALL_TAG || post.tags.includes(activeTag);
      const matchQuery =
        !keyword || post.title.toLowerCase().includes(keyword) || post.summary.toLowerCase().includes(keyword);
      return matchTag && matchQuery;
    });
  }, [allPosts, activeTag, query]);

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
