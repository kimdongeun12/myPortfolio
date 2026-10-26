'use client';

import '@/styles/comment.scss';

import { useState, type ReactNode } from 'react';
import clsx from 'clsx';

import CommentForm, { type CommentFormOptions } from './CommentForm';
import CommentItem from './CommentItem';
import type { CommentData, CommentInput } from './types';

export type CommentStats = {
  total: number; // 답글 포함 전체 개수
  today: number; // 오늘 작성된 개수 (답글 포함)
};

type CommentSectionProps = CommentFormOptions & {
  initialComments?: CommentData[];
  /** 제목 ("댓글", "방명록" 등), 기본 헤더와 스크린리더용 이름에 사용 */
  title?: string;
  /** 헤더를 직접 그릴 때 (예: "오늘 작성된 한마디 2 | 전체 16") */
  renderHeader?: (stats: CommentStats) => ReactNode;
  /** 헤더 위치: 폼 위(기본, 블로그) / 폼 아래(방명록) */
  headerPosition?: 'above-form' | 'below-form';
  className?: string;
  /**
   * 새 댓글·답글이 등록될 때 호출 (나중에 서버 저장을 붙일 자리)
   * parentId가 있으면 답글
   */
  onCreate?: (input: CommentInput & { parentId?: string }) => void;
};

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const toComment = ({ nickname, content }: CommentInput): CommentData => ({
  id: createId(),
  nickname,
  content,
  createdAt: new Date().toISOString(),
});

const flatten = (comments: CommentData[]): CommentData[] =>
  comments.flatMap((c) => [c, ...flatten(c.replies ?? [])]);

const isToday = (iso: string) => new Date(iso).toDateString() === new Date().toDateString();

/**
 * 댓글 영역 (작성 폼 + 댓글/답글 목록)
 * - 블로그 상세, 방명록 등 어디서든 재사용
 * - 지금은 화면 안에서만 추가되며, onCreate로 서버 저장을 연결할 수 있음
 */
export default function CommentSection({
  initialComments = [],
  title = '댓글',
  renderHeader,
  headerPosition = 'above-form',
  className,
  onCreate,
  ...formOptions
}: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleCreate = (input: CommentInput) => {
    setComments((prev) => [toComment(input), ...prev]);
    onCreate?.(input);
  };

  const handleReply = (threadId: string, input: CommentInput) => {
    setComments((prev) =>
      prev.map((c) => (c.id === threadId ? { ...c, replies: [...(c.replies ?? []), toComment(input)] } : c)),
    );
    onCreate?.({ ...input, parentId: threadId });
  };

  const all = flatten(comments);
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

      {comments.length > 0 ? (
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
