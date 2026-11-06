'use client';

import '@/styles/comment.scss';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import clsx from 'clsx';

import { getErrorMessage } from '@/lib/api';

import { createComment, fetchComments } from './api';
import CommentForm, { type CommentFormOptions } from './CommentForm';
import CommentItem from './CommentItem';
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
};

const flatten = (comments: CommentData[]): CommentData[] =>
  comments.flatMap((c) => [c, ...flatten(c.replies ?? [])]);

const isToday = (iso: string) => new Date(iso).toDateString() === new Date().toDateString();

export default function CommentSection({
  target,
  title = '댓글',
  renderHeader,
  headerPosition = 'above-form',
  className,
  ...formOptions
}: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const { type, id } = target;

  const load = useCallback(async () => {
    try {
      setComments(await fetchComments({ type, id }));
      setLoadError('');
    } catch (error) {
      setLoadError(getErrorMessage(error, '댓글을 불러오지 못했습니다.'));
    } finally {
      setLoading(false);
    }
  }, [type, id]);

  useEffect(() => {
    let cancelled = false;
    fetchComments({ type, id })
      .then((list) => {
        if (cancelled) return;
        setComments(list);
        setLoadError('');
      })
      .catch((error: unknown) => {
        if (!cancelled) setLoadError(getErrorMessage(error, '댓글을 불러오지 못했습니다.'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [type, id]);

  const handleCreate = async (input: CommentInput) => {
    await createComment({ type, id }, input);
    await load();
  };

  const handleReply = async (parentId: string, input: CommentInput) => {
    await createComment({ type, id }, input, parentId);
    await load();
  };

  const all = flatten(comments).filter((c) => !c.deleted);
  const stats: CommentStats = { total: all.length, today: all.filter((c) => isToday(c.createdAt)).length };

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

      {loadError ? (
        <p className='comment-empty' role='alert'>
          {loadError}
        </p>
      ) : loading ? (
        <p className='comment-empty'>불러오는 중...</p>
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
            />
          ))}
        </ul>
      ) : (
        <p className='comment-empty'>첫 댓글을 남겨주세요.</p>
      )}
    </section>
  );
}
