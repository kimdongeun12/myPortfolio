'use client';

import '@/styles/comment.scss';

import { useState } from 'react';

import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import type { CommentData, CommentInput } from './types';

type CommentSectionProps = {
  initialComments?: CommentData[];
  /** 제목 ("댓글", "방명록" 등) */
  title?: string;
  placeholder?: string;
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

const countAll = (comments: CommentData[]): number =>
  comments.reduce((sum, c) => sum + 1 + countAll(c.replies ?? []), 0);

/**
 * 댓글 영역 (작성 폼 + 댓글/답글 목록)
 * - 블로그 상세, 방명록 등 어디서든 재사용
 * - 지금은 화면 안에서만 추가되며, onCreate로 서버 저장을 연결할 수 있음
 */
export default function CommentSection({
  initialComments = [],
  title = '댓글',
  placeholder,
  onCreate,
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

  return (
    <section className='comment-section' aria-label={title}>
      <h3 className='comment-title'>
        {title} <span className='comment-count'>{countAll(comments)}</span>
      </h3>

      <CommentForm onSubmit={handleCreate} placeholder={placeholder} />

      {comments.length > 0 ? (
        <ul className='comment-list'>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replyingTo={replyingTo}
              onToggleReply={setReplyingTo}
              onReply={handleReply}
            />
          ))}
        </ul>
      ) : (
        <p className='comment-empty'>첫 댓글을 남겨주세요.</p>
      )}
    </section>
  );
}
