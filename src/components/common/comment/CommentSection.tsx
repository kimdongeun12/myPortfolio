'use client';

import '@/styles/comment.scss';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import clsx from 'clsx';

import { CommentSkeletons } from '@/components/common/skeleton/ListSkeleton';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getErrorMessage } from '@/lib/api';

import { createComment, deleteComment, fetchCommentPage, fetchComments, updateComment } from './api';
import CommentForm, { type CommentFormOptions } from './CommentForm';
import CommentItem, { type CommentActions } from './CommentItem';
import type { CommentData, CommentInput, CommentTarget } from './types';

export type CommentStats = {
  total: number;
  today: number;
};

type CommentSectionProps = CommentFormOptions & {
  target: CommentTarget;
  title?: string;
  renderHeader?: (stats: CommentStats) => ReactNode;
  headerPosition?: 'above-form' | 'below-form';
  className?: string;
  pageSize?: number;
};

const MAX_RELOAD_SIZE = 50;

const flatten = (comments: CommentData[]): CommentData[] =>
  comments.flatMap((c) => [c, ...flatten(c.replies ?? [])]);

const isToday = (iso: string) => new Date(iso).toDateString() === new Date().toDateString();

export default function CommentSection({
  target,
  title = '댓글',
  renderHeader,
  headerPosition = 'above-form',
  className,
  pageSize,
  ...formOptions
}: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [last, setLast] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState('');
  const [serverStats, setServerStats] = useState<CommentStats | null>(null);
  const loadedPages = useRef(1);

  const { type, id } = target;
  const paged = pageSize !== undefined;

  const fetchFromStart = useCallback(
    async (pages: number) => {
      if (!pageSize) {
        setComments(await fetchComments({ type, id }));
        return;
      }
      const size = Math.min(pageSize * pages, MAX_RELOAD_SIZE);
      const result = await fetchCommentPage({ type, id }, 0, size);
      const reloadedPages = Math.max(1, Math.floor(size / pageSize));
      loadedPages.current = reloadedPages;
      setComments(result.items);
      setPage(reloadedPages - 1);
      setLast(result.last);
      setServerStats({ total: result.totalCount, today: result.todayCount });
    },
    [type, id, pageSize],
  );

  const load = useCallback(async () => {
    try {
      await fetchFromStart(loadedPages.current);
      setLoadError('');
    } catch (error) {
      setLoadError(getErrorMessage(error, '댓글을 불러오지 못했습니다.'));
    } finally {
      setLoading(false);
    }
  }, [fetchFromStart]);

  useEffect(() => {
    loadedPages.current = 1;
    setLoading(true);
    load();
  }, [load]);

  const retryLoad = () => {
    setLoading(true);
    load();
  };

  const loadMore = async () => {
    if (!pageSize || loadingMore || last) return;
    setLoadingMore(true);
    try {
      const result = await fetchCommentPage({ type, id }, page + 1, pageSize);
      setComments((prev) => [...prev, ...result.items.filter((item) => !prev.some((c) => c.id === item.id))]);
      setPage(result.page);
      setLast(result.last);
      setServerStats({ total: result.totalCount, today: result.todayCount });
      loadedPages.current = result.page + 1;
      setMoreError('');
    } catch (error) {
      setMoreError(getErrorMessage(error, '댓글을 더 불러오지 못했습니다.'));
    } finally {
      setLoadingMore(false);
    }
  };

  const sentinelRef = useInfiniteScroll({
    hasMore: paged && !loading && !last && !moreError,
    loading: loadingMore,
    onLoadMore: loadMore,
  });

  const handleCreate = async (input: CommentInput) => {
    await createComment({ type, id }, input);
    await load();
  };

  const handleReply = async (parentId: string, input: CommentInput) => {
    await createComment({ type, id }, input, parentId);
    await load();
  };

  const actions: CommentActions = {
    onEdit: async (commentId, password, content) => {
      await updateComment(commentId, password, content);
      await load();
    },
    onDelete: async (commentId, password) => {
      await deleteComment(commentId, password);
      await load();
    },
  };

  const all = flatten(comments).filter((c) => !c.deleted);
  const stats: CommentStats =
    paged && serverStats ? serverStats : { total: all.length, today: all.filter((c) => isToday(c.createdAt)).length };

  const header = (
    <h3 className='comment-title'>
      {renderHeader ? (
        renderHeader(stats)
      ) : (
        <>
          {title} <span className='comment-count'>{stats.total}</span>
        </>
      )}
    </h3>
  );

  return (
    <section className={clsx('comment-section', `header-${headerPosition}`, className)} aria-label={title}>
      {headerPosition === 'above-form' && header}
      <CommentForm {...formOptions} onSubmit={handleCreate} />
      {headerPosition === 'below-form' && header}

      {loading || (loadError && comments.length === 0) ? (
        <>
          <ul className='comment-list' aria-busy='true'>
            <CommentSkeletons count={3} />
          </ul>
          {loadError && (
            <p className='list-status' role='alert'>
              {loadError}{' '}
              <button type='button' className='list-retry' onClick={retryLoad}>
                다시 시도
              </button>
            </p>
          )}
        </>
      ) : comments.length > 0 ? (
        <ul className='comment-list'>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replyingTo={replyingTo}
              onToggleReply={setReplyingTo}
              onReply={handleReply}
              formOptions={formOptions}
              actions={actions}
            />
          ))}
          {loadingMore && <CommentSkeletons count={2} />}
        </ul>
      ) : (
        <p className='comment-empty'>첫 댓글을 남겨주세요.</p>
      )}

      {paged && (
        <>
          <div ref={sentinelRef} aria-hidden='true' />
          {moreError && (
            <p className='list-status' role='alert'>
              {moreError}{' '}
              <button type='button' className='list-retry' onClick={() => setMoreError('')}>
                다시 시도
              </button>
            </p>
          )}
        </>
      )}
    </section>
  );
}
